import type koCommon from '../ko/common';

type TranslationShape<T> = {
  [Key in keyof T]: T[Key] extends string ? string : TranslationShape<T[Key]>;
};

const common = {
  demo: 'ポップン',
  login: {
    title: 'ログイン',
    description: 'ログインして、すべての機能をご利用ください。',
    poptomoId: {
      label: 'ポプトモID',
      placeholder: '0000-0000-0000',
      description: '`-`は必要ありません。',
    },
    password: {
      label: 'パスワード',
      placeholder: 'パスワードを入力',
      description: '4〜16文字の半角英数字を入力してください。',
    },
    rememberId: 'ポプトモIDを記憶する',
    submit: 'ログイン',
    submitting: 'ログイン中…',
  },
} as const satisfies TranslationShape<typeof koCommon>;

export default common;
