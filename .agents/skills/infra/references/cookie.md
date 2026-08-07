# `shared/cookie` — schema-validated cookies

```ts
import { defineCookie } from '~/shared/cookie';

const myCookie = defineCookie({
  name: 'popngg_x',
  schema: z.object({ foo: z.string() }),
  fallback: { foo: 'default' },
});
```

```ts
await myCookie.read(request);        // server: pass the Request
await myCookie.read(document.cookie); // browser
await myCookie.write(value);          // browser only
await myCookie.clear();               // browser only
```

`read` never throws — invalid/missing/tampered cookies resolve to `fallback`.
Server responses set cookies via `Set-Cookie`, not `write`.
