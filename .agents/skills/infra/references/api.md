# `shared/api` — HTTP client + query client

```ts
import { getQueryClient, http, kyInstance, ServerApiContext } from '~/shared/api';
import type { Envelope, HttpOptions, Page } from '~/shared/api';
```

Plain fetch, server or browser:

```ts
// loader/action
const request = http({ context });
const result = await request<ResultType>('some/path');

// browser (component, event handler)
const request = http();
const result = await request<ResultType>('some/path');
```

With react-query — define a query factory that defaults to the browser
client, and pass a context-bound one from the server:

```ts
// routes/foo.tsx (co-located query factory)
export function fooQuery(request = http()) {
  return { queryKey: ['foo'], queryFn: () => request<Foo>('foo') };
}
```

```ts
// loader — prefetch + dehydrate
const queryClient = getQueryClient();
await queryClient.prefetchQuery(fooQuery(http({ context })));
return { dehydratedState: dehydrate(queryClient) };
```

```tsx
// component — hydrate + read
<HydrationBoundary state={dehydratedState}>
  <FooCard />
</HydrationBoundary>

function FooCard() {
  const { data, isFetching, refetch } = useQuery(fooQuery());
  // ...
}
```

No prefetch — skip the loader/dehydrate/HydrationBoundary steps entirely and
just call `useQuery` in the component. It fetches client-side only, so the
first render shows `isLoading`, not data (no loader involved, so there is
nothing server-side to bind `request` to — `fooQuery()` uses its default
browser client):

```tsx
function FooCard() {
  const { data, isLoading, error, refetch } = useQuery(fooQuery());
  // ...
}
```

Root wiring (`root.tsx`): `middleware = [apiMiddleware, ...]`,
`<QueryClientProvider client={getQueryClient()}>`.

Envelope: every response is `{ data: T, message?: string }`; `http()`
returns the unwrapped `data`. A malformed envelope or non-JSON body throws
before it reaches your call site.
