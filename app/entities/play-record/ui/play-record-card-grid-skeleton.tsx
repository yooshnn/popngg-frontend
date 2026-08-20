import { Skeleton } from '~/shared/ui/skeleton';
import { gridStyles } from './play-record-card-grid';

export interface PlayRecordCardGridSkeletonProps {
  count?: number;
  className?: string;
}

export function PlayRecordCardGridSkeleton({ count = 5, className }: PlayRecordCardGridSkeletonProps) {
  return (
    <div className={gridStyles({ className })}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton className="h-[100px]" key={index} />
      ))}
    </div>
  );
}
