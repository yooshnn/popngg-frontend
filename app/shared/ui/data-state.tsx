import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/shared/ui/button';

export function LoadingState() {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t('dataState.loading')}
      className="grid min-h-40 place-items-center text-fg-neutral-muted"
      role="status"
    >
      <LoaderCircleIcon aria-hidden="true" className="size-6 animate-spin" />
    </div>
  );
}

export interface ErrorStateProps {
  onRetry: () => void;
  retrying?: boolean;
}

export function ErrorState({ onRetry, retrying = false }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-stroke-neutral-weak px-5 py-8 text-center">
      <p className="font-semibold text-fg-neutral">{t('dataState.error.title')}</p>
      <p className="mt-1 text-sm text-fg-neutral-muted">{t('dataState.error.description')}</p>
      <Button className="mt-4" loading={retrying} size="sm" variant="neutral-outline" onClick={onRetry}>
        {t('dataState.error.retry')}
      </Button>
    </div>
  );
}

export function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="grid min-h-40 place-items-center rounded-lg border border-stroke-neutral-weak px-5 py-8 text-center text-sm text-fg-neutral-muted">
      {t('dataState.empty')}
    </div>
  );
}

export interface QueryStateProps<Data> {
  children: (data: Data) => ReactNode;
  error?: (state: ErrorStateProps) => ReactNode;
  isEmpty?: (data: Data) => boolean;
  pending?: ReactNode;
  query: UseQueryResult<Data>;
}

/** Renders the shared pending, error, and empty states around a query result. */
export function QueryState<Data>({
  children,
  error = state => <ErrorState {...state} />,
  isEmpty,
  pending = <LoadingState />,
  query,
}: QueryStateProps<Data>) {
  if (query.isPending)
    return pending;

  if (query.data === undefined) {
    return error({
      retrying: query.isFetching,
      onRetry: () => void query.refetch(),
    });
  }

  if (isEmpty?.(query.data))
    return <EmptyState />;

  return children(query.data);
}
