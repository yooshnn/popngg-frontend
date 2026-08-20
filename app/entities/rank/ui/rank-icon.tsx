import type { Rank } from '../model/rank';
import type { AssetIconSize } from '~/shared/ui/asset-icon';
import { AssetIcon } from '~/shared/ui/asset-icon';

const icons: Record<Rank, string> = {
  'S+': '/icons/rank/s-plus.svg',
  'S': '/icons/rank/s.svg',
  'AAA': '/icons/rank/aaa.svg',
  'AA+': '/icons/rank/aa-plus.svg',
  'AA': '/icons/rank/aa.svg',
  'A+': '/icons/rank/a-plus.svg',
  'A': '/icons/rank/a.svg',
  'B+': '/icons/rank/b-plus.svg',
  'B': '/icons/rank/b.svg',
  'C': '/icons/rank/c.svg',
  'D': '/icons/rank/d.svg',
  'E': '/icons/rank/e.svg',
  'none': '/icons/rank/none.svg',
};

export interface RankIconProps {
  rank: Rank;
  className?: string;
  size?: AssetIconSize;
}

export function RankIcon({ className, rank, size }: RankIconProps) {
  return <AssetIcon className={className} size={size} src={icons[rank]} />;
}
