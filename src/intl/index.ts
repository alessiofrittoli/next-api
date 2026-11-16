import type { GetRouteByPathnameParams, Route, Routes } from '@/intl/types'
import { getTypedMap, type TypedMap } from '@alessiofrittoli/typed-map'
import { Url } from '@alessiofrittoli/url-utils'
import { removeUrlLocalePrefix } from './utils'

export * from '@/intl/types'

export class IntlRoutes<
	RouteName extends string,
	Locale extends string,
	T extends Routes<RouteName, Locale> = Routes<RouteName, Locale>,
> {
	private readonly routes: TypedMap<T, false>

	public constructor(routes: Iterable<readonly [RouteName, T[RouteName]]>) {
		this.routes = getTypedMap<T, false>(routes)
	}

	public get(key: RouteName): T[RouteName] {
		return this.routes.get(key)
	}

	public getAll(): TypedMap<T, false> {
		return this.routes
	}

	public set<K extends RouteName>(key: K, value: T[K]): TypedMap<T, false> {
		return this.routes.set(key, value)
	}

	public getRouteByPathname(params: GetRouteByPathnameParams<Locale>): [keyof T, T[keyof T]] | undefined {
		const { url, locale, locales } = params

		const requestPathname = removeUrlLocalePrefix({
			url,
			locales,
		}).pathname

		return Array.from(this.getAll().entries()).find(
			([, route]) =>
				// Check if there is some route with the given `routeLocale` and `requestPathname`.
				Url.parse(route.get(locale).rewrite || route.get(locale).href).pathname.endsWith(
					requestPathname,
				) ||
				// Check if there is some route with the given `requestPathname` (e.g. `en` requests an `it` url).
				Array.from(route.entries()).find(([, intlRoute]) =>
					// Url.parse( intlRoute.href ).pathname === requestPathname
					Url.parse(intlRoute.href).pathname.endsWith(requestPathname),
				),
		)
	}

	public static FormatRoute<U extends Route, K extends keyof U = keyof U>(
		iterable: Iterable<readonly [K, U[K]]>,
	): TypedMap<U, false, K> {
		return getTypedMap<U, false, K>(iterable)
	}
}
