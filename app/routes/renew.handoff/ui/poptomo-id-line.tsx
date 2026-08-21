import { useTranslation } from 'react-i18next';

export interface PoptomoIdLineProps {
  value: string;
}

export function PoptomoIdLine({ value }: PoptomoIdLineProps) {
  const { t } = useTranslation();

  return (
    <p className="flex h-9 items-center gap-3 text-sm">
      <span className="w-28 shrink-0 font-medium text-fg-neutral-muted">{t('login.poptomoId.label')}</span>
      <span className="font-medium tabular-nums text-fg-neutral">{value}</span>
      <input autoComplete="username" readOnly type="hidden" value={value} />
    </p>
  );
}
