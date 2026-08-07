# `@popngg/ui` — design tokens + components

```ts
import { Button, IconButton, buttonStyles } from '@popngg/ui/components/button';
import type { ButtonProps, ButtonStyleProps } from '@popngg/ui/components/button';
```

```tsx
<Button variant="brand-solid" size="md" loading={isPending} prefixIcon={<PlusIcon />}>
  Save
</Button>

<IconButton variant="neutral-ghost" aria-label="More options">
  <EllipsisIcon />
</IconButton>

{/* Non-Button elements (e.g. router <Link>) that need Button's look: */}
<a className={buttonStyles({ variant: 'neutral-ghost' })} href="/docs">docs</a>
```

`variant`: `{neutral,brand,critical} × {solid,weak,outline,ghost}`.
`size`: `sm | md | lg`. `width`: `fit | full`.

Tokens (`packages/ui/static/theme/tokens.css`, imported once via `app.css`):
Tailwind classes like `bg-bg-neutral-weak`, `text-fg-critical`,
`border-stroke-neutral-weak`. Never hardcode a hex or a `--color-palette-*`
value outside `tokens.css`.

```css
/* apps/main/app/app.css */
@import '@popngg/ui/styles.css';
```
