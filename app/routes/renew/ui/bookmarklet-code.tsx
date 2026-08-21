import { CheckIcon, CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bookmarkletCode } from '~/features/renewal';
import { IconButton } from '~/shared/ui/button';

const COPIED_RESET_MS = 2000;

function BookmarkletCopyButton({ code }: { code: string }) {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timer = setTimeout(setIsCopied, COPIED_RESET_MS, false);
    return () => clearTimeout(timer);
  }, [isCopied]);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
  }

  return (
    <IconButton
      aria-label={isCopied ? t('renew.bookmarklet.copied') : t('renew.bookmarklet.copy')}
      size="sm"
      type="button"
      variant="neutral-outline"
      onClick={() => void handleCopy()}
    >
      {isCopied
        ? <CheckIcon />
        : <CopyIcon />}
    </IconButton>
  );
}

export function BookmarkletCode({ origin }: { origin: string }) {
  const code = bookmarkletCode(origin);

  return (
    <div className="flex items-start gap-2">
      <pre className="max-w-lg min-w-0 flex-1 overflow-x-auto scrollbar-none rounded-lg bg-bg-neutral-weak p-2 text-[10px] leading-5 whitespace-pre">
        <code>{code}</code>
      </pre>

      <BookmarkletCopyButton code={code} />
    </div>
  );
}
