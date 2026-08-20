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
    loading: 'データを読み込んでいます。',
    empty: '表示するデータがありません。',
    error: {
      title: 'データを読み込めませんでした。',
      description: 'しばらくしてから、もう一度お試しください。',
      retry: '再試行',
    },
  },
  dataTable: {
    search: {
      label: '検索',
      placeholder: '検索ワードを入力',
    },
    filter: {
      trigger: 'フィルター',
      close: 'フィルターを閉じる',
      clear: 'フィルターをリセット',
      reset: 'リセット',
      apply: '適用',
    },
    sort: {
      label: '並び順',
      toAscending: '昇順に変更',
      toDescending: '降順に変更',
    },
    empty: '0件',
    range: '# {{from}}–{{to}} / {{total}}件',
    pagination: {
      navigation: 'ページ送り',
      first: '最初のページ',
      previous: '前のページ',
      next: '次のページ',
      last: '最後のページ',
      current: '{{page}} / {{total}}ページ',
      pageSize: 'ページあたりの表示件数',
      pageSizeOption: '{{size}}件ずつ',
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
      show: 'パスワードを表示',
      hide: 'パスワードを隠す',
    },
    rememberId: 'ポプトモIDを記憶する',
    submit: 'ログイン',
    register: {
      prefix: 'はじめての方は',
      label: 'プレイデータを登録',
    },
    help: {
      title: 'ログインでお困りですか？',
      findId: 'ポプトモIDを確認',
      passwordInquiry: 'パスワードのお問い合わせ',
    },
  },
} as const satisfies TranslationShape<typeof koCommon>;

export default common;
