import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { HydratedRouter } from 'react-router/dom';
import { getClientI18n } from '~/shared/i18n';

async function main() {
  const i18n = await getClientI18n();

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18n}>
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

main().catch(console.error);
