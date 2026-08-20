import type { FormEvent, ReactNode } from 'react';
import type { FormConfig, FormReturn } from '../engine/form/use-table-form';
import { ListFilterIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Button, buttonStyles, IconButton } from '~/shared/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '~/shared/ui/dialog';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '~/shared/ui/sheet';

const closeButtonClassName = 'flex size-11 items-center justify-center rounded-lg text-fg-neutral-muted transition-colors hover:bg-bg-neutral-weak hover:text-fg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring';

interface TableFilterProps<F extends FormConfig> {
  form: FormReturn<F>;
  children: ReactNode;
}

type FilterOverlay = 'dialog' | 'sheet';

/** Presents one filter form as a desktop dialog or a mobile bottom sheet. */
export function TableFilter<F extends FormConfig>({
  children,
  form,
}: TableFilterProps<F>) {
  const { t } = useTranslation();
  const title = t('dataTable.filter.trigger');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleOpenChange = (overlay: FilterOverlay, open: boolean) => {
    if (open)
      form.discardDraft();

    if (overlay === 'dialog')
      setDialogOpen(open);
    else
      setSheetOpen(open);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={open => handleOpenChange('dialog', open)}>
        <FilterTrigger
          active={form.isActive}
          className="hidden lg:flex"
          onClear={form.clear}
          renderTrigger={className => (
            <DialogTrigger className={className}>
              <ListFilterIcon aria-hidden="true" className="size-4" />
              {t('dataTable.filter.trigger')}
            </DialogTrigger>
          )}
        />
        <DialogContent size="wide" title={title}>
          <FilterForm
            applyDisabled={!form.isValid}
            closeButton={(
              <DialogClose className={closeButtonClassName}>
                <XIcon aria-hidden="true" className="size-5" />
              </DialogClose>
            )}
            title={title}
            onApply={close => void form.handleSubmit(async (values) => {
              await form.apply(values);
              close();
            })()}
            onClose={() => setDialogOpen(false)}
            onReset={form.resetDraft}
          >
            {children}
          </FilterForm>
        </DialogContent>
      </Dialog>

      <Sheet open={sheetOpen} onOpenChange={open => handleOpenChange('sheet', open)}>
        <FilterTrigger
          active={form.isActive}
          className="flex lg:hidden"
          onClear={form.clear}
          renderTrigger={className => (
            <SheetTrigger className={className}>
              <ListFilterIcon aria-hidden="true" className="size-4" />
              {t('dataTable.filter.trigger')}
            </SheetTrigger>
          )}
        />
        <SheetContent className="h-[min(46rem,calc(100dvh-1rem))]" side="bottom" title={title}>
          <div className="flex justify-center pt-2.5" aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-stroke-neutral-muted" />
          </div>
          <FilterForm
            applyDisabled={!form.isValid}
            closeButton={(
              <SheetClose className={closeButtonClassName}>
                <XIcon aria-hidden="true" className="size-5" />
              </SheetClose>
            )}
            title={title}
            onApply={close => void form.handleSubmit(async (values) => {
              await form.apply(values);
              close();
            })()}
            onClose={() => setSheetOpen(false)}
            onReset={form.resetDraft}
          >
            {children}
          </FilterForm>
        </SheetContent>
      </Sheet>
    </>
  );
}

function FilterTrigger({
  active,
  className,
  onClear,
  renderTrigger,
}: {
  active: boolean;
  className: string;
  onClear?: () => void;
  renderTrigger: (className: string) => ReactNode;
}) {
  const { t } = useTranslation();
  const triggerClassName = buttonStyles({
    className: `gap-2 px-3.5 text-sm ${active ? 'data-table-filter-active pr-12' : ''}`,
    size: 'lg',
    variant: active ? 'brand-weak' : 'neutral-ghost',
  });

  return (
    <div className={`relative w-fit ${className}`}>
      {renderTrigger(triggerClassName)}
      {active && onClear && (
        <IconButton
          aria-label={t('dataTable.filter.clear')}
          className="absolute top-1/2 right-1 z-10 -translate-y-1/2 rounded-full hover:bg-bg-layer-default"
          size="sm"
          type="button"
          variant="neutral-ghost"
          onClick={onClear}
        >
          <XIcon aria-hidden="true" />
        </IconButton>
      )}
    </div>
  );
}

function FilterForm({
  applyDisabled,
  children,
  closeButton,
  title,
  onApply,
  onClose,
  onReset,
}: {
  applyDisabled: boolean;
  children: ReactNode;
  closeButton: ReactNode;
  title: string;
  onApply: (close: () => void) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const { t } = useTranslation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply(onClose);
  };

  return (
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-stroke-neutral-weak px-[18px] sm:px-6">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {closeButton}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-[18px] py-5 sm:px-6">
        {children}
      </div>
      <footer className="flex shrink-0 items-center justify-end gap-1 border-t border-stroke-neutral-weak px-[18px] pt-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-3">
        <Button size="md" type="button" variant="neutral-ghost" onClick={onReset}>
          {t('dataTable.filter.reset')}
        </Button>
        <Button disabled={applyDisabled} size="md" type="submit" variant="brand-solid">
          {t('dataTable.filter.apply')}
        </Button>
      </footer>
    </form>
  );
}
