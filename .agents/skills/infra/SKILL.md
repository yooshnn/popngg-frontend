---
name: infra
description: Interfaces and usage examples for popngg-frontend's cross-cutting layers (ui, cookie, i18n, preferences, api). Use when touching packages/ui, shared/cookie, shared/i18n, shared/preferences, or shared/api.
---

# Infra reference

Interfaces and usage for the cross-cutting layers. Not a tutorial — see each
module's own comments for the why.

Load the reference matching the layer you're touching:

| Reference                    | Use When                                                                |
| ----------------------------- | ------------------------------------------------------------------------ |
| `references/ui.md`           | `packages/ui`, `Button`/`IconButton`, design tokens, Tailwind color/spacing classes |
| `references/cookie.md`       | `shared/cookie`, `defineCookie`                                         |
| `references/i18n.md`         | `shared/i18n`, `react-i18next`, translations                            |
| `references/preferences.md`  | `shared/preferences`, `usePreferences`                                  |
| `references/api.md`          | `shared/api`, `http()`, ky, react-query, queries                        |
