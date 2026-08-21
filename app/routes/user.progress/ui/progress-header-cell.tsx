import type { TFunction } from 'i18next';
import type { ReactNode } from 'react';
import type { ProgressColumn, ProgressColumnHeader } from '../lib/progress-table';
import { useTranslation } from 'react-i18next';
import { clearType, medal, MedalIcon } from '~/entities/medal';
import { rank, RankIcon } from '~/entities/rank';

interface ProgressHeaderCellProps {
  column: ProgressColumn;
  rowSpan?: number;
}

export function ProgressHeaderCell({ column, rowSpan }: ProgressHeaderCellProps) {
  const { t } = useTranslation();

  return (
    <th
      className="border-b border-stroke-neutral-muted px-1 align-middle text-xs font-semibold text-fg-neutral-muted"
      rowSpan={rowSpan}
      scope="col"
      title={headerTitle(column.header, t)}
    >
      <ProgressHeaderLabel header={column.header} />
    </th>
  );
}

export function ProgressHeaderLabel({ header }: { header: ProgressColumnHeader }): ReactNode {
  const { t } = useTranslation();

  switch (header.type) {
    case 'label':
      return t(`user.progress.table.column.${header.labelKey}`);
    case 'literal':
      return header.text;
    case 'medal':
      return (
        <>
          <MedalIcon className="mx-auto block" medal={header.medal} />
          <span className="sr-only">{t(medal.labelKey(header.medal))}</span>
        </>
      );
    case 'clearType':
      return t(clearType.labelKey(header.clearType));
    case 'rank':
      return (
        <>
          <RankIcon className="mx-auto block" rank={header.rank} />
          <span className="sr-only">{t(rank.labelKey(header.rank))}</span>
        </>
      );
  }
}

function headerTitle(header: ProgressColumnHeader, t: TFunction): string | undefined {
  switch (header.type) {
    case 'medal':
      return t(medal.labelKey(header.medal));
    case 'rank':
      return t(rank.labelKey(header.rank));
    default:
      return undefined;
  }
}
