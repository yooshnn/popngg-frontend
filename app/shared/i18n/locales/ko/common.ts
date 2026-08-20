const common = {
  demo: '팝픈',
  header: {
    account: {
      logout: '로그아웃',
      settings: '설정',
      viewProfile: '마이페이지',
    },
    localeToggle: {
      ko: '한국어',
      ja: '日本語',
    },
    login: '로그인',
    menu: {
      close: '메뉴 닫기',
      guide: '가이드',
      helpLabel: '도움말',
      navLabel: '탐색',
      open: '메뉴 열기',
      register: '데이터 등록',
    },
    titleToggle: {
      song: '곡명',
      genre: '장르',
    },
  },
  nav: {
    chart: '채보',
    tool: '도구',
    user: '유저',
  },
  notFound: {
    title: '페이지를 찾을 수 없습니다',
    description: 'URL을 다시 확인해주세요.',
    back: '뒤로 가기',
    home: '홈으로',
  },
  dataState: {
    loading: '데이터를 불러오는 중입니다.',
    empty: '표시할 데이터가 없습니다.',
    error: {
      title: '데이터를 불러오지 못했습니다.',
      description: '잠시 후 다시 시도해주세요.',
      retry: '다시 시도',
    },
  },
  dataTable: {
    search: {
      label: '검색',
      placeholder: '검색어를 입력하세요',
    },
    filter: {
      trigger: '필터',
      close: '필터 닫기',
      clear: '필터 초기화',
      reset: '초기화',
      apply: '적용',
    },
    sort: {
      label: '정렬',
      toAscending: '오름차순으로 변경',
      toDescending: '내림차순으로 변경',
    },
    empty: '0건',
    range: '# {{from}}–{{to}} / {{total}}건',
    pagination: {
      navigation: '페이지 이동',
      first: '첫 페이지',
      previous: '이전 페이지',
      next: '다음 페이지',
      last: '마지막 페이지',
      current: '{{page}} / {{total}} 페이지',
      pageSize: '페이지당 표시 개수',
      pageSizeOption: '{{size}}개씩',
    },
  },
  footer: {
    groups: {
      content: {
        title: '콘텐츠',
        chart: '채보',
        user: '유저',
        tool: '도구',
      },
      link: {
        title: '링크',
        register: '데이터 등록',
        inquiry: '문의',
      },
      doc: {
        title: '문서',
        guide: '가이드',
        terms: '이용약관',
        privacy: '개인정보 처리방침',
      },
    },
    officialSite: '팝픈뮤직 공식 홈페이지',
  },
  login: {
    title: '로그인',
    description: '로그인하고 전체 기능을 이용해보세요.',
    poptomoId: {
      label: '팝토모 ID',
      placeholder: '0000-0000-0000',
      description: '`-`는 입력하지 않아도 됩니다.',
    },
    password: {
      label: '비밀번호',
      placeholder: '비밀번호 입력',
      description: '4~16자의 영문 대소문자와 숫자를 입력하세요.',
      show: '비밀번호 보기',
      hide: '비밀번호 숨기기',
    },
    rememberId: '팝토모 ID 기억하기',
    submit: '로그인',
    register: {
      prefix: '처음이라면',
      label: '플레이 데이터 등록하기',
    },
    help: {
      title: '로그인에 도움이 필요하신가요?',
      findId: '팝토모 ID 확인',
      passwordInquiry: '비밀번호 문의',
    },
  },
  medal: {
    name: {
      'gold-star': '금★',
      'silver-star': '은★',
      'silver-diamond': '은◆',
      'silver-circle': '은●',
      'bronze-star': '동★',
      'bronze-diamond': '동◆',
      'bronze-circle': '동●',
      'easy': 'EASY',
      'long-off': '롱OFF',
      'black-star': '흑★',
      'black-diamond': '흑◆',
      'black-circle': '흑●',
      'none': '없음',
    },
    clearType: {
      'perfect': '퍼펙트',
      'full-combo': '풀콤보',
      'clear': '클리어',
      'assist': '어시스트',
      'failed': '미클리어',
    },
  },
  rank: {
    name: {
      'S+': 'S+',
      'S': 'S',
      'AAA': 'AAA',
      'AA+': 'AA+',
      'AA': 'AA',
      'A+': 'A+',
      'A': 'A',
      'B+': 'B+',
      'B': 'B',
      'C': 'C',
      'D': 'D',
      'E': 'E',
      'none': '없음',
    },
    family: {
      S: 'S',
      AAA: 'AAA',
      AA: 'AA',
      A: 'A',
      B: 'B',
      belowB: 'B 미만',
    },
  },
  user: {
    profile: {
      updatedAt: '{{date}} 갱신',
      popnClass: {
        label: '팝픈클래스',
        shortLabel: '팝클',
        legacyPrefix: '/ 구',
      },
    },
    tab: {
      home: {
        label: '홈',
      },
      records: {
        label: '플레이 데이터',
      },
      progress: {
        label: '순회',
      },
    },
    home: {
      popnClassTargets: {
        title: '팝클 대상곡',
        description: '팝픈클래스 산정에 반영되는 대상곡입니다.',
        calculation: {
          label: '팝픈클래스 계산식',
          current: '현행식',
          legacy: '구 계산식',
        },
        group: {
          newSongs: '신곡',
          oldSongs: '구곡',
          legacy: '대상곡',
        },
        songCount: '{{count}}곡',
        average: '평균 {{value}}',
        empty: '아직 해당하는 기록이 없습니다.',
      },
      levelStats: {
        title: '피자',
        description: '레벨별 메달과 스코어 랭크 분포를 확인할 수 있습니다.',
        mode: {
          label: '집계 유형',
          medal: '메달',
          rank: '랭크',
        },
        level: {
          previous: '이전 레벨',
          next: '다음 레벨',
        },
        totalLabel: '전체 채보',
        chartLabel: '레벨 {{level}} {{mode}} 분포, 전체 {{count}}채보',
      },
    },
  },
} as const;

export default common;
