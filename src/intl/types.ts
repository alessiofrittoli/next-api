import type { UrlInput } from '@alessiofrittoli/url-utils'
import type { TypedMap } from '@alessiofrittoli/typed-map'

export interface IntlRoute {
	/**
	 * The Route title.
	 *
	 */
	title?: string
	/**
	 * The Route URL.
	 *
	 */
	href: UrlInput
	/**
	 * The Route rewrite path. This should match your Next.js Page folder names.
	 *
	 */
	rewrite?: UrlInput
}

export type Route<Locale extends string = string> = {
	[K in Locale]: IntlRoute
}

export type RouteMap<Locale extends string> = TypedMap<Route<Locale>, false>

export type Routes<RouteName extends string = string, Locale extends string = string> = {
	[K in RouteName]: TypedMap<Route<Locale>, false>
}
