import type { UserRecord } from '../model/types';
import { ListItem } from './list-item';

export function ListView({ records }: { records: UserRecord[] }) {
  return (
    <ol className="divide-y divide-stroke-neutral-muted bg-bg-layer-default">
      {records.map(record => <ListItem key={record.id} record={record} />)}
    </ol>
  );
}
