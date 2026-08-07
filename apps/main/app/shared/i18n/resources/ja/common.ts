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
  login: {
    title: 'ログイン',
    description: 'ログインして、すべての機能をご利用ください。',
    poptomoId: {
      label: 'ポプトモID',
      placeholder: '0000-0000-0000',
      description: '`－`は必要ありません。',
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
      ariaLabel: 'ログインヘルプ',
      title: 'ログインでお困りですか？',
      findId: 'ポプトモIDを確認',
      passwordInquiry: 'パスワードのお問い合わせ',
    },
  },
} satisfies typeof import('../ko/common').default;
