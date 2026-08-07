import type { FormEvent } from 'react';
import { Button, IconButton } from '@popngg/ui/components/button';
import { Checkbox } from '@popngg/ui/components/checkbox';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@popngg/ui/components/field';
import { Input } from '@popngg/ui/components/input';
import { EyeIcon, EyeOffIcon, KeyRoundIcon, UserRoundIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../model/useLogin';

const POPTOMO_ID_DIGITS = 12;
const PASSWORD_PATTERN = /^[a-z0-9]{4,16}$/i;

function formatPoptomoId(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, POPTOMO_ID_DIGITS)
    .replace(/(\d{4})(?=\d)/g, '$1-');
}

export function LoginForm() {
  const { t } = useTranslation();
  const { mutate, isPending, error } = useLogin();
  const [poptomoId, setPoptomoId] = useState('');
  const [password, setPassword] = useState('');
  const [revealed, setRevealed] = useState(false);

  const isPoptomoIdFilled = poptomoId.replace(/-/g, '').length === POPTOMO_ID_DIGITS;
  const isPasswordFilled = PASSWORD_PATTERN.test(password);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate({ poptomoId, password });
  }

  return (
    <form aria-busy={isPending} className="mt-9" onSubmit={handleSubmit}>
      <FieldGroup className="gap-6">
        <Field className="gap-2">
          <FieldLabel htmlFor="login-poptomo-id" variant="legend">
            {t('login.poptomoId.label')}
          </FieldLabel>
          <Input
            aria-describedby="login-poptomo-id-description"
            autoComplete="username"
            disabled={isPending}
            id="login-poptomo-id"
            inputMode="numeric"
            placeholder={t('login.poptomoId.placeholder')}
            prefixIcon={<UserRoundIcon className={isPoptomoIdFilled ? 'text-fg-brand' : undefined} />}
            value={poptomoId}
            onChange={event => setPoptomoId(formatPoptomoId(event.target.value))}
          />
          <FieldDescription id="login-poptomo-id-description">
            {t('login.poptomoId.description')}
          </FieldDescription>
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="login-password" variant="legend">
            {t('login.password.label')}
          </FieldLabel>
          <Input
            aria-describedby="login-password-description"
            autoComplete="current-password"
            disabled={isPending}
            id="login-password"
            placeholder={t('login.password.placeholder')}
            prefixIcon={<KeyRoundIcon className={isPasswordFilled ? 'text-fg-brand' : undefined} />}
            suffix={(
              <IconButton
                aria-label={revealed ? t('login.password.hide') : t('login.password.show')}
                disabled={isPending}
                size="sm"
                type="button"
                variant="neutral-ghost"
                onClick={() => setRevealed(value => !value)}
              >
                {revealed ? <EyeOffIcon /> : <EyeIcon />}
              </IconButton>
            )}
            type={revealed ? 'text' : 'password'}
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <FieldDescription id="login-password-description">
            {t('login.password.description')}
          </FieldDescription>
        </Field>
      </FieldGroup>

      <Checkbox className="mt-5 w-fit gap-2.5" disabled={isPending} name="remember-poptomo-id">
        {t('login.rememberId')}
      </Checkbox>

      <Button className="mt-8" disabled={!isPoptomoIdFilled || !isPasswordFilled} loading={isPending} size="xl" type="submit" variant="brand-solid" width="full">
        {t('login.submit')}
      </Button>

      <FieldError className="mt-3 px-1">{error?.message}</FieldError>
    </form>
  );
}
