import type { ProgressDetail } from '../lib/progress-search-params';
import type { ProgressColumn, ProgressColumnGroup, ProgressTableKind, ProgressTableModel } from '../lib/progress-table';
import type { ProgressAxis, ProgressCounts, ProgressRow } from '../model/types';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/shared/ui/button';
import { rowLabel } from '../lib/progress-table';
import { ProgressCell } from './progress-cell';
import { ProgressHeaderCell, ProgressHeaderLabel } from './progress-header-cell';

interface ProgressTableProps {
  axis: ProgressAxis;
  detail: ProgressDetail;
  kind: ProgressTableKind;
  rows: ProgressRow[];
  summary: ProgressCounts;
  table: ProgressTableModel;
}

type GroupRowCell
  = | { type: 'column'; column: ProgressColumn }
    | { type: 'group'; group: ProgressColumnGroup };

const minWidths: Record<ProgressTableKind, Record<ProgressDetail, string>> = {
  medal: { brief: 'min-w-[520px]', full: 'min-w-[880px]' },
  rank: { brief: 'min-w-[680px]', full: 'min-w-[960px]' },
};

const labelCellClassName = 'sticky left-0 border-r border-stroke-neutral-muted bg-bg-layer-default px-3 text-center';

const collapsedRowCount = 6;

export function ProgressTable({ axis, detail, kind, rows, summary, table }: ProgressTableProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const titleId = `user-progress-${kind}-table-title`;
  const bodyId = `user-progress-${kind}-table-body`;
  const { columns, groups } = table;
  const grouped = groups.length > 0;
  const collapsible = rows.length > collapsedRowCount;
  const visibleRows = collapsible && !expanded ? rows.slice(0, collapsedRowCount) : rows;

  const labelHeader = (
    <th className={`${labelCellClassName} z-30 border-b text-xs font-semibold`} rowSpan={grouped ? 2 : 1} scope="col">
      {t('user.progress.table.column.key')}
    </th>
  );

  return (
    <section aria-labelledby={titleId}>
      <h3 className="text-base font-bold tracking-tight" id={titleId}>
        {t(`user.progress.table.${kind}`)}
      </h3>

      <div className="-mx-4 mt-2 overflow-x-auto bg-bg-layer-default sm:-mx-5 md:mx-0 md:mt-3">
        <table className={`w-full ${minWidths[kind][detail]} table-fixed border-separate border-spacing-0 text-xs tabular-nums`}>
          <caption className="sr-only">{t(`user.progress.table.caption.${kind}`)}</caption>

          <colgroup>
            <col className="w-18" />
            {columns.map(column => <col className={columnWidth(column, detail)} key={column.id} />)}
          </colgroup>

          <thead className="sticky top-0 z-20">
            {grouped && (
              <tr className="h-8 bg-bg-layer-default text-center text-[.625rem] tracking-[.02em] text-fg-neutral-subtle">
                {labelHeader}
                {groupRowCells(columns, groups).map(cell => (
                  cell.type === 'column'
                    ? <ProgressHeaderCell column={cell.column} key={cell.column.id} rowSpan={2} />
                    : (
                        <th
                          className="border-b border-stroke-neutral-muted px-2"
                          colSpan={cell.group.span}
                          key={cell.group.id}
                          scope="colgroup"
                        >
                          <ProgressHeaderLabel header={cell.group.header} />
                        </th>
                      )
                ))}
              </tr>
            )}

            <tr className="h-10 bg-bg-layer-default text-center text-fg-neutral-muted">
              {!grouped && labelHeader}
              {columns
                .filter(column => !grouped || column.groupId)
                .map(column => <ProgressHeaderCell column={column} key={column.id} />)}
            </tr>
          </thead>

          <tbody className="[&>tr:last-child>*]:border-b-0 [&>tr>*]:border-b [&>tr>*]:border-stroke-neutral-muted" id={bodyId}>
            {visibleRows.map(row => (
              <tr key={row.key}>
                <th className={`${labelCellClassName} z-10 h-11 font-medium`} scope="row">
                  {rowLabel(axis, row.key)}
                </th>
                {columns.map(column => (
                  <ProgressCell column={column} counts={row} key={column.id} />
                ))}
              </tr>
            ))}

            <tr className="font-semibold *:border-t *:border-stroke-neutral-solid">
              <th className={`${labelCellClassName} z-10 h-11`} scope="row">
                {t('user.progress.table.column.summary')}
              </th>
              {columns.map(column => (
                <ProgressCell column={column} counts={summary} key={column.id} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {collapsible && (
        <Button
          aria-controls={bodyId}
          aria-expanded={expanded}
          className="mt-1"
          size="sm"
          suffixIcon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          variant="neutral-ghost"
          width="full"
          onClick={() => setExpanded(value => !value)}
        >
          {t(`user.progress.table.rows.${expanded ? 'collapse' : 'expand'}`)}
        </Button>
      )}
    </section>
  );
}

function groupRowCells(columns: ProgressColumn[], groups: ProgressColumnGroup[]): GroupRowCell[] {
  const cells: GroupRowCell[] = [];
  let openGroupId: string | undefined;

  for (const column of columns) {
    if (!column.groupId) {
      cells.push({ type: 'column', column });
      openGroupId = undefined;
      continue;
    }

    if (column.groupId === openGroupId)
      continue;

    openGroupId = column.groupId;
    const group = groups.find(item => item.id === column.groupId);

    if (group)
      cells.push({ type: 'group', group });
  }

  return cells;
}

function columnWidth(column: ProgressColumn, detail: ProgressDetail): string {
  if (column.format === 'score')
    return 'w-24';

  if (column.emphasis)
    return 'w-16';

  return detail === 'brief' ? 'w-18' : 'w-14';
}
