import { Button } from '@popngg/ui/components/button';
import { useLogin } from '../model/useLogin';

const labelClass = 'block text-sm font-medium text-fg-neutral-muted';
const inputClass = 'mt-1 w-full rounded-lg border border-stroke-neutral-weak bg-bg-layer-default px-3 py-2 text-sm text-fg-neutral outline-none focus-visible:border-stroke-brand-solid focus-visible:ring-1 focus-visible:ring-stroke-focus-ring';

export function LoginForm() {
  const { mutate, isPending, error } = useLogin();

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    mutate({
      poptomoId: String(form.get('poptomoId')),
      password: String(form.get('password')),
    });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <label className={labelClass} htmlFor="poptomoId">팝토모 ID</label>
        <input
          className={inputClass}
          id="poptomoId"
          name="poptomoId"
          type="text"
          autoComplete="username"
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="password">비밀번호</label>
        <input
          className={inputClass}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {error && <p className="text-sm text-fg-critical" role="alert">{error.message}</p>}

      <Button type="submit" variant="brand-solid" width="full" loading={isPending}>
        로그인
      </Button>
    </form>
  );
}
