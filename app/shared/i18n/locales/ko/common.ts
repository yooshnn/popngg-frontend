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
    error: {
      title: '데이터를 불러오지 못했습니다.',
      description: '잠시 후 다시 시도해주세요.',
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
} as const;

export default common;
