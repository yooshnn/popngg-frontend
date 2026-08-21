import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
import { FocusHeader } from '~/widgets/focus-header';
import { useRenewalHandoff } from './model/use-renewal-handoff';
import { RenewalStateView } from './ui/renewal-state-view';

export default function RenewHandoffRoute() {
  const { t } = useTranslation();
  const { state, retry } = useRenewalHandoff();

  if (state.status === 'completed') {
    return <Navigate replace to={`/user/${state.userId}`} />;
  }

  return (
    <main className="flex min-h-svh flex-col items-center px-4 py-10 md:py-14">
      <FocusHeader className="max-w-120" homeHref={null} />

      <section aria-label={t('renewal.sectionLabel')} className="flex w-full max-w-120 flex-1 flex-col">
        <div className="my-auto">
          <RenewalStateView retry={retry} state={state} />
        </div>
      </section>
    </main>
  );
}
