import type { UserSummary } from '../model/types';
import { RankingHeader, RankingRow } from './ranking-row';

export function UserRankingList({ users }: { users: UserSummary[] }) {
  return (
    <div className="-mx-4 sm:-mx-5 md:mx-0">
      <RankingHeader />

      <ul className="divide-y divide-stroke-neutral-weak border-y border-stroke-neutral-weak md:divide-stroke-neutral-muted md:border-0">
        {users.map(user => <RankingRow key={user.poptomoId} user={user} />)}
      </ul>
    </div>
  );
}
