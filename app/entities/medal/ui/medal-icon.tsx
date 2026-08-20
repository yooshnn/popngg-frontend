import type { Medal } from '../model/medal';
import type { AssetIconSize } from '~/shared/ui/asset-icon';
import { AssetIcon } from '~/shared/ui/asset-icon';

const icons: Record<Medal, string> = {
  'gold-star': '/icons/medal/gold-star.svg',
  'silver-star': '/icons/medal/silver-star.svg',
  'silver-diamond': '/icons/medal/silver-diamond.svg',
  'silver-circle': '/icons/medal/silver-circle.svg',
  'bronze-star': '/icons/medal/bronze-star.svg',
  'bronze-diamond': '/icons/medal/bronze-diamond.svg',
  'bronze-circle': '/icons/medal/bronze-circle.svg',
  'black-star': '/icons/medal/black-star.svg',
  'black-diamond': '/icons/medal/black-diamond.svg',
  'black-circle': '/icons/medal/black-circle.svg',
  'long-off': '/icons/medal/long-off.svg',
  'easy': '/icons/medal/easy.svg',
  'none': '/icons/medal/none.svg',
};

export interface MedalIconProps {
  medal: Medal;
  className?: string;
  size?: AssetIconSize;
}

export function MedalIcon({ className, medal, size }: MedalIconProps) {
  return <AssetIcon className={className} size={size} src={icons[medal]} />;
}
