import type { ReactNode } from 'react';
import type { RenewalState } from '../model/state';
import { CircleAlertIcon, LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EAGATE_PLAYDATA_URL, toRenewalErrorCode } from '~/features/renewal';
import { Button } from '~/shared/ui/button';
import { Link, linkStyles } from '~/shared/ui/link';
import { CollectProgress } from './collect-progress';
import { HandoffLoginForm } from './handoff-login-form';
import { PayloadPreview } from './payload-preview';
import { RegisterForm } from './register-form';

const RENEW_GUIDE_PATH = '/renew';

type ActiveRenewalState = Exclude<RenewalState, { status: 'completed' }>;

function PendingRow({ children }: { children: ReactNode }) {
  return (
    <p aria-live="polite" className="flex items-center gap-2 text-sm text-fg-neutral-muted" role="status">
      <LoaderCircleIcon aria-hidden="true" className="size-4 shrink-0 animate-spin" />
      {children}
    </p>
  );
}

function ErrorBox({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl border border-stroke-critical-weak bg-bg-critical-weak px-4 py-3.5"
      role="alert"
    >
      <CircleAlertIcon aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-fg-critical" />
      <div className="text-sm leading-6 text-pretty text-fg-critical-contrast">{children}</div>
    </div>
  );
}

function StepHeading({ children }: { children: ReactNode }) {
  return <h1 className="text-xl font-semibold tracking-tight">{children}</h1>;
}

function StepDescription({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-sm leading-6 text-pretty text-fg-neutral-muted">{children}</p>;
}

function StepNote({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-xs leading-5 text-pretty text-fg-neutral-subtle">{children}</p>;
}

interface SkipControl {
  skipRequested: boolean;
  skipSettled: boolean;
  onSkip: (skip: boolean) => void;
}

function CollectingState({
  state,
  skip,
}: {
  state: Extract<ActiveRenewalState, { status: 'collecting' }>;
  skip: SkipControl;
}) {
  const { t } = useTranslation();
  const { phase } = state.progress;

  if (phase === null) {
    return <PendingRow>{t('renewal.status.checking')}</PendingRow>;
  }

  return (
    <CollectProgress
      onSkip={skip.onSkip}
      phase={phase}
      progress={state.progress}
      skipRequested={skip.skipRequested}
      skipSettled={skip.skipSettled}
    />
  );
}

export function RenewalStateView({
  state,
  retry,
  skip,
}: {
  state: ActiveRenewalState;
  retry: () => void;
  skip: SkipControl;
}) {
  const { t } = useTranslation();

  switch (state.status) {
    case 'checking-opener':
    case 'checking-session':
      return <PendingRow>{t('renewal.status.checking')}</PendingRow>;

    case 'no-opener':
      return (
        <>
          <p className="text-sm text-fg-neutral-muted">{t('renewal.noOpener.message')}</p>
          <Link className="mt-4" to={RENEW_GUIDE_PATH}>{t('renewal.noOpener.guide')}</Link>
        </>
      );

    case 'waiting-game-id':
      return <PendingRow>{t('renewal.status.waitingGameId')}</PendingRow>;

    case 'checking-account':
      return <PendingRow>{t('renewal.status.checkingAccount')}</PendingRow>;

    case 'account-lookup-failed':
      return <ErrorBox>{t('renewal.accountLookupFailed')}</ErrorBox>;

    case 'needs-login':
      return <NeedsLogin gameId={state.gameId} />;

    case 'needs-register':
      return <NeedsRegister gameId={state.gameId} />;

    case 'authenticated':
      return <PendingRow>{t('renewal.status.starting')}</PendingRow>;

    case 'collecting':
      return <CollectingState skip={skip} state={state} />;

    case 'preview':
      return <PayloadPreview payload={state.payload} />;

    case 'uploading':
      return <PendingRow>{t('renewal.status.uploading')}</PendingRow>;

    case 'failed':
      return (
        <>
          <ErrorBox>
            <p>{t(`renewal.error.${toRenewalErrorCode(state.code)}`)}</p>
            <p className="mt-1.5 font-mono text-xs text-fg-critical">{t('renewal.errorCode', { code: state.code })}</p>
          </ErrorBox>
          {(state.code === 'WRONG_PAGE' || state.payload !== null) && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {state.code === 'WRONG_PAGE' && (
                <a className={linkStyles()} href={EAGATE_PLAYDATA_URL}>
                  {t('renewal.action.toPlaydata')}
                </a>
              )}
              {state.payload !== null && (
                <Button size="sm" type="button" variant="neutral-outline" onClick={retry}>
                  {t('renewal.action.retry')}
                </Button>
              )}
            </div>
          )}
        </>
      );

    default:
      return state satisfies never;
  }
}

function NeedsLogin({ gameId }: { gameId: string }) {
  const { t } = useTranslation();

  return (
    <>
      <StepHeading>{t('renewal.login.title')}</StepHeading>
      <StepDescription>{t('renewal.login.description')}</StepDescription>
      <HandoffLoginForm poptomoId={gameId} />
    </>
  );
}

function NeedsRegister({ gameId }: { gameId: string }) {
  const { t } = useTranslation();

  return (
    <>
      <StepHeading>{t('renewal.register.title')}</StepHeading>
      <StepDescription>{t('renewal.register.description')}</StepDescription>
      <StepNote>{t('renewal.register.note')}</StepNote>
      <RegisterForm poptomoId={gameId} />
    </>
  );
}
