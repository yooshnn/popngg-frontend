import type { PopnClassTarget } from '../model/types';
import { useTranslation } from 'react-i18next';
import { PlayRecordCardGrid } from '~/entities/play-record';

interface PopnClassTargetListProps {
  songs: PopnClassTarget[];
}

export function PopnClassTargetList({ songs }: PopnClassTargetListProps) {
  const { t } = useTranslation();

  if (songs.length === 0) {
    return <p className="mt-5 text-sm text-fg-neutral-muted">{t('user.home.popnClassTargets.empty')}</p>;
  }

  return <PlayRecordCardGrid className="mt-5" items={songs} />;
}
