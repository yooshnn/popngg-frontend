import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { passwordPattern, poptomoIdPattern, useLogin } from '~/features/auth';

function formatPoptomoId(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 12)
    .replace(/(\d{4})(?=\d)/g, '$1-');
}

interface LoginFormProps {
  defaultPoptomoId: string | null;
  redirectTo: string;
}

export function LoginForm({ defaultPoptomoId, redirectTo }: LoginFormProps) {
  const { t } = useTranslation();
  const { mutate, isPending, error } = useLogin({ redirectTo });
  const [poptomoId, setPoptomoId] = useState(defaultPoptomoId ?? '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(Boolean(defaultPoptomoId));

  const isPoptomoIdFilled = poptomoIdPattern.test(poptomoId);
  const isPasswordFilled = passwordPattern.test(password);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isPoptomoIdFilled || !isPasswordFilled || isPending) {
      return;
    }

    mutate({ poptomoId, password, remember });
  }

  return (
    <form aria-busy={isPending} className="mt-6 space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="block text-sm" htmlFor="login-poptomo-id">
          {t('login.poptomoId.label')}
        </label>
        <input
          aria-describedby="login-poptomo-id-description"
          autoComplete="username"
          className="block w-full rounded border border-stroke-neutral-weak bg-bg-layer-default px-3 py-2 text-base outline-none focus:border-stroke-focus-ring focus:ring-1 focus:ring-stroke-focus-ring disabled:bg-bg-disabled"
          disabled={isPending}
          id="login-poptomo-id"
          inputMode="numeric"
          placeholder={t('login.poptomoId.placeholder')}
          required
          value={poptomoId}
          onChange={event => setPoptomoId(formatPoptomoId(event.target.value))}
        />
        <p className="text-xs text-fg-neutral-subtle" id="login-poptomo-id-description">
          {t('login.poptomoId.description')}
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm" htmlFor="login-password">
          {t('login.password.label')}
        </label>
        <input
          aria-describedby="login-password-description"
          autoComplete="current-password"
          className="block w-full rounded border border-stroke-neutral-weak bg-bg-layer-default px-3 py-2 text-base outline-none focus:border-stroke-focus-ring focus:ring-1 focus:ring-stroke-focus-ring disabled:bg-bg-disabled"
          disabled={isPending}
          id="login-password"
          placeholder={t('login.password.placeholder')}
          required
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <p className="text-xs text-fg-neutral-subtle" id="login-password-description">
          {t('login.password.description')}
        </p>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm text-fg-neutral-muted">
        <input
          checked={remember}
          className="size-4"
          disabled={isPending}
          type="checkbox"
          onChange={event => setRemember(event.target.checked)}
        />
        {t('login.rememberId')}
      </label>

      <button
        className="w-full rounded bg-bg-brand-solid px-4 py-2.5 font-medium text-fg-neutral-inverted hover:bg-bg-brand-solid-hover focus:outline-none focus:ring-2 focus:ring-stroke-focus-ring disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-fg-disabled"
        disabled={!isPoptomoIdFilled || !isPasswordFilled || isPending}
        type="submit"
      >
        {isPending ? t('login.submitting') : t('login.submit')}
      </button>

      {error && (
        <p className="text-sm text-fg-critical" role="alert">
          {error.message}
        </p>
      )}
    </form>
  );
}
