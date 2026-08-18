import type koCommon from '../ko/common';

const common = {
  demo: 'ポップン',
} as const satisfies { [Key in keyof typeof koCommon]: string };

export default common;
