import { EyeIcon, EyeOffIcon, KeyRoundIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { passwordPattern } from '~/features/auth';
import { IconButton } from '~/shared/ui/button';
import { Field, FieldDescription, FieldLabel } from '~/shared/ui/field';
import { Input } from '~/shared/ui/input';

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  description?: string;
  value: string;
  onValueChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
  disabled?: boolean;
}

export function PasswordField({
  id,
  label,
  placeholder,
  description,
  value,
  onValueChange,
  autoComplete,
  disabled = false,
}: PasswordFieldProps) {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <Field className="gap-2">
      <FieldLabel htmlFor={id} variant="legend">
        {label}
      </FieldLabel>
      <Input
        aria-describedby={descriptionId}
        autoComplete={autoComplete}
        disabled={disabled}
        id={id}
        placeholder={placeholder}
        prefixIcon={<KeyRoundIcon className={passwordPattern.test(value) ? 'text-fg-brand' : undefined} />}
        suffix={(
          <IconButton
            aria-label={revealed ? t('login.password.hide') : t('login.password.show')}
            disabled={disabled}
            size="sm"
            type="button"
            variant="neutral-ghost"
            onClick={() => setRevealed(value => !value)}
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
          </IconButton>
        )}
        type={revealed ? 'text' : 'password'}
        value={value}
        onChange={event => onValueChange(event.target.value)}
      />
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
    </Field>
  );
}
