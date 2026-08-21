import { useTranslation } from 'react-i18next';

export default function ChartOverviewRoute() {
  const { t } = useTranslation();

  return (
    <p className="py-16 text-center text-sm text-fg-neutral-muted md:py-24">
      {t('chart.comingSoon')}
    </p>
  );
}
