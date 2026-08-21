import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { passwordPattern, useLogin } from '~/features/auth';
import { Button } from '~/shared/ui/button';
import { FieldError } from '~/shared/ui/field';
import { InlinePasswordField } from './inline-password-field';
import { PoptomoIdLine } from './poptomo-id-line';

export interface HandoffLoginFormProps {
  poptomoId: string;
}

export function HandoffLoginForm({ poptomoId }: HandoffLoginFormProps) {
  const { t } = useTranslation();
  const { mutate, isPending, error } = useLogin({ redirectTo: null });
  const [password, setPassword] = useState('');

  const isPasswordFilled = passwordPattern.test(password);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate({ poptomoId, password, remember: true });
  }

  return (
    <form aria-busy={isPending} className="mt-6" onSubmit={handleSubmit}>
      <PoptomoIdLine value={poptomoId} />

      <InlinePasswordField
        autoComplete="current-password"
        autoFocus
        className="mt-4"
        disabled={isPending}
        id="handoff-login-password"
        label={t('login.password.label')}
        placeholder={t('login.password.placeholder')}
        value={password}
        onValueChange={setPassword}
      />

      <Button className="mt-8" disabled={!isPasswordFilled} loading={isPending} size="lg" type="submit" variant="brand-solid" width="full">
        {t('login.submit')}
      </Button>

      <FieldError className="mt-3">{error?.message}</FieldError>
    </form>
  );
}
