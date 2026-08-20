export type AssetIconSize = 'sm' | 'md' | 'lg';

const sizeClassNames: Record<AssetIconSize, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

export interface AssetIconProps {
  src: string;
  alt?: string;
  size?: AssetIconSize;
  className?: string;
}

/** Renders an imported image asset at one of the shared icon sizes. */
export function AssetIcon({ src, alt = '', size = 'md', className }: AssetIconProps) {
  const baseClassName = `${sizeClassNames[size]} shrink-0`;

  return (
    <img
      alt={alt}
      className={className ? `${baseClassName} ${className}` : baseClassName}
      src={src}
    />
  );
}
