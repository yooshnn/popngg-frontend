(() => {
  const COLLECTOR_VERSION = 1;
  const HOST = 'p.eagate.573.jp';
  const MAX_LEVEL = 50;
  const PAGE_DELAY_MS = [350, 650];
  const DETAIL_DELAY_MS = [250, 450];
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

  const MEDAL_CODES = ['none', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
  const RANK_CODES = ['none', 'e', 'd', 'c', 'b', 'a1', 'a2', 'a3', 's'];
  const DIFFICULTIES = {
    L: 'light',
    LIGHT: 'light',
    EASY: 'light',
    ライト: 'light',
    N: 'normal',
    NORMAL: 'normal',
    ノーマル: 'normal',
    H: 'hyper',
    HYPER: 'hyper',
    ハイパー: 'hyper',
    EX: 'ex',
    エキスパート: 'ex',
  };
  const DETAIL_BLOCK_IDS = ['light', 'normal', 'hyper', 'ex'];

  class CollectError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const randint = ([lo, hi]) => Math.floor(Math.random() * (hi - lo) + lo);
  const normalizeName = text => text.trim().replaceAll('＼', '～').replaceAll('〜', '～');

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

  const levelPageUrl = (level, page) => playdataUrl('mu_lv.html', {
    page,
    version: -1,
    lv: level,
    bemani: 0,
    category: 0,
    keyword: '',
    sort: 'none',
    sort_type: 'none',
  });

  const detailUrl = chartId => playdataUrl('mu_detail.html', { no: chartId, back: 'mu_top' });

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
    const matched = image?.getAttribute('src')?.match(new RegExp(`${prefix}_([a-z0-9]+)\\.png`));
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

  function parseLevelPage(doc, level, warn) {
    const rows = [...doc.querySelectorAll('.mu_list_lv_table > li')].filter(row => !row.classList.contains('st_th'));

    return rows.flatMap((row) => {
      const anchor = row.querySelector('a[href*="mu_detail"]');
      const cells = [...row.children];

      if (!anchor || cells.length < 4) {
        warn('ROW_SHAPE', `lv${level}: 예상과 다른 행 구조 (${row.textContent.trim().slice(0, 40)})`);
        return [];
      }

      const chartId = new URL(anchor.getAttribute('href'), location.origin).searchParams.get('no');
      const captions = cells[0].querySelectorAll('p');
      const rawDifficulty = cells[1].textContent.trim();
      const difficulty = DIFFICULTIES[rawDifficulty] ?? null;
      const rowLevel = toNumber(cells[2].textContent);
      const medal = findImageCode(cells[3], 'meda');
      const rank = findImageCode(cells[3], 'rank');
      const score = toNumber(cells[3].querySelector('p')?.textContent);

      if (!difficulty) {
        warn('UNKNOWN_DIFFICULTY', `lv${level}: 알 수 없는 난이도 "${rawDifficulty}"`);
      }
      if (medal && !MEDAL_CODES.includes(medal)) {
        warn('UNKNOWN_MEDAL', `lv${level}: 알 수 없는 메달 "${medal}"`);
      }
      if (rank && !RANK_CODES.includes(rank)) {
        warn('UNKNOWN_RANK', `lv${level}: 알 수 없는 랭크 "${rank}"`);
      }
      if (rowLevel !== level) {
        warn('LEVEL_MISMATCH', `lv${level} 요청에 lv${rowLevel} 행이 섞여 있습니다.`);
      }

      return [{
        chartId,
        title: normalizeName(anchor.textContent),
        genre: normalizeName(captions[0]?.textContent ?? ''),
        artist: (captions[1]?.textContent ?? '').trim(),
        difficulty: difficulty ?? rawDifficulty,
        level: rowLevel ?? level,
        medal: medal ?? 'none',
        rank: rank ?? 'none',
        score: score ?? 0,
      }];
    });
  }

  function parseDetail(doc, warn) {
    const result = {};
    const readScore = table => toNumber(table.querySelector('.play_value')?.textContent);

    for (const blockId of DETAIL_BLOCK_IDS) {
      const block = doc.getElementById(blockId);
      if (!block) {
        continue;
      }

      const tables = block.querySelectorAll('table');
      if (tables.length < 2) {
        warn('DETAIL_SHAPE', `${blockId} 블록에 표가 ${tables.length}개뿐입니다.`);
        continue;
      }

      result[blockId] = {
        allTimeScore: readScore(tables[0]),
        versionBestScore: readScore(tables[1]),
      };
    }

    if (Object.keys(result).length === 0) {
      warn('DETAIL_EMPTY', '상세 페이지에서 난이도 블록을 찾지 못했습니다.');
    }

    return result;
  }

  const defaultVersionBestFilter = chart => chart.score > 0 && chart.level >= 40;

  async function collect(options = {}) {
    const {
      onProgress = () => {},
      shouldContinue = () => true,
      versionBest = defaultVersionBestFilter,
      maxLevel = MAX_LEVEL,
      includeUnplayed = false,
      profile: providedProfile = null,
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

    const profile = providedProfile ?? readProfile();

    onProgress({ phase: 'profile', done: 0, total: maxLevel, gameId: profile.gameId });

    const charts = [];
    const seen = new Set();
    let pagesFetched = 0;

    for (let level = 1; level <= maxLevel; level += 1) {
      checkpoint();

      const first = await fetchDocument(levelPageUrl(level, 0));
      pagesFetched += 1;
      assertStillEligible(first.html);
      const pageCount = Math.max(first.doc.querySelectorAll('#s_page option').length, 1);
      const pages = [first.doc];

      for (let page = 1; page < pageCount; page += 1) {
        checkpoint();
        await sleep(randint(PAGE_DELAY_MS));
        const next = await fetchDocument(levelPageUrl(level, page));
        pagesFetched += 1;
        assertStillEligible(next.html);
        pages.push(next.doc);
      }

      for (const doc of pages) {
        for (const chart of parseLevelPage(doc, level, warn)) {
          const key = `${chart.chartId}|${chart.difficulty}`;
          if (seen.has(key)) {
            warn('DUPLICATE_CHART', `중복된 차트: ${chart.title} ${chart.difficulty}`);
            continue;
          }
          seen.add(key);
          charts.push(chart);
        }
      }

      onProgress({ phase: 'levels', done: level, total: maxLevel, charts: charts.length });

      if (level < maxLevel) {
        await sleep(randint(PAGE_DELAY_MS));
      }
    }

    if (charts.length === 0) {
      throw new CollectError('NO_CHARTS_FOUND', '채보를 하나도 읽지 못했습니다. 잠시 후 다시 시도해주세요.');
    }

    const played = charts.filter(chart => chart.score > 0 || chart.medal !== 'none' || chart.rank !== 'none');

    if (!includeUnplayed && played.length === 0) {
      throw new CollectError('NO_PLAYDATA', 'pop\'n music 플레이 데이터가 없습니다.');
    }

    let detailsFetched = 0;

    if (versionBest) {
      const filter = typeof versionBest === 'function' ? versionBest : defaultVersionBestFilter;
      const targets = new Map();

      for (const chart of played) {
        if (!filter(chart)) {
          continue;
        }
        const group = targets.get(chart.chartId) ?? [];
        group.push(chart);
        targets.set(chart.chartId, group);
      }

      const total = targets.size;
      onProgress({ phase: 'details', done: 0, total });

      for (const [chartId, group] of targets) {
        checkpoint();

        const detail = parseDetail((await fetchDocument(detailUrl(chartId))).doc, warn);
        detailsFetched += 1;

        for (const chart of group) {
          const block = detail[chart.difficulty];
          if (!block) {
            continue;
          }
          chart.versionBestScore = block.versionBestScore;

          if (block.allTimeScore !== null && block.allTimeScore !== chart.score) {
            warn('SCORE_MISMATCH', `${chart.title} ${chart.difficulty}: 목록 ${chart.score} vs 상세 ${block.allTimeScore}`);
          }
        }

        onProgress({ phase: 'details', done: detailsFetched, total });

        if (detailsFetched < total) {
          await sleep(randint(DETAIL_DELAY_MS));
        }
      }
    }

    const payload = {
      collectorVersion: COLLECTOR_VERSION,
      game: game(),
      collectedAt: new Date().toISOString(),
      profile,
      charts: includeUnplayed ? charts : played,
      warnings,
      stats: {
        levelsScanned: maxLevel,
        pagesFetched,
        detailsFetched,
        chartsFound: charts.length,
        chartsPlayed: played.length,
        elapsedMs: Date.now() - startedAt,
      },
    };

    payload.stats.payloadBytes = new Blob([JSON.stringify(payload)]).size;
    onProgress({ phase: 'done', done: maxLevel, total: maxLevel, stats: payload.stats });

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
        onProgress: (progress) => {
          if (progress.phase === 'profile' && ready.gameId && progress.gameId !== ready.gameId) {
            cancelled = true;
            mismatchError = gameIdMismatchError(ready.gameId, progress.gameId);
          }
          send('progress', { phase: progress.phase, done: progress.done, total: progress.total });
        },
      });

      if (ready.gameId && payload.profile.gameId !== ready.gameId) {
        throw gameIdMismatchError(ready.gameId, payload.profile.gameId);
      }

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

  window.popngg = { version: COLLECTOR_VERSION, origin: POPNGG_ORIGIN, collect, start, CollectError };
})();
