import type koCommon from '../ko/common';

type TranslationShape<T> = {
  [Key in keyof T]: T[Key] extends string ? string : TranslationShape<T[Key]>;
};

const common = {
  demo: 'ポップン',
  header: {
    account: {
      logout: 'ログアウト',
      settings: '設定',
      viewProfile: 'マイページ',
    },
    localeToggle: {
      ko: '韓国語',
      ja: '日本語',
    },
    login: 'ログイン',
    menu: {
      close: 'メニューを閉じる',
      guide: 'ガイド',
      helpLabel: 'ヘルプ',
      navLabel: 'ナビゲーション',
      open: 'メニューを開く',
      register: 'データ登録',
    },
    titleToggle: {
      song: '曲名',
      genre: 'ジャンル',
    },
  },
  nav: {
    chart: '譜面',
    tool: 'ツール',
    user: 'ユーザー',
  },
  notFound: {
    title: 'ページが見つかりません',
    description: 'URLをご確認ください。',
    back: '前に戻る',
    home: 'ホームへ',
  },
  dataState: {
    error: {
      title: 'データを読み込めませんでした。',
      description: 'しばらくしてから、もう一度お試しください。',
    },
  },
  footer: {
    groups: {
      content: {
        title: 'コンテンツ',
        chart: '譜面',
        user: 'ユーザー',
        tool: 'ツール',
      },
      link: {
        title: 'リンク',
        register: 'データ登録',
        inquiry: 'お問い合わせ',
      },
      doc: {
        title: 'ドキュメント',
        guide: 'ガイド',
        terms: '利用規約',
        privacy: 'プライバシーポリシー',
      },
    },
    officialSite: 'ポップンミュージック公式ホームページ',
  },
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
