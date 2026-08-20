const GAME_TIME_ZONE = 'Asia/Tokyo';

export function formatDate(
  date: Date,
  language: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(language, {
    timeZone: GAME_TIME_ZONE,
    ...options,
  }).format(date);
}
