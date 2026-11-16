import { addUrlLocalePrefix, getPathnameLocale, removeUrlLocalePrefix } from '@/intl/utils'
import type { ProxyCommonParams } from '@/intl/proxy/types'
import { Console } from '@alessiofrittoli/console'
import { Url } from '@alessiofrittoli/url-utils'
import { NextResponse } from '@/response'
import type { IntlRoutes } from '@/intl'
import type { Proxy } from '@/proxy'

export interface WithIntlRoutesParams<Locale extends string> extends ProxyCommonParams<Locale> {
	/**
	 * The `IntlRoutes` instance.
	 *
	 */
	readonly routes: IntlRoutes<string, Locale>
}

export const withIntlRoutes =
	<Locale extends string>(params: WithIntlRoutesParams<Locale>): Proxy =>
	next =>
	async (request, event) => {
		const { routes, locales, defaultLocale } = params
		const { nextUrl } = request

		const requestLocale = getPathnameLocale({
			locales,
			defaultLocale,
			pathname: nextUrl.pathname,
		})

		const requestPathname = removeUrlLocalePrefix({
			url: nextUrl,
			locales,
		}).pathname

		const route = routes.getRouteByPathname(nextUrl.pathname, requestLocale)?.[1]

		if (!route) {
			/** Check if current path is dynamic and has parent route. */
			const fragments = requestPathname.split('/').filter(n => n)

			for (let index = 1; index < fragments.length; index++) {
				const check = fragments.slice(0, index * -1).join('/')

				if (!check) continue

				const route = routes.getRouteByPathname(check, requestLocale)?.[1]

				const intlRoute = route && route.get(requestLocale)
				const routeRewrite = intlRoute && intlRoute.rewrite
				const routePathname = intlRoute && Url.parse(intlRoute.href).pathname

				if (routePathname && routeRewrite) {
					const rewriteUrl = Url.parse(request.url)

					rewriteUrl.pathname = addUrlLocalePrefix({
						url: requestPathname.replace(routePathname, Url.format(routeRewrite)),
						locales,
						locale: requestLocale,
						defaultLocale,
						skipDefaultLocale: false,
					}).pathname

					Console.raw('•')
						.fg.blue('withIntlRoutes')
						.apply()
						.raw('|')
						.fg.cyan('rewrite')
						.apply()
						.log(`request from "${nextUrl.pathname}" to "${rewriteUrl.pathname}"`)

					return NextResponse.rewrite(rewriteUrl)
				}
			}
		}

		const intlRoute = route && route.get(requestLocale)
		const routeRewrite = intlRoute && intlRoute.rewrite
		const routePathname = intlRoute && Url.parse(intlRoute.href).pathname

		/**
		 * Redirect to the internationalized route.
		 *
		 * i.e. - Redirect from `/interationalized-route` to `/rotta-internazionalizzata` when request locale is `it` and pathname is `en`.
		 */
		if (routePathname && routePathname !== requestPathname) {
			const response = await next(request, event)
			const redirectUrl = Url.parse(request.url)
			redirectUrl.pathname = addUrlLocalePrefix({
				url: routePathname,
				locales,
				locale: requestLocale,
				defaultLocale,
			}).pathname

			Console.raw('•')
				.fg.blue('withIntlRoutes')
				.apply()
				.raw('|')
				.fg.cyan('redirect')
				.apply()
				.log(`request from "${nextUrl.pathname}" to "${redirectUrl.pathname}"`)

			return NextResponse.redirect(redirectUrl, {
				headers: response?.headers,
				status: 308,
			})
		}

		/**
		 * Early return if requested route has no rewrite or hasn't been found in the registry.
		 *
		 */
		if (!routeRewrite) {
			return next(request, event)
		}

		/**
		 * Rewrite from default locale internazionalized route to `/{defaultLocale}/pathname`.
		 *
		 * i.e. Rewrite from `/rotta-internazionalizzata` to `/it/internationalized-route`.
		 */
		const rewriteUrl = Url.parse(request.url)

		rewriteUrl.pathname = addUrlLocalePrefix({
			url: Url.format(routeRewrite),
			locale: requestLocale,
			locales,
			defaultLocale,
			skipDefaultLocale: false,
		}).pathname

		Console.raw('•')
			.fg.blue('withIntlRoutes')
			.apply()
			.raw('|')
			.fg.cyan('rewrite')
			.apply()
			.log(`request from "${nextUrl.pathname}" to "${rewriteUrl.pathname}"`)

		return NextResponse.rewrite(rewriteUrl)
	}
