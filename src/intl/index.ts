import { getTypedMap, type TypedMap } from '@alessiofrittoli/typed-map'
import { addUrlLocalePrefix, removeUrlLocalePrefix } from './utils'
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import type { Route, Routes } from '@/intl/types'

export * from '@/intl/types'

export interface IntlRoutesParams<
	RouteName extends string,
	Locale extends string,
	T extends Routes<RouteName, Locale> = Routes<RouteName, Locale>,
> {
	readonly routes: Iterable<readonly [RouteName, T[RouteName]]>
	readonly locales: readonly Locale[]
	readonly defaultLocale: Locale
}

export class IntlRoutes<
	RouteName extends string,
	Locale extends string,
	T extends Routes<RouteName, Locale> = Routes<RouteName, Locale>,
> {
	private readonly routes: TypedMap<T, false>
	public readonly locales: readonly Locale[]
	public readonly defaultLocale: Locale

	public constructor(params: IntlRoutesParams<RouteName, Locale, T>) {
		const { routes, locales, defaultLocale } = params

		this.routes = getTypedMap<T, false>(routes)
		this.locales = locales
		this.defaultLocale = defaultLocale
	}

	/**
	 * Get route definition.
	 *
	 * @returns The route definition.
	 */
	public get(name: RouteName): T[RouteName] {
		return this.routes.get(name)
	}

	/**
	 * Get route href.
	 *
	 * @returns The route href.
	 */
	public getRouteHref(name: RouteName, locale: Locale): string {
		const route = this.routes.get(name)

		return Url.format(
			addUrlLocalePrefix({
				url: route.get(locale).href,
				locale,
				locales: this.locales,
				defaultLocale: this.defaultLocale,
			}),
		)
	}

	/**
	 * Get all routes definition.
	 *
	 * @returns The routes definition.
	 */
	public getAll(): TypedMap<T, false> {
		return this.routes
	}

	/**
	 * Set a route definition.
	 *
	 * @returns The routes definition.
	 */
	public set<K extends RouteName>(name: K, value: T[K]): TypedMap<T, false> {
		return this.routes.set(name, value)
	}

	/**
	 * Get route definition by pathname.
	 *
	 * @param params An object defining find criteria.
	 *
	 * @returns The route definition if any, `undefined` otherwise.
	 */
	public getRouteByPathname(url: UrlInput, locale: Locale): [keyof T, T[keyof T]] | undefined {
		const { locales } = this

		const requestPathname = removeUrlLocalePrefix({ url, locales }).pathname

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

	/**
	 * Format route definition.
	 *
	 * @param iterable An iterable defining route definitions.
	 *
	 * @returns The formatted route definition.
	 */
	public static FormatRoute<U extends Route, K extends keyof U = keyof U>(
		iterable: Iterable<readonly [K, U[K]]>,
	): TypedMap<U, false, K> {
		return getTypedMap<U, false, K>(iterable)
	}
}
