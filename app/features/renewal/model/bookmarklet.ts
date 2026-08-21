// bump the version segment on each pop'n music release
export const EAGATE_PLAYDATA_URL = 'https://p.eagate.573.jp/game/popn/popn29/playdata/index.html';

export function bookmarkletCode(origin: string): string {
  return `javascript:(function(){var o='${origin}';var w=window.open(o+'/renew/handoff','_blank');var e=document.createElement('script');e.src=o+'/codes/renew.js';e.onload=function(){popngg.start(w);};document.head.appendChild(e);})();`;
}
