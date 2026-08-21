import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const TIME_ZONE = 'Asia/Tokyo';
const TIME_ZONE_OFFSET = 9 * 3_600_000;
const DAY_IN_MILLISECONDS = 86_400_000;
const RELATIVE_DAYS = 7;

const MONTH_DAY_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  timeZone: TIME_ZONE,
};

function toZonedDate(date: Date) {
  return new Date(date.getTime() + TIME_ZONE_OFFSET);
}

function toZonedDay(date: Date) {
  return Math.floor((date.getTime() + TIME_ZONE_OFFSET) / DAY_IN_MILLISECONDS);
}

export function useRelativeDate() {
  const { t, i18n } = useTranslation();

  return useCallback((date: Date) => {
    const days = toZonedDay(new Date()) - toZonedDay(date);

    if (days <= 0) {
      return t('date.today');
    }

    if (days < RELATIVE_DAYS) {
      return t('date.daysAgo', { count: days });
    }

    const zoned = toZonedDate(date);
    if (zoned.getUTCFullYear() === toZonedDate(new Date()).getUTCFullYear()) {
      return new Intl.DateTimeFormat(i18n.language, MONTH_DAY_FORMAT).format(date);
    }

    return `${zoned.getUTCFullYear()}.${String(zoned.getUTCMonth() + 1).padStart(2, '0')}`;
  }, [t, i18n.language]);
}
