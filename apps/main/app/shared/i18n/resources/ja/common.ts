export default {
  demo: 'ポップンミュージック',
  link: {
    newWindow: '(新しいウィンドウ)',
  },
  nav: {
    ariaLabel: '主要なナビゲーション',
    chart: '譜面',
    user: 'ユーザー',
    tool: 'ツール',
  },
  header: {
    landmarkLabel: 'サイトヘッダー',
    home: 'popn.gg ホーム',
    login: 'ログイン',
    menu: {
      open: 'メニューを開く',
      close: 'メニューを閉じる',
      title: 'popn.gg メニュー',
      description: '主要なナビゲーションと補助リンク',
      navLabel: 'ナビゲーション',
      helpLabel: 'ヘルプ',
    },
    titleToggle: {
      song: '曲名',
      genre: 'ジャンル',
      ariaLabel: '曲名またはジャンルの表記を切り替え、現在{{label}}',
    },
    localeToggle: {
      ko: '韓国語',
      ja: '日本語',
      ariaLabel: '言語を切り替え、現在{{label}}',
    },
    account: {
      menuAriaLabel: '{{name}}のアカウントメニューを開く',
      avatarAriaLabel: 'プロフィール画像未登録',
      viewProfile: 'プロフィールを見る',
      editProfile: 'プロフィールを編集',
      logout: 'ログアウト',
    },
  },
  footer: {
    landmarkLabel: 'サイトフッター',
    navLabel: 'フッターナビゲーション',
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
} satisfies typeof import('../ko/common').default;
