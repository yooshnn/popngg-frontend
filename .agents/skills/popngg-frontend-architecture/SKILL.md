---
name: popngg-frontend-architecture
description: Apply and review popn.gg frontend architecture for the single React Router Framework app. Use when placing or moving code among route slices, features, entities, and shared; defining API/DTO/domain/UI or Cloudflare server-only boundaries; designing nested routes and layouts; integrating the reusable table feature; or reviewing frontend changes for architectural consistency.
---

# popn.gg Frontend Architecture

Use the architecture reference as a decision guide, not as a mechanical folder mandate.

## Workflow

1. Read [references/architecture.md](references/architecture.md) completely.
2. Inspect the current app structure, `package.json`, `react-router.config.ts`, `app/routes.ts`, and the files directly involved in the task.
3. Confirm the installed React Router mode and version before applying route, loader, action, middleware, or deployment advice.
4. Keep route-specific UI, state, and server integration together until a real second consumer justifies promotion.
5. Enforce dependencies in the direction `route slice -> widget -> feature -> entity -> shared`; reject same-layer slice imports and cycles.
6. Convert wire DTOs inside an `api` boundary and expose domain-oriented values to loaders and UI.
7. Keep Cloudflare bindings, secrets, and server runtime APIs behind `.server` modules; do not let browser-capable query functions depend on them.
8. Keep features independent of page-specific URLs and layouts. Keep entities limited to reusable domain concepts and rules.
9. Nest routes only for a real layout, shared loader, error boundary, or outlet relationship.
10. When reviewing a change, cite concrete files, distinguish violations from deliberate exceptions, and propose the smallest boundary-preserving fix.

## Interpretation Notes

- Treat the reference as the current baseline and verify its assumptions against the code being changed.
- Prefer colocation over speculative abstraction. Promote code only after reuse or a stable domain boundary is demonstrated.
- Preserve React Router Framework conventions such as generated `Route.*` types and route-module data APIs.
- Reconcile older `pages/` or `widgets/` code from the monorepo during migration instead of blindly copying its physical structure.
- Use the newer table implementation as evidence when deciding the table feature's public boundary; do not assume every table field belongs in the generic feature.
