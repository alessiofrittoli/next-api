<h1 align="center">Next.js API utilities △</h1>
<h2 align="center">
  Next.js API utility library
</h2>
<p align="center">
  <a href="https://npmjs.org/package/@alessiofrittoli/next-api">
    <img src="https://img.shields.io/npm/v/@alessiofrittoli/next-api" alt="Latest version"/>
  </a>
  <a href="https://coveralls.io/github/alessiofrittoli/next-api">
    <img src="https://coveralls.io/repos/github/alessiofrittoli/next-api/badge.svg" alt="Test coverage"/>
  </a>
  <a href="https://socket.dev/npm/package/@alessiofrittoli/next-api/overview">
    <img src="https://socket.dev/api/badge/npm/package/@alessiofrittoli/next-api" alt="Socket Security score"/>
  </a>
  <a href="https://npmjs.org/package/@alessiofrittoli/next-api">
    <img src="https://img.shields.io/npm/dm/@alessiofrittoli/next-api.svg" alt="npm downloads"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/next-api">
    <img src="https://badgen.net/bundlephobia/dependency-count/@alessiofrittoli/next-api" alt="Dependencies"/>
  </a>
  <a href="https://libraries.io/npm/%40alessiofrittoli%2Fnext-api">
    <img src="https://img.shields.io/librariesio/release/npm/@alessiofrittoli/next-api" alt="Dependencies status"/>
  </a>
</p>
<p align="center">
  <a href="https://bundlephobia.com/package/@alessiofrittoli/next-api">
    <img src="https://badgen.net/bundlephobia/min/@alessiofrittoli/next-api" alt="minified"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/next-api">
    <img src="https://badgen.net/bundlephobia/minzip/@alessiofrittoli/next-api" alt="minizipped"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/next-api">
    <img src="https://badgen.net/bundlephobia/tree-shaking/@alessiofrittoli/next-api" alt="Tree shakable"/>
  </a>
</p>
<p align="center">
  <a href="https://github.com/sponsors/alessiofrittoli">
    <img src="https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2" alt="Fund this package"/>
  </a>
</p>

[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

### Table of Content

- [Development](#development)
  - [Local development](#local-development)
  - [Production build](#production-build)
  - [Unit tests](#unit-tests)
    - [Run tests with coverage](#run-tests-with-coverage)
  - [Contributing](#contributing)
  - [Security](#security)
- [API Reference](#api-reference)
  - [Server context](#server-context)
    - [`createServerContext`](#createservercontext)
  - [Internationalized routes](#internationalized-routes)
    - [`IntlRoutes`](#intlroutes)
    - [Proxy helpers](#proxy-helpers)
- [Credits](#made-with-)

---

### Getting started

Run the following command to start using `next-api` in your projects:

```bash
npm i @alessiofrittoli/next-api
```

or using `pnpm`

```bash
pnpm i @alessiofrittoli/next-api
```

---

### Development

Run the following to start development

```shell
nvm use

pnpm i
```

#### Local development

Run the following

```shell
pnpm dev
```

This will generate unminified output code, sourcemaps and will enable source file watcher.

---

#### Production build

Run the following to create a local production build

```shell
pnpm build
```

This will generate minified output code without sourcemaps.

---

#### Unit tests

Run all the defined test suites by running the following:

```shell
# Run tests and watch file changes.
pnpm test:watch

# Run tests in a CI environment.
pnpm test:ci
```

---

##### Run tests with coverage

An HTTP server is then started to serve coverage files from `./coverage` folder.

⚠️ You may see a blank page the first time you run this command. Simply refresh the browser to see the updates.

```shell
pnpm test:coverage:serve
```

---

#### Contributing

Contributions are truly welcome!

Please refer to the [Contributing Doc](./CONTRIBUTING.md) for more information on how to start contributing to this project.

Help keep this project up to date with [GitHub Sponsor][sponsor-url].

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

---

#### Security

If you believe you have found a security vulnerability, we encourage you to **_responsibly disclose this and NOT open a public issue_**. We will investigate all legitimate reports. Email `security@alessiofrittoli.it` to disclose any security vulnerabilities.

---

### API Reference

#### Server context

##### `createServerContext`

`createServerContext()` creates a typed map for server context and memoizes its creation with `React.cache()`. Pass an initial `TypedMap` to use it as the context value, or omit it to start with an empty map. React scopes the cached value to the current server render, so calls made during the same render share the context while separate requests receive separate contexts.

Import it from the `/server` entry point:

```typescript
import { createServerContext } from '@alessiofrittoli/next-api/server'
import { getTypedMap, type TypedMap } from '@alessiofrittoli/typed-map'
```

For example, you can initialize a root context with separate maps for page and shared data, then expose a helper that returns either the root map or one of its entries:

```typescript
interface PageContext {
  locale: string
}

interface CommonContext {
  someValue: boolean
}

interface RootContextState {
  page: TypedMap<PageContext, false>
  commonData: TypedMap<CommonContext, false>
}

type RootContext = TypedMap<RootContextState, false>

const initialContext = getTypedMap<RootContextState, false>([
  ['page', getTypedMap<PageContext, false>()],
  ['commonData', getTypedMap<CommonContext, false>()],
])

export function getServerContext(): RootContext
export function getServerContext<K extends keyof RootContextState>(key: K): RootContextState[K]
export function getServerContext<K extends keyof RootContextState>(
  key?: K,
): RootContext | RootContextState[K] {
  const context = createServerContext(initialContext)
  return key ? context.get(key) : context
}
```

Use the returned map in server components to share values during a render. A client component can read a serialized context value if you pass it through a React context provider.

#### Internationalized routes

##### `IntlRoutes`

`IntlRoutes` stores named route definitions for multiple locales. Use it to keep translated paths and their corresponding page rewrite paths together, then reuse the definitions wherever you need them, such as links and sitemap generation.

Import `IntlRoutes` and the `Route` type from the `/intl` entry point:

```typescript
import { IntlRoutes, type Route as NextRoute } from '@alessiofrittoli/next-api/intl'
```

Define the supported locales and route names, then provide the route definitions to the constructor:

```typescript
export const defaultLocale = 'en'
export const locales = [defaultLocale, 'it'] as const

export type Locale = (typeof locales)[number]
export type RouteName = 'home' | 'login'
export type Route = NextRoute<Locale>

export const routes = new IntlRoutes<RouteName, Locale>({
  locales,
  defaultLocale,
  routes: [
    [
      'home',
      IntlRoutes.FormatRoute<Route>([
        ['it', { href: '/' }],
        ['en', { href: '/' }],
      ]),
    ],
    [
      'login',
      IntlRoutes.FormatRoute<Route>([
        ['it', { href: '/autenticazione', rewrite: '/login' }],
        ['en', { href: '/login' }],
      ]),
    ],
  ],
})
```

Each `IntlRoute` requires an `href` and may include a `rewrite`. The `href` is the public URL for that locale; `rewrite` is the internal page path used by the application. `getRouteHref()` adds the locale prefix for non-default locales and returns the formatted URL:

```tsx
<Link href={routes.getRouteHref('login', locale)}>Go to login page</Link>
```

The class provides these methods:

- `get(name)` returns the localized route map for a route name.
- `getRouteHref(name, locale)` returns that locale's public href with its locale prefix when needed.
- `getAll()` returns the map of all named routes.
- `set(name, route)` adds or replaces a route and returns the routes map.
- `getRouteByPathname(url, locale)` finds a route matching a URL pathname. It checks the selected locale's rewrite or href, then the hrefs for the other locales.
- `IntlRoutes.FormatRoute(entries)` creates the locale-to-route map used in each route definition.

##### Proxy helpers

The `/intl/proxy` entry point exports three proxy functions for locale selection and localized route handling:

```typescript
import {
  withImplictDefaultLocale,
  withIntlRoutes,
  withUserPreferredLocale,
} from '@alessiofrittoli/next-api/intl/proxy'
```

All three accept `locales` and `defaultLocale`. `withIntlRoutes` also accepts the `IntlRoutes` instance. `withUserPreferredLocale` optionally accepts `cookieName`, which defaults to `'user-locale'`.

Compose them with `Chain.functions()` in your Next.js `proxy.ts`:

```typescript
import {
  withImplictDefaultLocale,
  withIntlRoutes,
  withUserPreferredLocale,
} from '@alessiofrittoli/next-api/intl/proxy'
import { lastProxy, type ProxyFactory } from '@alessiofrittoli/next-api/middlewares'
import { Chain } from '@alessiofrittoli/chain-functions'
import { defaultLocale, locales } from '@/i18n'
import { routes } from '@/data/routes'

const factory: ProxyFactory = [
  withUserPreferredLocale({ locales, defaultLocale }),
  withIntlRoutes({ locales, defaultLocale, routes }),
  withImplictDefaultLocale({ locales, defaultLocale }),
  lastProxy,
]

export default Chain.functions(factory)
```

Add a Next.js `config.matcher` alongside the proxy export to choose which requests run through this chain. This matcher excludes API routes and static assets:

```typescript
export const config = {
  matcher: ['/((?!api/|_next|.*\\..*).*)'],
}
```

`withUserPreferredLocale` determines a supported locale from the `locale` query parameter, the `X-Locale` header, the configured cookie, or the `Accept-Language` header, in that order. If none selects a locale, it uses `defaultLocale`. It stores the selected locale in the cookie and redirects a request when its current locale prefix differs from the selected locale.

`withIntlRoutes` uses the route registry to handle translated paths. It redirects a known route to the current locale's public `href` when needed, and rewrites routes with a `rewrite` value to their internal page path. It also handles deeper paths under registered routes when the route has both `href` and `rewrite` values.

`withImplictDefaultLocale` rewrites requests for the default locale to an internal path prefixed with that locale. For example, `/login` is rewritten to `/en/login` when `en` is the default locale. Configure your Next.js pages under a first-level locale segment, such as `app/[locale]/...`. Requests already prefixed with a non-default locale pass through without this rewrite.

The order in the example lets the locale preference helper select the locale, lets the route helper apply translations, and then sends default-locale paths to their locale-prefixed internal route. `lastProxy` terminates the chain with `NextResponse.next()`.

---

### Made with ☕

<table style='display:flex;gap:20px;'>
  <tbody>
    <tr>
      <td>
        <img alt="avatar" src='https://avatars.githubusercontent.com/u/35973186' style='width:60px;border-radius:50%;object-fit:contain;'>
      </td>
      <td>
        <table style='display:flex;gap:2px;flex-direction:column;'>
          <tbody>
              <tr>
                <td>
                  <a href='https://github.com/alessiofrittoli' target='_blank' rel='noopener'>Alessio Frittoli</a>
                </td>
              </tr>
              <tr>
                <td>
                  <small>
                    <a href='https://alessiofrittoli.it' target='_blank' rel='noopener'>https://alessiofrittoli.it</a> |
                    <a href='mailto:info@alessiofrittoli.it' target='_blank' rel='noopener'>info@alessiofrittoli.it</a>
                  </small>
                </td>
              </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
