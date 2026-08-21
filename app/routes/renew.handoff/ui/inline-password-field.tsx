import { CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { passwordPattern } from '~/features/auth';
import { IconButton } from '~/shared/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '~/shared/ui/field';

export interface InlinePasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  className?: string;
  description?: string;
  error?: string;
  value: string;
  onValueChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
  autoFocus?: boolean;
  disabled?: boolean;
}

export function InlinePasswordField({
  id,
  label,
  placeholder,
  className,
  description,
  error,
  value,
  onValueChange,
  autoComplete,
  autoFocus = false,
  disabled = false,
}: InlinePasswordFieldProps) {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const descriptionId = description ? `${id}-description` : undefined;
  const isSatisfied = passwordPattern.test(value) && !error;

  return (
    <Field className={className}>
      <div className="flex items-start gap-3">
        <FieldLabel className="w-28 shrink-0 pt-2" htmlFor={id} variant="label">
          {label}
        </FieldLabel>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div
            className={`flex h-9 items-center gap-2 border-b-2 transition-colors ${
              error ? 'border-stroke-critical-solid' : 'border-stroke-neutral-weak focus-within:border-stroke-focus-ring'
            }`}
          >
            {!disabled
              && (
                <span
                  aria-hidden="true"
                >
                  {!isSatisfied && <CheckIcon className="size-4 text-stroke-neutral-weak" />}
                  {isSatisfied && <CheckIcon className="size-4 text-fg-brand" />}
                </span>
              )}
            <input
              aria-describedby={descriptionId}
              aria-invalid={error ? true : undefined}
              autoComplete={autoComplete}
              autoFocus={autoFocus}
              className="min-w-0 flex-1 bg-transparent text-sm text-fg-neutral outline-none placeholder:text-fg-placeholder disabled:text-fg-disabled"
              disabled={disabled}
              id={id}
              placeholder={placeholder}
              type={revealed ? 'text' : 'password'}
              value={value}
              onChange={event => onValueChange(event.target.value)}
            />
            <IconButton
              aria-label={revealed ? t('login.password.hide') : t('login.password.show')}
              className="size-7"
              disabled={disabled}
              size="sm"
              type="button"
              variant="neutral-ghost"
              onClick={() => setRevealed(v => !v)}
            >
              {revealed ? <EyeOffIcon /> : <EyeIcon />}
            </IconButton>
          </div>

          {description && (
            <FieldDescription id={descriptionId}>
              {description}
            </FieldDescription>
          )}
          <FieldError>{error}</FieldError>
        </div>
      </div>
    </Field>
  );
}
