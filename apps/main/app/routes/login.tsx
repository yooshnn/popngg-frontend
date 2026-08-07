import { LoginForm } from '~/features/auth';

export function meta() {
  return [{ title: '로그인' }];
}

export default function Login() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <h1 className="text-center text-xl font-semibold">로그인</h1>
        <LoginForm />
      </div>
    </main>
  );
}
