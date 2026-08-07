# `shared/preferences`

```tsx
import { usePreferences } from '~/shared/preferences';
import type { Title } from '~/shared/preferences';

const { title, setPreference } = usePreferences();
setPreference('title', 'genre');
```

Root wiring (`root.tsx`):

```tsx
const preferences = await preferencesCookie.read(request); // in loader
<PreferencesProvider preferences={preferences}><Outlet /></PreferencesProvider>
```

`setPreference` is optimistic: updates UI, writes the cookie, then
revalidates — no manual loading state needed.
