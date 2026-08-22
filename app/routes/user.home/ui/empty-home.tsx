import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Button } from '~/shared/ui/button';

/** Stands in for the whole home tab when the player has no records at all — every section below it would just repeat this. */
export function EmptyHome() {
  const { t } = useTranslation();

  return (
    <div className="mt-10 flex min-h-40 flex-col items-center justify-center gap-4 rounded-lg border border-stroke-neutral-weak px-5 py-8 text-center md:mt-14">
      <p className="text-sm text-fg-neutral-muted">{t('user.home.empty')}</p>
      <Button nativeButton={false} render={<RouterLink to="/renew" />} size="sm" variant="brand-solid">
        {t('home.cta.register')}
      </Button>
    </div>
  );
}
