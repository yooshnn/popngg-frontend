import { containerStyles } from '@popngg/ui/components/container';
import { useTranslation } from 'react-i18next';
import { Link } from '~/shared/ui';

const KONAMI_NOTICE = '본 서비스는 KONAMI로부터 공식적인 승인을 받거나 지원을 받고 있지 않으며, 모든 데이터의 권리는 KONAMI 및 각 소유권자에게 있습니다.';
const COPYRIGHT = '© 2026 popn.gg team';

interface FooterLink {
  label: string;
  to: string;
}

interface FooterGroup {
  title: string;
  links: FooterLink[];
}

function useFooterGroups(): FooterGroup[] {
  const { t } = useTranslation();

  return [
    {
      title: t('footer.groups.content.title'),
      links: [
        { label: t('footer.groups.content.chart'), to: '/charts' },
        { label: t('footer.groups.content.user'), to: '/users' },
        { label: t('footer.groups.content.tool'), to: '/tools' },
      ],
    },
    {
      title: t('footer.groups.link.title'),
      links: [
        { label: t('footer.groups.link.register'), to: '/register' },
        { label: t('footer.groups.link.inquiry'), to: 'https://forms.gle/b1BUfY6pDaRpdC6w5' },
      ],
    },
    {
      title: t('footer.groups.doc.title'),
      links: [
        { label: t('footer.groups.doc.guide'), to: '/guide' },
        { label: t('footer.groups.doc.terms'), to: '/terms' },
        { label: t('footer.groups.doc.privacy'), to: '/privacy' },
      ],
    },
  ];
}

function FooterGroups() {
  const { t } = useTranslation();
  const groups = useFooterGroups();

  return (
    <nav className="grid gap-7" aria-label={t('footer.navLabel')}>
      {groups.map(({ title, links }) => (
        <section className="grid gap-3 md:grid-cols-[180px_1fr] md:items-baseline md:gap-8" key={title} aria-labelledby={`footer-${title}`}>
          <h2 className="text-base font-semibold text-fg-neutral" id={`footer-${title}`}>{title}</h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-3">
            {links.map(({ label, to }) => (
              <li key={label}>
                <Link className="min-h-6 text-sm" to={to} variant="neutral">{label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}

function FooterNotice() {
  const { t } = useTranslation();

  return (
    <div className="mt-12 grid gap-5 border-t border-stroke-neutral-weak pt-6 text-sm leading-[1.7] text-fg-neutral-muted md:grid-cols-[180px_minmax(0,1fr)] md:gap-x-8">
      <p className="text-sm font-medium text-fg-neutral">{COPYRIGHT}</p>
      <div>
        <p className="max-w-[720px] break-keep">{KONAMI_NOTICE}</p>
        <Link className="mt-3 min-h-6 text-sm" to="https://p.eagate.573.jp/game/popn" variant="neutral">
          {t('footer.officialSite')}
        </Link>
      </div>
    </div>
  );
}

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto w-full border-t border-stroke-neutral-weak bg-[linear-gradient(to_bottom,var(--color-bg-neutral-weak)_33%,var(--color-bg-layer-default)_100%)]" aria-label={t('footer.landmarkLabel')}>
      <div className={containerStyles({ className: 'py-10 md:py-12' })}>
        <FooterGroups />
        <FooterNotice />
      </div>
    </footer>
  );
}
