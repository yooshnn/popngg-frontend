import type { View } from '../lib/view-search-params';
import type { UserRecord } from '../model/types';
import { PlayRecordCardGrid } from '~/entities/play-record';
import { ListView } from './list-view';

export function Results({ records, view }: { records: UserRecord[]; view: View }) {
  return view === 'list'
    ? <ListView records={records} />
    : <PlayRecordCardGrid items={records} />;
}
