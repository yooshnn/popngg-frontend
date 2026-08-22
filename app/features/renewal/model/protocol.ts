/** Keep in sync with renew.js */
export const EAGATE_ORIGIN = 'https://p.eagate.573.jp';
export const SCRIPT_SOURCE = 'popngg-renew';
export const HANDOFF_SOURCE = 'popngg-handoff';

export const COLLECT_PHASES = ['profile', 'levels', 'newsongs', 'popnclass', 'done'] as const;
export type CollectPhase = typeof COLLECT_PHASES[number];

/** Narrows a phase off the wire, so a renew.js we did not ship still renders a message. */
export function toCollectPhase(value: string): CollectPhase | null {
  return (COLLECT_PHASES as readonly string[]).includes(value) ? value as CollectPhase : null;
}

export interface CollectProgress {
  phase: CollectPhase | null;
  done: number;
  total: number;
  records: number | null;
  level: number | null;
  details: number | null;
  /** The collector confirming it dropped the popclass scan, rather than the app hoping it did. */
  skipped: boolean;
}

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

export interface RenewalRecord {
  chartId: string | null;
  title: string;
  genre: string;
  artist: string;
  difficulty: string;
  medal: string;
  rank: string;
  /** All-time best (歴代). */
  score: number;
  /** This version's best (▼VERSION), filled only on charts picked as popclass targets. 0 otherwise. */
  versionBestScore: number;
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
  /** Every list request — mu_top and mu_lv both. */
  pagesFetched: number;
  /** The mu_lv share of pagesFetched. Debug only; not part of the upload contract. */
  levelPagesFetched: number;
  detailsFetched: number;
  chartsFound: number;
  chartsPlayed: number;
  elapsedMs: number;
  payloadBytes: number;
}

/**
 * Debug only. popnClass never goes over the wire — the picks ride along as records[].versionBestScore.
 * Shape mirrors renew.js's `pick`; its debug siblings (candidates/ranked/scan/formula) stay untyped JSON.
 */
export interface RenewalPopnClassPick {
  title: string;
  genre: string;
  artist: string;
  difficulty: string;
  medal: string;
  rank: string;
  score: number | null;
}

export interface RenewalPopnClass {
  selected: {
    new: RenewalPopnClassPick[];
    old: RenewalPopnClassPick[];
  };
}

/** What renew.js hands over — the upload contract plus collector-side debug. */
export interface RenewalPayload {
  collectorVersion: number;
  game: string;
  collectedAt: string;
  profile: RenewalProfile;
  charts: RenewalRecord[];
  popnClass: RenewalPopnClass | null;
  warnings: RenewalWarning[];
  stats: RenewalStats;
}

/** Exactly what POST /renewals accepts. Everything the collector adds for debugging is dropped. */
export interface RenewalWirePayload {
  collectorVersion: number;
  game: string;
  collectedAt: string;
  profile: RenewalProfile;
  charts: RenewalRecord[];
  warnings: RenewalWarning[];
  stats: Omit<RenewalStats, 'levelPagesFetched'>;
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
    | {
      source: typeof SCRIPT_SOURCE;
      type: 'progress';
      phase: string;
      done: number;
      total: number;
      records?: number | null;
      level?: number | null;
      details?: number | null;
      skipped?: boolean;
    }
    | { source: typeof SCRIPT_SOURCE; type: 'payload'; payload: RenewalPayload }
    | { source: typeof SCRIPT_SOURCE; type: 'error'; code: string; message: string };

export type HandoffMessage
  = | { source: typeof HANDOFF_SOURCE; type: 'hello' }
    | { source: typeof HANDOFF_SOURCE; type: 'ready'; gameId: string }
    | { source: typeof HANDOFF_SOURCE; type: 'abort'; reason: string }
    // Drops one phase and keeps collecting, unlike 'abort' which ends the run with no payload.
    | { source: typeof HANDOFF_SOURCE; type: 'skip'; target: 'popnclass' }
    | { source: typeof HANDOFF_SOURCE; type: 'finished'; summary: RenewalSummary };

export function isScriptMessage(data: unknown): data is ScriptMessage {
  return typeof data === 'object' && data !== null && (data as { source?: unknown }).source === SCRIPT_SOURCE;
}

/**
 * Narrows the collected payload down to the upload contract — built field by field on purpose,
 * so a new debug field on the collector cannot leak into the request by accident.
 * What the backend needs from popnClass arrives as charts[].versionBestScore.
 */
export function toWirePayload(payload: RenewalPayload): RenewalWirePayload {
  return {
    collectorVersion: payload.collectorVersion,
    game: payload.game,
    collectedAt: payload.collectedAt,
    profile: payload.profile,
    charts: payload.charts,
    warnings: payload.warnings,
    stats: {
      levelsScanned: payload.stats.levelsScanned,
      pagesFetched: payload.stats.pagesFetched,
      detailsFetched: payload.stats.detailsFetched,
      chartsFound: payload.stats.chartsFound,
      chartsPlayed: payload.stats.chartsPlayed,
      elapsedMs: payload.stats.elapsedMs,
      payloadBytes: payload.stats.payloadBytes,
    },
  };
}
