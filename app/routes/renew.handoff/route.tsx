import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
import { FocusHeader } from '~/widgets/focus-header';
import { useRenewalHandoff } from './model/use-renewal-handoff';
import { RenewalStateView } from './ui/renewal-state-view';

export default function RenewHandoffRoute() {
  const { t } = useTranslation();
  const { state, retry, skipRequested, skipSettled, skipPopnClass } = useRenewalHandoff();

  if (state.status === 'completed') {
    return <Navigate replace to={`/user/${state.userId}`} />;
  }

  // The payload preview is a JSON dump, not a step form — it needs real width to be readable.
  const maxWidth = state.status === 'preview' ? 'max-w-3xl' : 'max-w-120';

  return (
    <main className="flex min-h-svh flex-col items-center px-4 py-10 md:py-14">
      <FocusHeader className={maxWidth} homeHref={null} />

      <section aria-label={t('renewal.sectionLabel')} className={`flex w-full flex-1 flex-col ${maxWidth}`}>
        <div className="my-auto">
          <RenewalStateView
            retry={retry}
            skip={{ skipRequested, skipSettled, onSkip: skipPopnClass }}
            state={state}
          />
        </div>
      </section>
    </main>
  );
}
