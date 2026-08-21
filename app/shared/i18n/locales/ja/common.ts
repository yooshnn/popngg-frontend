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
} as const satisfies TranslationShape<typeof koCommon>;

export default common;
