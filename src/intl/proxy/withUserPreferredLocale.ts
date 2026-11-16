import { addUrlLocalePrefix, getPathnameLocale } from '@/intl/utils/url'
import { getRequestLocale } from '@/intl/utils/getRequestLocale'
import type { ProxyCommonParams } from '@/intl/proxy/types'
import { Cookie } from '@alessiofrittoli/web-utils/cookie'
import { Console } from '@alessiofrittoli/console'
import { Url } from '@alessiofrittoli/url-utils'
import { HttpCookie } from '@/HttpCookie'
import { NextResponse } from '@/response'
import type { Proxy } from '@/proxy'

export interface WithUserPreferredLocaleParams<Locale extends string> extends ProxyCommonParams<Locale> {
	/**
	 * A custom cookie name where user locale preference is stored.
	 *
	 * @default 'user-locale'
	 */
	readonly cookieName?: string
}

export const withUserPreferredLocale =
	<Locale extends string>(params: WithUserPreferredLocaleParams<Locale>): Proxy =>
	next =>
	async (request, event) => {
		const { locales, defaultLocale, cookieName = 'user-locale' } = params
		// const { headers } = request

		// const savedLocale = HttpCookie.request(request).get<Locale>(cookieName)?.get('value')

		// if (savedLocale && locales.includes(savedLocale) && !!headers.get('Referer')) {
		// 	/**
		// 	 * Do not save nor redirect to user locale if:
		// 	 *
		// 	 * - user has a valid locale cookie saved in his browser.
		// 	 * - user didn't access content directly
		// 	 */
		// 	return next(request, event)
		// }

		const { nextUrl } = request

		const routeLocale = getPathnameLocale({
			locales,
			defaultLocale,
			pathname: nextUrl.pathname,
		})

		const response = await next(request, event)

		const userLocale = getRequestLocale({
			locales,
			defaultLocale,
			request,
			cookieName,
		})

		const responseHeaders = response?.headers || new Headers()

		const localeCookie = Cookie.parse<typeof cookieName, Locale>({
			name: cookieName,
			maxAge: 1 * 30 * 24 * 60 * 60,
			httpOnly: false,
		})

		/**
		 * Save user preference about requested locale.
		 *
		 */
		HttpCookie.headers(responseHeaders).set(localeCookie.set('value', userLocale))

		/**
		 * Redirect requests from `/{locale}` to `/{userLocale}/*`.
		 *
		 */
		if (userLocale !== routeLocale) {
			const redirectUrl = Url.parse(request.url)

			redirectUrl.pathname = addUrlLocalePrefix({
				url: nextUrl.pathname,
				locales,
				locale: userLocale,
				defaultLocale,
			}).pathname

			Console.raw('•')
				.fg.blue('withUserPreferredLocale')
				.apply()
				.raw('|')
				.fg.cyan('redirect')
				.apply()
				.log(`request from "${nextUrl.pathname}" to "${redirectUrl.pathname}"`)

			return NextResponse.redirect(redirectUrl, {
				headers: responseHeaders,
			})
		}

		return response
	}
