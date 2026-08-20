import type { PlayRecordCardData } from './play-record-card';
import { tv } from 'tailwind-variants';
import { PlayRecordCard } from './play-record-card';

export const gridStyles = tv({
  base: 'grid grid-cols-1 gap-1 min-[420px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
});

export interface PlayRecordCardGridProps {
  items: PlayRecordCardData[];
  className?: string;
}

export function PlayRecordCardGrid({ items, className }: PlayRecordCardGridProps) {
  return (
    <ol className={gridStyles({ className })}>
      {items.map(item => (
        <PlayRecordCard data={item} key={item.id} />
      ))}
    </ol>
  );
}
