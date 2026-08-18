import { UserRoundIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { passwordPattern, poptomoIdPattern, useLogin } from '~/features/auth';
import { Button } from '~/shared/ui/button';
import { Checkbox } from '~/shared/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '~/shared/ui/field';
import { Input } from '~/shared/ui/input';
import { PasswordField } from './password-field';

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
            required
            value={poptomoId}
            onChange={event => setPoptomoId(formatPoptomoId(event.target.value))}
          />
          <FieldDescription id="login-poptomo-id-description">
            {t('login.poptomoId.description')}
          </FieldDescription>
        </Field>

        <PasswordField
          autoComplete="current-password"
          description={t('login.password.description')}
          disabled={isPending}
          id="login-password"
          label={t('login.password.label')}
          placeholder={t('login.password.placeholder')}
          value={password}
          onValueChange={setPassword}
        />
      </FieldGroup>

      <Checkbox checked={remember} className="mt-5 w-fit gap-2.5" disabled={isPending} onCheckedChange={setRemember}>
        {t('login.rememberId')}
      </Checkbox>

      <Button
        className="mt-8"
        disabled={!isPoptomoIdFilled || !isPasswordFilled}
        loading={isPending}
        size="xl"
        type="submit"
        variant="brand-solid"
        width="full"
      >
        {t('login.submit')}
      </Button>

      <FieldError className="mt-3 px-1">{error?.message}</FieldError>
    </form>
  );
}
