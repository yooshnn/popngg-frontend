import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { passwordPattern, useRegister } from '~/features/auth';
import { Button } from '~/shared/ui/button';
import { Checkbox } from '~/shared/ui/checkbox';
import { FieldDescription, FieldError, FieldGroup } from '~/shared/ui/field';
import { InlinePasswordField } from './inline-password-field';
import { PoptomoIdLine } from './poptomo-id-line';

export interface RegisterFormProps {
  poptomoId: string;
}

export function RegisterForm({ poptomoId }: RegisterFormProps) {
  const { t } = useTranslation();
  const { mutate, isPending, error } = useRegister({ redirectTo: null });
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const isPasswordFilled = passwordPattern.test(password);
  const isConfirmed = password === confirmation;

  function handlePasswordChange(next: string) {
    setPassword(next);
    setConfirmation('');
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate({ poptomoId, password, isPrivate });
  }

  return (
    <form aria-busy={isPending} className="mt-6" onSubmit={handleSubmit}>
      <PoptomoIdLine value={poptomoId} />

      <FieldGroup className="mt-4 gap-4">
        <InlinePasswordField
          autoComplete="new-password"
          autoFocus
          description={t('login.password.description')}
          disabled={isPending}
          id="register-password"
          label={t('login.password.label')}
          placeholder={t('login.password.placeholder')}
          value={password}
          onValueChange={handlePasswordChange}
        />

        <InlinePasswordField
          autoComplete="new-password"
          disabled={isPending || !isPasswordFilled}
          error={confirmation !== '' && !isConfirmed ? t('register.passwordConfirm.mismatch') : undefined}
          id="register-password-confirm"
          label={t('register.passwordConfirm.label')}
          placeholder={isPasswordFilled ? t('register.passwordConfirm.placeholder') : t('register.passwordConfirm.locked')}
          value={confirmation}
          onValueChange={setConfirmation}
        />
      </FieldGroup>

      <div className="mt-5">
        <Checkbox
          aria-describedby="register-private-description"
          checked={isPrivate}
          className="w-fit gap-2.5"
          disabled={isPending}
          onCheckedChange={setIsPrivate}
        >
          {t('register.private.label')}
        </Checkbox>
        <FieldDescription className="mt-1 px-1" id="register-private-description">
          {t('register.private.description')}
        </FieldDescription>
      </div>

      <Button className="mt-8" disabled={!isPasswordFilled || !isConfirmed} loading={isPending} size="lg" type="submit" variant="brand-solid" width="full">
        {t('register.submit')}
      </Button>

      <FieldError className="mt-3">{error?.message}</FieldError>
    </form>
  );
}
