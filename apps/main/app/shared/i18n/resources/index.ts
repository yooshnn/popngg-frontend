import type { Resource } from 'i18next';
import ja from './ja/common';
import ko from './ko/common';

export default {
  ko: { common: ko },
  ja: { common: ja },
} satisfies Resource;
