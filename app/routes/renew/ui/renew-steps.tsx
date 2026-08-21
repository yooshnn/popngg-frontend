import { useTranslation } from 'react-i18next';
import { EAGATE_PLAYDATA_URL } from '~/features/renewal';
import { Link } from '~/shared/ui/link';
import { BookmarkletCode } from './bookmarklet-code';
import { RenewStep } from './renew-step';

export function RenewSteps({ platform, origin }: {
  platform: 'desktop' | 'mobile';
  origin: string;
}) {
  return platform === 'desktop'
    ? <DesktopSteps origin={origin} />
    : <MobileSteps origin={origin} />;
}

function DesktopSteps({ origin }: { origin: string }) {
  const { t } = useTranslation();

  return (
    <>
      <RenewStep
        description={t('renew.step.desktop.copy.description')}
        index={1}
        title={t('renew.step.desktop.copy.title')}
      >
        <BookmarkletCode origin={origin} />
      </RenewStep>

      <RenewStep
        description={t('renew.step.desktop.install.description')}
        index={2}
        title={t('renew.step.desktop.install.title')}
        noteItems={(
          <>
            <li>{t('renew.step.desktop.install.bookmarkBarNote')}</li>
            <li>
              {t('renew.step.desktop.install.manualNote.before')}
              {' '}
              <code className="font-mono text-[.6875rem] text-fg-neutral-muted">javascript:</code>
              {' '}
              {t('renew.step.desktop.install.manualNote.after')}
            </li>
          </>
        )}
      />

      <RenewStep
        index={3}
        title={t('renew.step.open.title')}
        description={(
          <>
            {t('renew.step.open.description.before')}
            <Link to={EAGATE_PLAYDATA_URL}>{t('renew.step.open.description.playdata')}</Link>
            {t('renew.step.open.description.after')}
          </>
        )}
      />

      <RenewStep
        description={t('renew.step.desktop.run.description')}
        index={4}
        noteItems={<li>{t('renew.step.desktop.run.note')}</li>}
        title={t('renew.step.desktop.run.title')}
      />
    </>
  );
}

function MobileSteps({ origin }: { origin: string }) {
  const { t } = useTranslation();

  return (
    <>
      <RenewStep
        description={t('renew.step.mobile.copy.description')}
        index={1}
        title={t('renew.step.mobile.copy.title')}
      >
        <BookmarkletCode origin={origin} />
      </RenewStep>

      <RenewStep
        description={t('renew.step.mobile.bookmark.description')}
        index={2}
        noteItems={<li>{t('renew.step.mobile.bookmark.note')}</li>}
        title={t('renew.step.mobile.bookmark.title')}
      />

      <RenewStep
        index={3}
        title={t('renew.step.open.title')}
        description={(
          <>
            {t('renew.step.open.description.before')}
            <Link to={EAGATE_PLAYDATA_URL}>{t('renew.step.open.description.playdata')}</Link>
            {t('renew.step.open.description.after')}
          </>
        )}
      />

      <RenewStep
        description={t('renew.step.mobile.run.description')}
        index={4}
        noteItems={<li>{t('renew.step.mobile.run.note')}</li>}
        title={t('renew.step.mobile.run.title')}
      />
    </>
  );
}
