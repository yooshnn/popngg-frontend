import type { RenewalPayload } from '~/features/renewal';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toWirePayload } from '~/features/renewal';
import { Button } from '~/shared/ui/button';
import { SegmentedControl } from '~/shared/ui/segmented-control';

type PreviewView = 'debug' | 'wire';

const COPIED_RESET_MS = 2000;

function downloadFileName(payload: RenewalPayload) {
  const gameId = payload.profile.gameId.replaceAll(/[^\w-]/g, '');
  const collectedAt = payload.collectedAt.replaceAll(/[^\w-]/g, '');
  return `popngg-renew-${gameId}-${collectedAt}.json`;
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-fg-neutral-subtle">{label}</dt>
      <dd className="mt-1 text-sm font-medium tabular-nums">{value}</dd>
    </div>
  );
}

export function PayloadPreview({ payload }: { payload: RenewalPayload }) {
  const { t } = useTranslation();
  const [view, setView] = useState<PreviewView>('debug');
  const [copied, setCopied] = useState(false);

  const selectedCount = (payload.popnClass?.selected.new.length ?? 0) + (payload.popnClass?.selected.old.length ?? 0);

  const json = useMemo(
    () => JSON.stringify(view === 'wire' ? toWirePayload(payload) : payload, null, 2),
    [payload, view],
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(setCopied, COPIED_RESET_MS, false);
  }

  function handleDownload() {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = downloadFileName(payload);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">{t('renewal.preview.title')}</h1>
      <p className="mt-2 text-sm leading-6 text-pretty text-fg-neutral-muted">{t('renewal.preview.description')}</p>

      <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatItem label={t('renewal.preview.stats.records')} value={payload.charts.length.toLocaleString()} />
        <StatItem label={t('renewal.preview.stats.played')} value={payload.stats.chartsPlayed.toLocaleString()} />
        <StatItem label={t('renewal.preview.stats.details')} value={payload.stats.detailsFetched.toLocaleString()} />
        <StatItem label={t('renewal.preview.stats.levelPages')} value={payload.stats.levelPagesFetched.toLocaleString()} />
        <StatItem label={t('renewal.preview.stats.selected')} value={selectedCount.toLocaleString()} />
        <StatItem label={t('renewal.preview.stats.bytes')} value={payload.stats.payloadBytes.toLocaleString()} />
        <StatItem label={t('renewal.preview.stats.elapsed')} value={`${(payload.stats.elapsedMs / 1000).toFixed(1)}s`} />
      </dl>

      <div className="mt-5">
        {payload.warnings.length === 0
          ? <p className="text-sm text-fg-neutral-muted">{t('renewal.preview.warnings.empty')}</p>
          : (
              <>
                <p className="text-sm font-medium text-fg-critical">
                  {t('renewal.preview.warnings.title', { count: payload.warnings.length })}
                </p>
                <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border border-stroke-neutral-weak p-2 text-xs">
                  {payload.warnings.map(warning => (
                    <li className="flex gap-2" key={`${warning.code}:${warning.message}`}>
                      <span className="shrink-0 font-mono text-fg-critical">{warning.code}</span>
                      <span className="text-fg-neutral-muted">{warning.message}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <SegmentedControl
          aria-label={t('renewal.preview.tabLabel')}
          onValueChange={setView}
          options={[
            { label: t('renewal.preview.tab.debug'), value: 'debug' },
            { label: t('renewal.preview.tab.wire'), value: 'wire' },
          ]}
          value={view}
        />
        <div className="flex gap-2">
          <Button onClick={handleCopy} size="sm" type="button" variant="neutral-outline">
            {copied ? t('renewal.preview.copied') : t('renewal.preview.copy')}
          </Button>
          <Button onClick={handleDownload} size="sm" type="button" variant="neutral-outline">
            {t('renewal.preview.download')}
          </Button>
        </div>
      </div>

      <textarea
        aria-label={t('renewal.preview.textareaLabel')}
        className="mt-3 h-96 w-full resize-y rounded-md border border-stroke-neutral-weak bg-bg-layer-default p-3 font-mono text-xs"
        readOnly
        spellCheck={false}
        value={json}
      />
    </div>
  );
}
