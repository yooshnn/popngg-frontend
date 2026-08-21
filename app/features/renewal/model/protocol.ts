/** Keep in sync with renew.js */
export const EAGATE_ORIGIN = 'https://p.eagate.573.jp';
export const SCRIPT_SOURCE = 'popngg-renew';
export const HANDOFF_SOURCE = 'popngg-handoff';

export type CollectPhase = 'profile' | 'levels' | 'details' | 'done';

/** Codes the popup has a translated message for. */
export const RENEWAL_ERROR_CODES = [
  'WRONG_PAGE',
  'FETCH_FAILED',
  'STATE_UNREADABLE',
  'NOT_LOGGED_IN',
  'NO_BASIC_COURSE',
  'NO_EAPASS',
  'NO_PLAYDATA',
  'PROFILE_PARSE_FAILED',
  'NO_CHARTS_FOUND',
  'ABORTED',
  'GAME_ID_MISMATCH',
  'HANDOFF_NO_RESPONSE',
  'COLLECT_NOT_STARTED',
  'UPLOAD_FAILED',
  'UNKNOWN',
] as const;

export type RenewalErrorCode = typeof RENEWAL_ERROR_CODES[number];

/** Narrows a code off the wire, so a renew.js we did not ship still renders a message. */
export function toRenewalErrorCode(code: string): RenewalErrorCode {
  return RENEWAL_ERROR_CODES.includes(code as RenewalErrorCode) ? code as RenewalErrorCode : 'UNKNOWN';
}

export interface RenewalChart {
  chartId: string | null;
  title: string;
  genre: string;
  artist: string;
  difficulty: string;
  level: number;
  medal: string;
  rank: string;
  score: number;
  versionBestScore?: number | null;
}

export interface RenewalProfile {
  gameId: string;
  name: string | null;
  character: string | null;
  popnClass: string | null;
}

export interface RenewalWarning {
  code: string;
  message: string;
}

export interface RenewalStats {
  levelsScanned: number;
  pagesFetched: number;
  detailsFetched: number;
  chartsFound: number;
  chartsPlayed: number;
  elapsedMs: number;
  payloadBytes: number;
}

export interface RenewalPayload {
  collectorVersion: number;
  game: string;
  collectedAt: string;
  profile: RenewalProfile;
  charts: RenewalChart[];
  warnings: RenewalWarning[];
  stats: RenewalStats;
}

export interface RenewalSummary {
  chartsScanned: number;
  recordsAdded: number;
  medalsImproved: number;
  scoresImproved: number;
  popnClassDelta: number | null;
}

export type ScriptMessage
  = | { source: typeof SCRIPT_SOURCE; type: 'hint'; gameId: string }
    | { source: typeof SCRIPT_SOURCE; type: 'progress'; phase: CollectPhase; done: number; total: number }
    | { source: typeof SCRIPT_SOURCE; type: 'payload'; payload: RenewalPayload }
    | { source: typeof SCRIPT_SOURCE; type: 'error'; code: string; message: string };

export type HandoffMessage
  = | { source: typeof HANDOFF_SOURCE; type: 'hello' }
    | { source: typeof HANDOFF_SOURCE; type: 'ready'; gameId: string }
    | { source: typeof HANDOFF_SOURCE; type: 'abort'; reason: string }
    | { source: typeof HANDOFF_SOURCE; type: 'finished'; summary: RenewalSummary };

export function isScriptMessage(data: unknown): data is ScriptMessage {
  return typeof data === 'object' && data !== null && (data as { source?: unknown }).source === SCRIPT_SOURCE;
}
