(() => {
  // 백엔드가 받는 payload 계약의 버전. 팝픈클래스 수집이 붙었지만
  // 업로드 모양은 charts[].versionBestScore 가 하나 늘었을 뿐이라 계약은 그대로 1이다.
  const COLLECTOR_VERSION = 1;
  const HOST = 'p.eagate.573.jp';
  const PAGE_DELAY_MS = [200, 400];
  const FETCH_RETRIES = 2;
  const INDEX_PATH_PATTERN = /^\/game\/popn\/[^/]+\/playdata\/(?:index\.html)?$/;
  const WRONG_PAGE_MESSAGE = 'pop\'n music 플레이데이터 톱 페이지(プレーデータ)에서 실행해주세요.';

  const POPNGG_ORIGIN = (() => {
    try {
      return new URL(document.currentScript.src).origin;
    }
    catch {
      return 'https://popn.gg';
    }
  })();

  const MEDAL_CODES = ['none', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
  const RANK_CODES = ['none', 'e', 'd', 'c', 'b', 'b_plus', 'a1', 'a1_plus', 'a2', 'a2_plus', 'a3', 's', 's_plus'];
  const SUPPORTED_DIFFICULTIES = new Set(['light', 'normal', 'hyper', 'ex']);

  // ---------------------------------------------------------------------------
  // 팝픈클래스 (popclass) 추정
  //
  //   곡별 기여치 = Level * (3750 * Level + MedalBonus + Score - 50000) / 3880000
  //   총합        = 신곡(최신 버전) 상위 20개 + 구곡 상위 40개의 "합"
  //
  //   - Score 는 반드시 이번 버전 스코어(▼VERSION)를 쓴다. 역대 스코어는 쓰지 않는다.
  //   - Score 가 50000 미만인 결과는 계산에 들어가지 않는다.
  //   - Medal 은 버전별 집계가 없으므로 목록에 보이는 (역대) 메달을 그대로 쓴다.
  //   - 메달이 none 이면 이번 버전에 플레이하지 않은 것이므로 후보가 될 수 없다.
  //
  //   메달 코드: a=퍼펙트 / b,c,d=풀콤보 / e,f,g=클리어 / h,i,j=실패 / k=이지 / l=LN OFF
  //   (알파벳 순서와 보너스 크기가 일치하지 않는다. k, l 이 h~j 보다 높다.)
  // ---------------------------------------------------------------------------
  const MEDAL_BONUS = {
    a: 21400,
    b: 17400, c: 17400, d: 17400,
    e: 12400, f: 12400, g: 12400,
    h: 0, i: 0, j: 0,
    k: 6200,
    l: 9300,
  };
  const BEST_MEDAL = 'a';

  const POPCLASS = {
    levelCoef: 3750,
    divisor: 3880000,
    scoreFloor: 50000,
    scoreCap: 100000,
    newLimit: 20,
    oldLimit: 40,
  };

  const FALLBACK_MAX_LEVEL = 50;
  const FALLBACK_NEW_VERSION = 29;
  const DEFAULT_MIN_LEVEL = 1;
  const DEFAULT_DETAIL_BUDGET = 400;

  // mu_lv.html 목록의 난이도 칸은 텍스트, mu_detail.html 은 이미지 파일명으로 난이도를 알려준다.
  const LEVEL_DIFFICULTY_LABELS = new Map([
    ['L', 'light'], ['LIGHT', 'light'],
    ['N', 'normal'], ['NORMAL', 'normal'],
    ['H', 'hyper'], ['HYPER', 'hyper'],
    ['EX', 'ex'], ['EXPERT', 'ex'],
  ]);
  const DETAIL_DIFFICULTY_IMAGES = new Map([
    ['l', 'light'], ['n', 'normal'], ['h', 'hyper'], ['ex', 'ex'],
  ]);

  class CollectError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  }

  // 팝픈클래스 스캔만 걷어내기 위한 신호. 중첩 루프 한가운데서도 빠져나올 수 있어야 해서
  // 반환값 대신 throw 로 올리고, collectPopnClass 경계에서만 잡는다.
  class SkipPopnClass extends Error {}

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const randint = ([lo, hi]) => Math.floor(Math.random() * (hi - lo) + lo);
  const normalizeName = text => text.trim();
  const round4 = value => Math.round(value * 10000) / 10000;

  const toHalfWidth = text => String(text ?? '').replace(
    /[Ａ-Ｚａ-ｚ０-９]/g,
    char => String.fromCharCode(char.charCodeAt(0) - 0xFEE0),
  );

  const toNumber = (text) => {
    const digits = String(text ?? '').replace(/[^\d-]/g, '');
    if (!digits || digits === '-') {
      return null;
    }
    const value = Number.parseInt(digits, 10);
    return Number.isNaN(value) ? null : value;
  };

  const gameSegment = () => location.pathname.match(/^\/game\/popn\/([^/]+)\//)?.[1] ?? null;

  const game = () => {
    const segment = gameSegment();
    if (segment === null) {
      throw new CollectError('WRONG_PAGE', WRONG_PAGE_MESSAGE);
    }
    return segment;
  };

  const assertOnIndexPage = () => {
    if (location.hostname !== HOST || !INDEX_PATH_PATTERN.test(location.pathname)) {
      throw new CollectError('WRONG_PAGE', WRONG_PAGE_MESSAGE);
    }
  };

  const playdataUrl = (page, params) => {
    const query = new URLSearchParams(params).toString();
    return `/game/popn/${game()}/playdata/${page}${query ? `?${query}` : ''}`;
  };

  const topPageUrl = (page, version = -1) => playdataUrl('mu_top.html', { page, version });

  // 메달 내림차순으로 요청하면 메달이 붙은 채보가 앞으로 몰린다.
  // 덕분에 레벨당 10페이지가 넘는 목록도 대부분 1~2페이지만 읽고 끊을 수 있다.
  const levelPageUrl = (page, level, version = -1) => playdataUrl('mu_lv.html', {
    page,
    version,
    lv: level,
    sort: 'medal',
    sort_type: 'down',
  });

  const detailPageUrl = chartId => playdataUrl('mu_detail.html', { no: chartId, back: 'mu_top' });

  const chartIdFromHref = (href) => {
    try {
      return new URL(href, location.origin).searchParams.get('no');
    }
    catch {
      return null;
    }
  };

  // 팝픈클래스 기여치. score 가 없거나 하한 미만이면 0 (계산에 들어가지 않음).
  const chartValue = (level, medal, score) => {
    if (!Number.isFinite(level) || !Number.isFinite(score) || score < POPCLASS.scoreFloor) {
      return 0;
    }
    const bonus = MEDAL_BONUS[medal] ?? 0;
    return (level * (POPCLASS.levelCoef * level + bonus + score - POPCLASS.scoreFloor)) / POPCLASS.divisor;
  };

  // 해당 레벨에서 이론상 나올 수 있는 최대 기여치 (퍼펙트 + 만점).
  const levelCeiling = level => chartValue(level, BEST_MEDAL, POPCLASS.scoreCap);

  // 상세를 열기 전에 알 수 있는 상한.
  // 메달은 확정값이고, 이번 버전 스코어는 역대 스코어를 넘을 수 없다.
  const chartCeiling = (level, medal, lifetimeScore) => chartValue(
    level,
    medal,
    Math.min(lifetimeScore ?? 0, POPCLASS.scoreCap),
  );

  // 상위 N개만 유지하는 컨테이너. cutoff 는 "이 값을 넘어야 진입 가능한 경계".
  class TopValues {
    constructor(limit) {
      this.limit = limit;
      this.items = [];
    }

    get cutoff() {
      return this.items.length < this.limit ? 0 : this.items[this.items.length - 1].value;
    }

    get total() {
      return this.items.reduce((sum, item) => sum + item.value, 0);
    }

    add(item) {
      if (item.value <= 0 || item.value <= this.cutoff) {
        return false;
      }
      this.items.push(item);
      this.items.sort((a, b) => b.value - a.value);
      if (this.items.length > this.limit) {
        this.items.length = this.limit;
      }
      return true;
    }
  }

  async function fetchDocument(url) {
    let lastError = null;

    for (let attempt = 0; attempt <= FETCH_RETRIES; attempt += 1) {
      if (attempt > 0) {
        await sleep(600 * attempt);
      }

      try {
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok) {
          throw new CollectError('FETCH_FAILED', `${response.status} ${url}`);
        }
        const html = await response.text();
        return { html, doc: new DOMParser().parseFromString(html, 'text/html') };
      }
      catch (error) {
        lastError = error;
      }
    }

    throw new CollectError('FETCH_FAILED', `요청에 실패했습니다: ${url} (${lastError?.message ?? 'unknown'})`);
  }

  function readUserState(html) {
    const matched = html.match(/ea_common_template\.userstatus\s*=\s*(\{[\s\S]*?\});/);
    if (!matched) {
      return null;
    }
    try {
      return JSON.parse(matched[1]).state ?? null;
    }
    catch {
      return null;
    }
  }

  function assertEligible(state) {
    if (!state) {
      throw new CollectError('STATE_UNREADABLE', '로그인 상태를 확인하지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.');
    }
    if (state.login !== true) {
      throw new CollectError('NOT_LOGGED_IN', 'e-amusement에 로그인되어 있지 않습니다.');
    }
    if (state.course?.eaBASIC !== true) {
      throw new CollectError('NO_BASIC_COURSE', 'e-amusement 베이직 코스에 가입되어 있지 않습니다.');
    }
    if (state.eapass !== true) {
      throw new CollectError('NO_EAPASS', '참조 중인 e-amusement pass가 없습니다.');
    }
    if (state.playdata !== true) {
      throw new CollectError('NO_PLAYDATA', 'pop\'n music 플레이 데이터가 없습니다.');
    }
  }

  function assertStillEligible(html) {
    const state = readUserState(html);
    if (state) {
      assertEligible(state);
    }
  }

  function parseProfile(doc) {
    const fields = new Map();

    for (const row of doc.querySelectorAll('.st_box > ul > li')) {
      const label = row.querySelector(':scope > p')?.textContent.trim().replace(/^◆/, '');
      const value = row.querySelector(':scope > div')?.textContent.trim();
      if (label && value) {
        fields.set(label, value);
      }
    }

    const gameId = fields.get('ポプともID') ?? null;

    if (!gameId || !/^\d{4}-\d{4}-\d{4}$/.test(gameId)) {
      throw new CollectError('PROFILE_PARSE_FAILED', `플레이어 ID를 찾지 못했습니다. (읽은 라벨: ${[...fields.keys()].join(', ')})`);
    }

    return {
      gameId,
      name: fields.get('プレーヤー名') ?? null,
      character: fields.get('使用キャラクター') ?? null,
      popnClass: fields.get('ポップンクラス') ?? null,
    };
  }

  function readProfile() {
    assertOnIndexPage();
    assertEligible(readUserState(document.documentElement.outerHTML));
    return parseProfile(document);
  }

  function readImageCode(image, prefix) {
    const matched = image?.getAttribute('src')?.match(new RegExp(`${prefix}_([a-z0-9_]+)\\.png`));
    return matched ? matched[1] : null;
  }

  function findImageCode(root, prefix) {
    for (const image of root.querySelectorAll('img')) {
      const code = readImageCode(image, prefix);
      if (code) {
        return code;
      }
    }
    return null;
  }

  // 검색 폼의 select 에서 사이트가 알려주는 최대값을 읽는다.
  // (레벨 상한 50, 최신 버전 번호 등. 버전이 올라가도 코드를 고치지 않아도 되게.)
  function readSelectMax(doc, name) {
    const values = [...doc.querySelectorAll(`select[name="${name}"] option`)]
      .map(option => Number.parseInt(option.value, 10))
      .filter(value => Number.isFinite(value) && value >= 0);
    return values.length ? Math.max(...values) : null;
  }

  // 헤더 행의 정렬 아이콘(data-sort)에서 각 열의 난이도 코드를 읽는다.
  // でっかポップ君(big) 열은 백엔드가 지원하지 않는 채보라 항상 건너뛴다.
  function readColumns(doc, warn) {
    const headerRow = doc.querySelector('.mu_list_table > li.st_th');
    if (!headerRow) {
      warn('HEADER_SHAPE', '목록 헤더를 찾지 못했습니다.');
      return [];
    }

    return [...headerRow.children].slice(1).map(cell => cell.querySelector('[data-sort]')?.getAttribute('data-sort') ?? null);
  }

  function parseTopPage(doc, columns, warn) {
    const rows = [...doc.querySelectorAll('.mu_list_table > li')].filter(row => !row.classList.contains('st_th'));

    return rows.flatMap((row) => {
      const cells = [...row.children];
      const anchor = cells[0]?.querySelector('a[href*="mu_detail"]');

      if (!anchor || cells.length < columns.length + 1) {
        warn('ROW_SHAPE', `예상과 다른 행 구조 (${row.textContent.trim().slice(0, 40)})`);
        return [];
      }

      const chartId = chartIdFromHref(anchor.getAttribute('href'));
      const captions = cells[0].querySelectorAll('p');
      const title = normalizeName(anchor.textContent);
      const genre = normalizeName(captions[0]?.textContent ?? '');
      const artist = (captions[1]?.textContent ?? '').trim();

      return columns.flatMap((difficulty, index) => {
        if (!difficulty || !SUPPORTED_DIFFICULTIES.has(difficulty)) {
          return [];
        }

        const cell = cells[index + 1];
        const medal = findImageCode(cell, 'meda');
        const rank = findImageCode(cell, 'rank');
        const score = toNumber(cell.querySelector('p')?.textContent);

        if (medal && !MEDAL_CODES.includes(medal)) {
          warn('UNKNOWN_MEDAL', `${title} ${difficulty}: 알 수 없는 메달 "${medal}"`);
        }
        if (rank && !RANK_CODES.includes(rank)) {
          warn('UNKNOWN_RANK', `${title} ${difficulty}: 알 수 없는 랭크 "${rank}"`);
        }

        return [{
          chartId,
          title,
          genre,
          artist,
          difficulty,
          medal: medal ?? 'none',
          rank: rank ?? 'none',
          score: score ?? 0,
          // 팝픈클래스 대상곡으로 뽑힌 채보만 나중에 이번 버전 스코어로 채워진다. 나머지는 0.
          versionBestScore: 0,
        }];
      });
    });
  }

  // mu_lv.html 한 페이지. 셀 구성은 [곡정보 / 難易度 / LEVEL / 스코어+메달+랭크].
  function parseLevelPage(doc, warn, unknownLabels) {
    const rows = [...doc.querySelectorAll('.mu_list_lv_table > li')].filter(row => !row.classList.contains('st_th'));

    return rows.flatMap((row) => {
      const cells = [...row.children];
      const anchor = cells[0]?.querySelector('a[href*="mu_detail"]');

      if (!anchor || cells.length < 4) {
        warn('LEVEL_ROW_SHAPE', `예상과 다른 레벨 목록 행 (${row.textContent.trim().slice(0, 40)})`);
        return [];
      }

      const label = toHalfWidth(cells[1].textContent).replace(/\s+/g, '').toUpperCase();
      const difficulty = LEVEL_DIFFICULTY_LABELS.get(label) ?? null;

      // でっかポップ君 등 지원하지 않는 채보는 조용히 건너뛰되, 처음 본 라벨은 한 번만 남긴다.
      if (!difficulty) {
        if (label && !unknownLabels.has(label)) {
          unknownLabels.add(label);
          warn('UNKNOWN_DIFFICULTY', `알 수 없는 난이도 라벨 "${label}" (건너뜁니다)`);
        }
        return [];
      }

      const scoreCell = cells[3];
      const medal = findImageCode(scoreCell, 'meda') ?? 'none';
      const rank = findImageCode(scoreCell, 'rank') ?? 'none';
      const lifetimeScore = toNumber(scoreCell.querySelector('p')?.textContent ?? scoreCell.textContent) ?? 0;

      // 곡 정보 칸은 mu_top.html 과 같은 구조다: <a>제목</a><br><p>장르</p><p>아티스트</p>
      const captions = cells[0].querySelectorAll('p');
      const title = normalizeName(anchor.textContent);

      if (!MEDAL_CODES.includes(medal)) {
        warn('UNKNOWN_MEDAL', `${title} ${difficulty}: 알 수 없는 메달 "${medal}"`);
      }
      if (rank !== 'none' && !RANK_CODES.includes(rank)) {
        warn('UNKNOWN_RANK', `${title} ${difficulty}: 알 수 없는 랭크 "${rank}"`);
      }
      // 클리어 이상(보너스 > 0)의 메달은 노트를 쳐야 나오므로 스코어가 0일 수 없다.
      // 실패 메달(h/i/j)은 시작만 하고 아무것도 안 눌러도 붙으니 0점이 정상이다.
      if ((MEDAL_BONUS[medal] ?? 0) > 0 && lifetimeScore === 0) {
        warn('SCORE_PARSE', `${title} ${difficulty}: 메달(${medal})이 있는데 스코어를 읽지 못했습니다.`);
      }

      return [{
        chartId: chartIdFromHref(anchor.getAttribute('href')),
        title,
        genre: normalizeName(captions[0]?.textContent ?? ''),
        artist: (captions[1]?.textContent ?? '').trim(),
        difficulty,
        level: toNumber(cells[2].textContent),
        medal,
        rank,
        lifetimeScore,
      }];
    });
  }

  // ▼歴代 / ▼VERSION 표를 공통으로 읽는다.
  // 첫 tr.score 는 "SCORE" 라벨, 두 번째가 실제 값이다.
  function parseScoreTable(table) {
    const rows = [...table.querySelectorAll('tr')];
    const result = { score: null, plays: null, clears: null, fullCombos: null, perfects: null };

    const scoreTexts = rows
      .filter(row => row.classList.contains('score'))
      .flatMap(row => [...row.children].map(cell => cell.textContent.trim()))
      .filter(text => text && text.toUpperCase() !== 'SCORE');
    result.score = toNumber(scoreTexts[scoreTexts.length - 1]);

    for (const row of rows) {
      const cells = [...row.children];
      if (cells.length < 2) {
        continue;
      }
      const label = cells[0].textContent.replace(/\s+/g, '');
      const value = toNumber(cells[cells.length - 1].textContent);

      if (label.startsWith('プレー回数')) {
        result.plays = value;
      }
      else if (label.startsWith('クリア回数')) {
        result.clears = value;
      }
      else if (label.startsWith('FULLCOMBO回数')) {
        result.fullCombos = value;
      }
      else if (label.startsWith('PERFECT回数')) {
        result.perfects = value;
      }
    }

    return result;
  }

  // mu_detail.html 은 한 곡의 4개 난이도를 한꺼번에 준다. 그래서 곡 단위로 캐시하면 이득이 크다.
  function parseDetail(doc, chartId, warn) {
    const blocks = {};

    for (const block of doc.querySelectorAll('.mu_detail_tb')) {
      const difficulty = DETAIL_DIFFICULTY_IMAGES.get(readImageCode(block.querySelector(':scope > img'), 'mu') ?? '');
      if (!difficulty) {
        continue;
      }

      const parsed = { lifetime: null, version: null };
      let section = null;

      for (const child of block.children) {
        if (child.classList.contains('item')) {
          section = child.textContent.replace(/\s+/g, '');
        }
        else if (child.tagName === 'TABLE' && section) {
          if (section.includes('VERSION')) {
            parsed.version = parseScoreTable(child);
          }
          else if (section.includes('歴代')) {
            parsed.lifetime = parseScoreTable(child);
          }
          section = null;
        }
      }

      if (!parsed.version) {
        warn('DETAIL_SHAPE', `${chartId} ${difficulty}: VERSION 표를 찾지 못했습니다.`);
      }
      blocks[difficulty] = parsed;
    }

    if (Object.keys(blocks).length === 0) {
      warn('DETAIL_SHAPE', `${chartId}: 상세 표를 하나도 찾지 못했습니다.`);
    }

    return blocks;
  }

  // 최신 버전(신곡) 곡 ID 집합. mu_top 을 버전 필터로 훑으면 2~3페이지면 끝난다.
  async function readNewSongIds(newVersion, ctx) {
    const ids = new Set();
    let page = 0;
    let lastPage = null;

    while (lastPage === null || page < lastPage) {
      ctx.checkpoint();
      if (page > 0) {
        await sleep(randint(PAGE_DELAY_MS));
      }

      const { html, doc } = await fetchDocument(topPageUrl(page, newVersion));
      ctx.countPage();
      assertStillEligible(html);

      if (page === 0) {
        lastPage = Math.max(doc.querySelectorAll('#s_page option').length, 1);
      }

      for (const anchor of doc.querySelectorAll('.mu_list_table > li a[href*="mu_detail"]')) {
        const id = chartIdFromHref(anchor.getAttribute('href'));
        if (id) {
          ids.add(id);
        }
      }

      ctx.onProgress({ phase: 'newsongs', done: page + 1, total: lastPage });
      page += 1;
    }

    return ids;
  }

  // 한 레벨의 목록을 메달 있는 행만 읽는다.
  // 메달 내림차순 정렬이라 메달 없는 행만 나오는 페이지가 등장하면 그 아래는 볼 필요가 없다.
  async function readLevelRows(level, ctx, warn, unknownLabels) {
    const rows = [];
    let page = 0;
    let lastPage = null;

    while (lastPage === null || page < lastPage) {
      ctx.checkpoint();
      if (page > 0) {
        await sleep(randint(PAGE_DELAY_MS));
      }

      const { html, doc } = await fetchDocument(levelPageUrl(page, level));
      ctx.countLevelPage();
      assertStillEligible(html);

      if (page === 0) {
        lastPage = Math.max(doc.querySelectorAll('select[name="page_sl"] option').length, 1);
      }

      let noneSeen = false;
      let gapWarned = false;
      let kept = 0;

      for (const row of parseLevelPage(doc, warn, unknownLabels)) {
        if (row.medal === 'none') {
          noneSeen = true;
          continue;
        }
        // 메달 없는 행 뒤에 다시 메달 있는 행이 나오면 정렬 가정이 깨진 것이다.
        if (noneSeen && !gapWarned) {
          gapWarned = true;
          warn('MEDAL_SORT_GAP', `lv${level} p${page}: 메달 정렬 가정이 깨졌습니다. 조기 종료가 후보를 놓칠 수 있습니다.`);
        }
        rows.push(row);
        kept += 1;
      }

      // 메달 없는 행이 한 번 나오면 그 아래는 전부 메달 없는 행이다.
      // (경계가 걸린 페이지는 이미 받아둔 DOM이라 끝까지 파싱해 정렬 가정을 검사한 뒤 끊는다.)
      if (noneSeen || kept === 0) {
        break;
      }
      page += 1;
    }

    return rows;
  }

  async function readDetail(chartId, cache, ctx, warn) {
    if (cache.has(chartId)) {
      return cache.get(chartId);
    }

    const { html, doc } = await fetchDocument(detailPageUrl(chartId));
    ctx.countDetail();
    assertStillEligible(html);

    const parsed = parseDetail(doc, chartId, warn);
    cache.set(chartId, parsed);

    await sleep(randint(PAGE_DELAY_MS));
    return parsed;
  }

  /**
   * 팝픈클래스 대상곡 수집.
   *
   * 레벨 50부터 한 단계씩 내려가면서,
   *   1. 그 레벨의 이론상 최대 기여치가 이미 확보한 컷라인 아래면 즉시 종료 (아래 레벨은 볼 필요 없음)
   *   2. 메달이 붙은 채보만 목록에서 읽고
   *   3. 상세를 열기 전에 (메달 확정 + 역대 스코어 상한)으로 기여치 상한을 계산해
   *      컷라인을 넘을 수 없는 채보는 상세를 아예 열지 않는다
   *   4. 남은 것만 상세를 열어 VERSION 스코어로 실제 기여치를 확정한다
   *
   * 컷라인이 위에서부터 빠르게 올라가므로 실제 상세 조회 수는 크게 줄어든다.
   */
  async function collectPopnClass(ctx, options) {
    const { warn } = ctx;
    const { newVersion, maxLevel, minLevel, detailBudget } = options;

    const newSongIds = await readNewSongIds(newVersion, ctx);

    const pools = {
      new: new TopValues(POPCLASS.newLimit),
      old: new TopValues(POPCLASS.oldLimit),
    };
    const candidates = [];
    const detailCache = new Map();
    const unknownLabels = new Set();

    let stoppedBy = 'floor';
    let levelReached = maxLevel;

    // 스캔은 levelCeiling(L) 이 컷라인 밑으로 떨어지는 레벨에서 멈춘다.
    // 컷라인이 정해지면 그 지점을 미리 계산할 수 있으므로, 남은 레벨 수를 추정치로 알려준다.
    // (컷라인이 오를수록 추정치가 줄어든다. 컷라인이 아직 0이면 최악의 경우인 minLevel을 쓴다.)
    const predictFloor = () => {
      const cutoff = Math.min(pools.new.cutoff, pools.old.cutoff);
      if (cutoff <= 0) {
        return minLevel;
      }
      for (let candidate = minLevel; candidate <= maxLevel; candidate += 1) {
        if (levelCeiling(candidate) >= cutoff) {
          return candidate;
        }
      }
      return maxLevel;
    };

    // 지금 "작업 중인" 레벨을 알린다. 레벨 하나가 상세 조회 수십 건으로 늘어날 수 있어서
    // 레벨이 끝난 뒤가 아니라 시작할 때와 상세를 열 때마다 보고한다.
    const report = (level) => {
      const done = maxLevel - level;
      ctx.onProgress({
        phase: 'popnclass',
        done,
        total: Math.max(done + 1, maxLevel - predictFloor() + 1),
        level,
        details: detailCache.size,
      });
    };

    for (let level = maxLevel; level >= minLevel; level -= 1) {
      ctx.checkpoint();

      const ceiling = levelCeiling(level);
      if (ceiling <= pools.new.cutoff && ceiling <= pools.old.cutoff) {
        stoppedBy = 'bound';
        break;
      }
      levelReached = level;
      report(level);

      const rows = await readLevelRows(level, ctx, warn, unknownLabels);

      const ranked = rows
        .map(row => ({
          ...row,
          pool: newSongIds.has(row.chartId) ? 'new' : 'old',
          ceiling: chartCeiling(row.level, row.medal, row.lifetimeScore),
        }))
        // ceiling 이 0 이라는 건 역대 스코어부터 이미 50000 미만이라는 뜻이다.
        // 이번 버전 스코어는 역대 스코어를 넘을 수 없으므로 상세를 열어볼 필요가 없다.
        .filter(row => row.ceiling > 0)
        .sort((a, b) => b.ceiling - a.ceiling);

      let outOfBudget = false;

      for (const row of ranked) {
        ctx.checkpoint();
        const pool = pools[row.pool];

        // 컷라인은 루프 도중에도 계속 올라간다. 넘을 수 없게 된 채보는 상세를 열지 않는다.
        if (row.ceiling <= pool.cutoff) {
          continue;
        }

        if (!detailCache.has(row.chartId) && detailCache.size >= detailBudget) {
          warn('DETAIL_BUDGET', `상세 조회 상한(${detailBudget})에 도달해 스캔을 중단합니다.`);
          outOfBudget = true;
          break;
        }

        const detail = await readDetail(row.chartId, detailCache, ctx, warn);
        const version = detail?.[row.difficulty]?.version ?? null;
        const versionScore = version?.score ?? null;
        const value = chartValue(row.level, row.medal, versionScore);

        candidates.push({
          chartId: row.chartId,
          title: row.title,
          difficulty: row.difficulty,
          level: row.level,
          pool: row.pool,
          medal: row.medal,
          rank: row.rank,
          lifetimeScore: row.lifetimeScore,
          versionScore,
          versionPlays: version?.plays ?? null,
          versionClears: version?.clears ?? null,
          versionFullCombos: version?.fullCombos ?? null,
          versionPerfects: version?.perfects ?? null,
          ceiling: round4(row.ceiling),
          value: round4(value),
        });

        pool.add({
          chartId: row.chartId,
          title: row.title,
          genre: row.genre,
          artist: row.artist,
          difficulty: row.difficulty,
          level: row.level,
          medal: row.medal,
          rank: row.rank,
          score: versionScore,
          value,
        });

        report(level);
      }

      if (outOfBudget) {
        stoppedBy = 'budget';
        break;
      }
    }

    // 디버그용 요약. 업로드에는 안 쓴다 — 뽑힌 스코어는 charts[].versionBestScore 로 나간다.
    const pick = item => ({
      title: item.title,
      genre: item.genre,
      artist: item.artist,
      difficulty: item.difficulty,
      medal: item.medal,
      rank: item.rank,
      score: item.score,
    });

    return {
      // 백엔드로 전송하는 부분
      selected: {
        new: pools.new.items.map(pick),
        old: pools.old.items.map(pick),
      },

      // 이하 디버그용. popn.gg 의 toWirePayload() 가 popnClass 통째로 떼고 업로드한다.
      total: round4(pools.new.total + pools.old.total),
      subtotal: { new: round4(pools.new.total), old: round4(pools.old.total) },
      cutoff: { new: round4(pools.new.cutoff), old: round4(pools.old.cutoff) },
      scan: {
        newVersion,
        newSongs: newSongIds.size,
        levelFrom: maxLevel,
        levelReached,
        minLevel,
        stoppedBy,
        detailsFetched: detailCache.size,
        candidatesEvaluated: candidates.length,
      },
      formula: {
        levelCoef: POPCLASS.levelCoef,
        divisor: POPCLASS.divisor,
        scoreFloor: POPCLASS.scoreFloor,
        medalBonus: { ...MEDAL_BONUS },
        limits: { new: POPCLASS.newLimit, old: POPCLASS.oldLimit },
      },
      candidates,
      ranked: {
        new: pools.new.items.map(item => ({ ...item, value: round4(item.value) })),
        old: pools.old.items.map(item => ({ ...item, value: round4(item.value) })),
      },
    };
  }

  async function collect(options = {}) {
    const {
      onProgress = () => {},
      shouldContinue = () => true,
      shouldSkipPopnClass = () => false,
      includeUnplayed = false,
      profile: providedProfile = null,
      fromPage = 0,
      toPage = null, // 배타적 상한. null이면 사이트에서 알려주는 실제 마지막 페이지까지 순회한다.
      popnClass: wantPopnClass = true,
      popnClassMinLevel = DEFAULT_MIN_LEVEL,
      popnClassDetailBudget = DEFAULT_DETAIL_BUDGET,
    } = options;

    assertOnIndexPage();

    const startedAt = Date.now();
    const warnings = [];
    const warn = (code, message) => {
      if (warnings.length < 200) {
        warnings.push({ code, message });
      }
    };
    const checkpoint = () => {
      if (!shouldContinue()) {
        throw new CollectError('ABORTED', '갱신이 취소되었습니다.');
      }
    };

    // 팝픈클래스 구간에서만 쓰는 checkpoint. 취소에 더해 "이 단계만 건너뛰기"까지 본다.
    // 앞 단계(levels)는 건너뛸 대상이 아니므로 위의 checkpoint 를 그대로 쓴다.
    const popnClassCheckpoint = () => {
      checkpoint();
      if (shouldSkipPopnClass()) {
        throw new SkipPopnClass();
      }
    };

    const profile = providedProfile ?? readProfile();

    onProgress({ phase: 'profile', done: 0, total: 1, gameId: profile.gameId });

    const charts = [];
    const seen = new Set();
    let pagesFetched = 0;
    let levelPagesFetched = 0;
    let detailsFetched = 0;
    let columns = [];
    let siteMaxLevel = null;
    let siteNewVersion = null;

    const startPage = Math.max(0, fromPage);
    let endPage = toPage; // 첫 페이지를 읽기 전까지는 실제 마지막 페이지를 모른다.

    for (let page = startPage; endPage === null || page < endPage; page += 1) {
      checkpoint();

      if (page > startPage) {
        await sleep(randint(PAGE_DELAY_MS));
      }

      const { html, doc } = await fetchDocument(topPageUrl(page));
      pagesFetched += 1;
      assertStillEligible(html);

      if (page === startPage) {
        const lastPage = Math.max(doc.querySelectorAll('#s_page option').length, 1);
        endPage = toPage === null ? lastPage : Math.min(toPage, lastPage);
        columns = readColumns(doc, warn);
        siteMaxLevel = readSelectMax(doc, 'lv');
        siteNewVersion = readSelectMax(doc, 'version');
      }

      for (const chart of parseTopPage(doc, columns, warn)) {
        const key = `${chart.chartId}|${chart.difficulty}`;
        if (seen.has(key)) {
          warn('DUPLICATE_CHART', `중복된 차트: ${chart.title} ${chart.difficulty}`);
          continue;
        }
        seen.add(key);
        charts.push(chart);
      }

      onProgress({ phase: 'levels', done: page - startPage + 1, total: endPage - startPage, charts: charts.length });
    }

    if (charts.length === 0) {
      throw new CollectError('NO_CHARTS_FOUND', '채보를 하나도 읽지 못했습니다. 잠시 후 다시 시도해주세요.');
    }

    const played = charts.filter(chart => chart.score > 0 || chart.medal !== 'none' || chart.rank !== 'none');

    if (!includeUnplayed && played.length === 0) {
      throw new CollectError('NO_PLAYDATA', 'pop\'n music 플레이 데이터가 없습니다.');
    }

    let popnClass = null;

    if (wantPopnClass) {
      if (siteMaxLevel === null) {
        warn('SELECT_SHAPE', `레벨 상한을 읽지 못해 기본값 ${FALLBACK_MAX_LEVEL}을 사용합니다.`);
      }
      if (siteNewVersion === null) {
        warn('SELECT_SHAPE', `최신 버전 번호를 읽지 못해 기본값 ${FALLBACK_NEW_VERSION}을 사용합니다.`);
      }

      const ctx = {
        checkpoint: popnClassCheckpoint,
        warn,
        onProgress,
        countPage: () => { pagesFetched += 1; },
        countLevelPage: () => { pagesFetched += 1; levelPagesFetched += 1; },
        countDetail: () => { detailsFetched += 1; },
      };

      try {
        popnClass = await collectPopnClass(ctx, {
          newVersion: siteNewVersion ?? FALLBACK_NEW_VERSION,
          maxLevel: siteMaxLevel ?? FALLBACK_MAX_LEVEL,
          minLevel: Math.max(1, popnClassMinLevel),
          detailBudget: popnClassDetailBudget,
        });
      }
      catch (error) {
        if (!(error instanceof SkipPopnClass)) {
          throw error;
        }
        // 도중에 끊긴 풀은 상위 N개가 덜 찬 상태라, 그대로 쓰면 실제보다 낮은 팝픈클래스가 확정된다.
        // 부분 결과는 버리고 "이번엔 갱신 안 함"으로 남긴다 (versionBestScore 는 전부 0).
        warn('POPCLASS_SKIPPED', '팝픈클래스 대상곡 파악을 건너뛰었습니다.');
        onProgress({ phase: 'popnclass', done: 0, total: 0, skipped: true });
      }
    }

    if (popnClass) {
      // 뽑힌 대상곡의 이번 버전 스코어를 charts 에 되꽂는다.
      // charts 와 played 는 같은 객체를 참조하므로 한쪽만 수정하면 양쪽에 반영된다.
      // (ranked 는 chartId 를 가진 유일한 뷰다. selected 는 chartId 를 떼고 나가므로 여기 못 쓴다.)
      const picks = new Map(
        [...popnClass.ranked.new, ...popnClass.ranked.old]
          .map(item => [`${item.chartId}|${item.difficulty}`, item.score ?? 0]),
      );

      let stamped = 0;
      for (const chart of charts) {
        const best = picks.get(`${chart.chartId}|${chart.difficulty}`);
        if (best !== undefined) {
          chart.versionBestScore = best;
          stamped += 1;
        }
      }

      if (stamped !== picks.size) {
        warn('POPCLASS_UNMATCHED', `대상곡 ${picks.size}개 중 ${picks.size - stamped}개를 charts 에서 찾지 못했습니다.`);
      }
    }

    const payload = {
      collectorVersion: COLLECTOR_VERSION,
      game: game(),
      collectedAt: new Date().toISOString(),
      profile,
      charts: includeUnplayed ? charts : played,
      popnClass,
      warnings,
      stats: {
        levelsScanned: endPage - startPage,
        // mu_top 과 mu_lv 목록 요청을 모두 센다. levelPagesFetched 는 그중 mu_lv 몫의 내역이고
        // 백엔드 계약에 없는 디버그 값이라 업로드 직전에 떨어져 나간다.
        pagesFetched,
        levelPagesFetched,
        detailsFetched,
        chartsFound: charts.length,
        chartsPlayed: played.length,
        elapsedMs: Date.now() - startedAt,
      },
    };

    // start() 가 popn.gg 로 넘기는 전체 페이로드(디버그 포함)의 크기.
    // 실제 업로드는 popn.gg 쪽 toWirePayload() 가 popnClass 를 떼고 보내므로 이 값보다 작다.
    payload.stats.payloadBytes = new Blob([JSON.stringify(payload)]).size;
    onProgress({ phase: 'done', done: endPage - startPage, total: endPage - startPage, stats: payload.stats });

    return payload;
  }

  function createOverlay(html) {
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 100000;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: flex-end;
        justify-content: center;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 100vw;
        padding: 32px 24px;
        border-radius: 20px 20px 0 0;
        background: #18181b;
        color: #f3f4f6;
        font: 15px/1.7 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        box-sizing: border-box;
    `;

    const message = document.createElement('div');
    message.style.cssText = 'padding-right: 32px; word-break: break-word; font-size: 16px;';
    message.innerHTML = html;

    const note = document.createElement('div');
    note.style.cssText = 'margin-top: 20px; color: #9ca3af; font-size: 13px; line-height: 1.6; border-top: 1px solid #27272a; padding-top: 16px;';

    const noteKo = document.createElement('p');
    noteKo.style.cssText = 'margin: 0;';
    noteKo.textContent = '데이터 갱신은 popn.gg에서 진행됩니다. 문제가 발생하면 이 페이지를 새로고침한 뒤 다시 시도해주세요.';

    const noteJa = document.createElement('p');
    noteJa.style.cssText = 'margin: 4px 0 0;';
    noteJa.textContent = 'データの更新は popn.gg で行われます。問題が発生した場合は、このページを再読み込みしてからもう一度お試しください。';

    note.append(noteKo, noteJa);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', '닫기 / 閉じる');
    closeButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        width: 32px;
        height: 32px;
        border: 0;
        background: none;
        color: #9ca3af;
        font: 24px/1 sans-serif;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    `;

    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.color = '#ffffff';
    });
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.color = '#9ca3af';
    });

    const removeOverlay = () => {
      backdrop.remove();
    };

    closeButton.addEventListener('click', removeOverlay);

    panel.append(closeButton, message, note);
    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);

    return { close: removeOverlay };
  }

  async function start(popup, options = {}) {
    if (!popup || popup.closed) {
      createOverlay(`
        popn.gg를 열 수 없습니다. 팝업 차단을 해제한 뒤 다시 시도해주세요.<br>
        popn.ggを開けませんでした。ポップアップブロックを解除してから、もう一度お試しください。
      `);
      return;
    }

    const overlay = createOverlay(`
      데이터를 등록하고 있습니다…<br>データを更新しています…
    `);

    let cancelled = false;
    let finished = false;
    let skipPopnClass = false;
    let mismatchError = null;

    const gameIdMismatchError = (readyGameId, actualGameId) => new CollectError(
      'GAME_ID_MISMATCH',
      `popn.gg 계정(${readyGameId})과 e-amusement 계정(${actualGameId})이 다릅니다.`,
    );

    const send = (type, data) => {
      if (!popup.closed) {
        popup.postMessage({ source: 'popngg-renew', type, ...data }, POPNGG_ORIGIN);
      }
    };

    const sendError = (error) => {
      const code = error instanceof CollectError ? error.code : 'UNKNOWN';
      send('error', { code, message: error.message });
    };

    const profilePromise = (async () => readProfile())();
    profilePromise.catch(() => {});

    let cleanupHandshake = () => {};

    const handshake = new Promise((resolve, reject) => {
      let poll;
      let onMessage;

      const cleanup = () => {
        window.removeEventListener('message', onMessage);
        clearInterval(poll);
      };

      onMessage = (event) => {
        if (event.source !== popup || event.origin !== POPNGG_ORIGIN || event.data?.source !== 'popngg-handoff') {
          return;
        }

        if (event.data.type === 'hello') {
          profilePromise.then(
            profile => send('hint', { gameId: profile.gameId }),
            error => sendError(error),
          );
        }
        if (event.data.type === 'ready') {
          resolve(event.data);
        }
        // 핸드셰이크가 끝난 뒤에도 계속 들어올 수 있어야 한다 (수집 도중에 누르는 버튼이다).
        if (event.data.type === 'skip' && event.data.target === 'popnclass') {
          skipPopnClass = true;
        }
        if (event.data.type === 'abort') {
          cancelled = true;
          cleanup();
          reject(new CollectError('ABORTED', event.data.reason ?? '갱신이 취소되었습니다.'));
        }
        if (event.data.type === 'finished') {
          finished = true;
          overlay.close();
          cleanup();
        }
      };

      cleanupHandshake = cleanup;
      window.addEventListener('message', onMessage);
      poll = setInterval(() => {
        if (popup.closed && !finished) {
          cancelled = true;
          cleanup();
          reject(new CollectError('ABORTED', 'popn.gg 창이 닫혔습니다.'));
        }
      }, 1000);
    });

    try {
      const ready = await handshake;
      const profile = await profilePromise;
      popup.blur();
      window.focus();

      const payload = await collect({
        ...options,
        profile,
        shouldContinue: () => !cancelled,
        shouldSkipPopnClass: () => skipPopnClass,
        onProgress: (progress) => {
          if (progress.phase === 'profile' && ready.gameId && progress.gameId !== ready.gameId) {
            cancelled = true;
            mismatchError = gameIdMismatchError(ready.gameId, progress.gameId);
          }
          send('progress', {
            phase: progress.phase,
            done: progress.done,
            total: progress.total,
            records: progress.charts ?? null,
            level: progress.level ?? null,
            details: progress.details ?? null,
            skipped: progress.skipped ?? false,
          });
        },
      });

      if (ready.gameId && payload.profile.gameId !== ready.gameId) {
        throw gameIdMismatchError(ready.gameId, payload.profile.gameId);
      }

      // popn.gg가 디버그/전송본을 둘 다 보여줄 수 있도록 전체 페이로드를 그대로 넘긴다.
      // 백엔드 계약에 맞추는 축약(popnClass·levelPagesFetched 제거)은 popn.gg 쪽에서 한다.
      window.popngg.lastRun = payload;
      send('payload', { payload });
    }
    catch (error) {
      const reportedError = mismatchError ?? error;
      cleanupHandshake();
      overlay.close();
      sendError(reportedError);
      console.error('[popngg]', reportedError);
    }
  }

  window.popngg = {
    version: COLLECTOR_VERSION,
    origin: POPNGG_ORIGIN,
    collect,
    start,
    chartValue,
    levelCeiling,
    MEDAL_BONUS,
    POPCLASS,
    CollectError,
    lastRun: null,
  };
})();
