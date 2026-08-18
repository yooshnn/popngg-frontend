const common = {
  demo: '팝픈',
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
    },
    rememberId: '팝토모 ID 기억하기',
    submit: '로그인',
    submitting: '로그인 중…',
  },
} as const;

export default common;
