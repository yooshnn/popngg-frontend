import type { ProgressColumn } from '../lib/progress-table';
import type { ProgressCounts } from '../model/types';
import { score } from '~/entities/score';

interface ProgressCellProps {
  column: ProgressColumn;
  counts: ProgressCounts;
}

export function ProgressCell({ column, counts }: ProgressCellProps) {
  const value = column.value(counts);
  const isScore = column.format === 'score';
  const classNames = [
    'h-11 px-1 text-center',
    column.emphasis ? 'font-semibold' : 'font-normal',
    isScore ? 'text-fg-neutral-muted' : '',
    !isScore && value === 0 ? 'text-fg-neutral-subtle/45' : '',
  ];

  return (
    <td
      className={classNames.filter(Boolean).join(' ')}
      style={column.color ? { borderBottomColor: column.color } : undefined}
    >
      {isScore ? score.format(value) : value}
    </td>
  );
}
