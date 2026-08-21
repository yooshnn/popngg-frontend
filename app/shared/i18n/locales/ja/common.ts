import type koCommon from '../ko/common';

type TranslationShape<T> = {
  [Key in keyof T]: T[Key] extends string ? string : TranslationShape<T[Key]>;
};

const common = {
  home: {
    description: 'ポップンミュージックのプレイデータを記録して、ランキングで比較しましょう。',
    welcomeTo: 'へようこそ!',
    notice: '現在開発中のサービスのため、High☆Cheers!!のデータは予告なく初期化される場合があります。',
    introduction: {
      before: 'popn.ggはKONAMIのアーケードリズムゲーム',
      game: 'ポップンミュージック',
      after: 'の非公式プレイデータ管理サービスです。',
    },
    cta: {
      register: 'データを登録する',
      sample: 'サンプルプロフィール',
      profile: 'マイページ',
    },
  },
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
  date: {
    today: '今日',
    daysAgo: '{{count}}日前',
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
      invalidValue: '正しくない値です。',
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
  tableForm: {
    version: 'バージョン',
    allVersions: 'すべてのバージョン',
    level: 'レベル',
    difficulty: '難易度',
    medal: 'メダル',
    rank: 'ランク',
    score: 'スコア',
    minimum: '最小',
    maximum: '最大',
    noLimit: '指定なし',
    points: '点',
    error: {
      level: {
        range: 'レベルは{{min}}〜{{max}}の整数で入力してください。',
        reversed: '最小レベルは最大レベル以下にしてください。',
      },
      score: {
        range: 'スコアは{{min}}〜{{max}}の整数で入力してください。',
        reversed: '最小スコアは最大スコア以下にしてください。',
      },
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
  register: {
    title: '登録',
    description: '公式サイトで確認したポプトモIDでアカウントを作成します。',
    passwordConfirm: {
      label: 'パスワード確認',
      placeholder: 'パスワードを再入力',
      locked: '先にパスワードを入力してください',
      mismatch: 'パスワードが一致しません。',
    },
    private: {
      label: 'プロフィールを非公開にする',
      description: '自分のプレイデータを他の人に表示しません。',
    },
    submit: '登録してはじめる',
  },
  renew: {
    title: 'データ登録',
    description: '下記のガイドに従ってデータを登録してください。',
    bookmarklet: {
      label: 'popn.gg Data Renewal',
      copy: 'コードをコピー',
      copied: 'コピーしました',
    },
    platform: {
      label: 'ご利用の環境',
      desktop: 'PC',
      mobile: 'スマホ',
    },
    step: {
      open: {
        title: '公式サイトを開く',
        description: {
          before: 'e-amusementにログインしてから、ポップンミュージックの',
          playdata: 'プレーデータトップページ',
          after: 'へ移動してください。',
        },
      },
      desktop: {
        copy: {
          title: 'コードをコピーする',
          description: '下のコードをコピーしてください。',
        },
        install: {
          title: 'ブックマークバーに登録する',
          description: '新しいブックマークを作成し、コピーしたコードをURL欄に貼り付けてください。',
          bookmarkBarNote: 'ブックマークバーが表示されていない場合は、Ctrl+Shift+B（MacはCommand+Shift+B）で表示できます。',
          manualNote: {
            before: 'URLが',
            after: 'で始まっていることを確認してください。消えている場合は、URL欄の先頭に直接入力してください。',
          },
        },
        run: {
          title: 'ブックマークを実行する',
          description: '登録したブックマークを押すとpopn.ggの画面が開き、あとは自動で進みます。',
          note: '取得が終わるまで、両方の画面を開いたままにしてください。',
        },
      },
      mobile: {
        copy: {
          title: 'コードをコピーする',
          description: '下のコードをコピーしてください。',
        },
        bookmark: {
          title: 'ブックマークに登録する',
          description: '任意のページをブックマークに追加してから編集画面を開いてください。名前をわかりやすく変更し、URL欄にはコピーしたコードを貼り付けてください。',
          note: 'URL欄を完全に空にしてから貼り付け、URLがjavascript:で始まっていることを確認してください。消えている場合は、URL欄の先頭に直接入力してください。',
        },
        run: {
          title: 'ブックマークを実行する',
          description: '登録したブックマークを実行するとpopn.ggの画面が開き、あとは自動で進みます。',
          note: '取得が終わるまで、両方のタブを開いたままにしてください。新しいタブが開かない場合は、ブラウザのポップアップブロックを解除してください。',
        },
      },
    },
    requirement: 'e-amusementベーシックコース（月額330円）への加入が必要です。',
  },
  renewal: {
    error: {
      WRONG_PAGE: 'ポップンミュージックのプレーデータページで実行してください。下のリンクから移動して、ブックマークレットを再実行してください。',
      FETCH_FAILED: '公式サイトと通信できませんでした。時間をおいてから、もう一度お試しください。',
      STATE_UNREADABLE: '公式サイトのログイン状態を確認できませんでした。ページを再読み込みしてから、もう一度お試しください。',
      NOT_LOGGED_IN: '公式サイトにログインしていません。e-amusementにログインしてから、もう一度お試しください。',
      NO_BASIC_COURSE: 'プレーデータを取得するにはe-amusementベーシックコースへの加入が必要です。加入してから、もう一度お試しください。',
      NO_EAPASS: 'e-amusement passが登録されていません。公式サイトでpassを登録してから、もう一度お試しください。',
      NO_PLAYDATA: 'プレーデータが見つかりませんでした。1曲以上プレーしてから、もう一度お試しください。',
      PROFILE_PARSE_FAILED: '公式サイトからプレーヤー情報を読み取れませんでした。サイトの変更によるエラーの可能性がありますので、お問い合わせください。',
      NO_CHARTS_FOUND: 'プレーデータを取得できませんでした。しばらくしてから、もう一度お試しください。',
      ABORTED: '更新を中断しました。もう一度更新するには、ブックマークレットを実行してください。',
      GAME_ID_MISMATCH: 'popn.ggにログイン中のアカウントと公式サイトのアカウントが異なります。popn.ggからログアウトしてから、もう一度お試しください。',
      HANDOFF_NO_RESPONSE: '公式サイトから応答がありませんでした。プレーデータページでブックマークレットを再実行してください。',
      COLLECT_NOT_STARTED: 'プレーデータの取得を開始できませんでした。プレーデータページでブックマークレットを再実行してください。',
      UPLOAD_FAILED: 'プレーデータを保存できませんでした。しばらくしてから、もう一度お試しください。',
      UNKNOWN: '不明なエラーが発生しました。しばらくしてから、もう一度お試しください。',
    },
    accountLookupFailed: 'アカウント情報を確認できませんでした。しばらくしてから、ブックマークレットを再実行してください。',
    errorCode: 'エラーコード: {{code}}',
    action: {
      toPlaydata: 'プレーデータトップページへ移動',
      retry: '再試行',
    },
    sectionLabel: 'データ登録',
    status: {
      checking: '確認しています...',
      waitingGameId: '公式サイトの情報を確認しています...',
      checkingAccount: 'アカウントを確認しています...',
      starting: '取得を開始します...',
      uploading: '送信しています...',
    },
    noOpener: {
      message: 'このページはpopn.ggのデータ更新ブックマークレットから開いてください。',
      guide: '更新方法を見る',
    },
    phase: {
      profile: 'プロフィールを確認しています',
      levels: '曲リストを読み込んでいます',
      details: '今作の記録を読み込んでいます',
      done: '取得が完了しました',
    },
    login: {
      title: 'ログイン',
      description: 'パスワードを入力すると、すぐに更新を開始します。',
    },
    register: {
      title: '新規登録',
      description: '今後データを更新するときに使うパスワードを設定します。',
      note: 'あとからいつでも変更できます。',
    },
  },
  medal: {
    name: {
      'gold-star': '金★',
      'silver-star': '銀★',
      'silver-diamond': '銀◆',
      'silver-circle': '銀●',
      'bronze-star': '銅★',
      'bronze-diamond': '銅◆',
      'bronze-circle': '銅●',
      'easy': 'EASY',
      'long-off': 'ロングOFF',
      'black-star': '黒★',
      'black-diamond': '黒◆',
      'black-circle': '黒●',
      'none': 'なし',
    },
    clearType: {
      'perfect': 'パフェ',
      'full-combo': 'フルコン',
      'clear': 'クリア',
      'assist': 'アシスト',
      'failed': '未クリア',
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
      'none': 'なし',
    },
    family: {
      S: 'S',
      AAA: 'AAA',
      AA: 'AA',
      A: 'A',
      B: 'B',
      belowB: 'B未満',
    },
  },
  version: {
    1: 'ポップン 1',
    2: 'ポップン 2',
    3: 'ポップン 3',
    4: 'ポップン 4',
    5: 'ポップン 5',
    6: 'ポップン 6',
    7: 'ポップン 7',
    8: 'ポップン 8',
    9: 'ポップン 9',
    10: 'ポップン 10',
    11: 'ポップン 11',
    12: 'いろは',
    13: 'カーニバル',
    14: 'FEVER!',
    15: 'ADVENTURE',
    16: 'PARTY♪',
    17: 'THE MOVIE',
    18: 'せんごく列伝',
    19: 'TUNE STREET',
    20: 'fantasia',
    21: 'Sunny Park',
    22: 'ラピストリア',
    23: 'éclale',
    24: 'うさぎと猫と少年の夢',
    25: 'peace',
    26: '解明リドルズ',
    27: 'UniLab',
    28: 'Jam&Fizz',
    29: 'High☆Cheers!!',
    99: 'その他',
  },
  user: {
    profile: {
      updatedAt: '{{date}} 更新',
      popnClass: {
        label: 'ポップンクラス',
        shortLabel: 'ポックラ',
        legacyPrefix: '/ 旧',
      },
    },
    tab: {
      home: {
        label: 'ホーム',
      },
      records: {
        label: 'プレーデータ',
      },
      progress: {
        label: '埋め',
      },
    },
    records: {
      title: 'プレーデータ',
      description: 'メダル、ランク、スコアを基準に記録を確認します。',
      search: {
        placeholder: '曲名・ジャンルを検索',
      },
      view: {
        label: '表示形式',
        list: '一覧',
        card: 'カード',
      },
      sort: {
        level: 'レベル',
        score: 'スコア',
      },
      filter: {
        chartInfo: '楽曲情報',
        playInfo: 'プレー情報',
      },
    },
    progress: {
      title: '埋め',
      description: '集計基準ごとのメダルとスコアランクの取得状況を確認します。',
      axis: {
        label: '集計基準',
        level: 'レベル',
        difficulty: '難易度',
      },
      detail: {
        label: '表示',
        brief: '簡易',
        full: '詳細',
      },
      table: {
        medal: 'メダル',
        rank: 'スコア',
        caption: {
          medal: '集計基準ごとのメダル取得状況',
          rank: '集計基準ごとのスコアランク取得状況',
        },
        column: {
          key: '区分',
          averageScore: '平均スコア',
          total: '合計',
          summary: '全体',
        },
        rows: {
          expand: 'すべて表示',
          collapse: '折りたたむ',
        },
      },
    },
    home: {
      popnClassTargets: {
        title: 'ポックラ対象曲',
        description: 'ポップンクラスの計算対象となる楽曲です。',
        calculation: {
          label: 'ポップンクラスの計算式',
          current: '現行式',
          legacy: '旧計算式',
        },
        group: {
          newSongs: '新曲',
          oldSongs: '旧曲',
          legacy: '対象曲',
        },
        songCount: '{{count}}曲',
        average: '平均 {{value}}',
        empty: 'まだ該当する記録がありません。',
      },
      levelStats: {
        title: '円グラフ',
        description: 'レベルごとのメダルとスコアランクの分布を確認できます。',
        mode: {
          label: '集計タイプ',
          medal: 'メダル',
          rank: 'ランク',
        },
        level: {
          previous: '前のレベル',
          next: '次のレベル',
        },
        totalLabel: '全譜面',
        chartLabel: 'レベル{{level}}の{{mode}}分布、全{{count}}譜面',
      },
    },
  },
  users: {
    title: 'ランキング',
    description: '公開ユーザーランキングを確認できます。',
    search: {
      placeholder: 'ユーザー名・ポプともIDを検索',
    },
    sort: {
      rank: '順位',
      name: 'ユーザー名',
      clearLevel: 'クリアレベル',
      updatedAt: '更新日',
    },
    column: {
      rank: '#',
      user: 'ユーザー',
      bestLevel: '最高Lv',
      popnClass: 'ポップンクラス',
      updatedAt: '更新日',
    },
    bestLevel: {
      label: 'クリア {{clear}}、フルコンボ {{fullCombo}}、パーフェクト {{perfect}}',
      none: '-',
    },
  },
  charts: {
    title: '譜面リスト',
    description: 'ポップンミュージックに収録されている曲と譜面を確認できます。',
    search: {
      placeholder: '曲名・ジャンルを検索',
    },
    sort: {
      version: 'バージョン',
      title: '曲名',
      genre: 'ジャンル',
      maxLevel: '最高レベル',
    },
    filter: {
      chartInfo: '楽曲情報',
    },
  },
  chart: {
    comingSoon: '楽曲の詳細情報は準備中です。',
    difficultyNavigation: '難易度を移動',
    tabs: {
      label: '譜面詳細メニュー',
      overview: '概要',
      ranking: 'ランキング',
    },
  },
} as const satisfies TranslationShape<typeof koCommon>;

export default common;
