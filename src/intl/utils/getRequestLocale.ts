import { getLocale } from '@/intl/utils/acceptLanguage'
import { HttpCookie } from '@/HttpCookie'
import type { Api } from '@/types'

export interface GetRequestLocaleParams<Locale extends string> {
	/**
	 * A list of application locales.
	 *
	 */
	readonly locales: readonly Locale[]
	/**
	 * The application default locale.
	 *
	 */
	readonly defaultLocale: Locale
	/**
	 * The Next.js API Request object or an object containing request `Headers`.
	 *
	 */
	readonly request: { headers: Headers } | Api.Route.Request
	/**
	 * A cookie name where locale preferences may be saved.
	 *
	 */
	readonly cookieName?: string
}

/**
 * Get Request Locale from Cookies (set by a language switcher) or `Accept-Language` Request Header.
 *
 * @param params An object defining required parameters. See {@link GetRequestLocaleParams} for more info.
 *
 * @returns The request `Locale` or user preferred `Locale`.
 *
 * @remarks
 * - attempt to retrieve and returns `locale` from `URLSearchParams` defined in given `NextRequest.nextUrl`.
 * - attempt to retrieve and returns `locale` from `X-Locale` request header.
 * - attempt to retrieve and returns `locale` from `cookieName` request Cookie.
 * - attempt to retrieve and returns `locale` from `Accept-Language` request header.
 * - returns the given `defaultLocale` if none of the above worked.
 */
export const getRequestLocale = <Locale extends string>(
	params: GetRequestLocaleParams<Locale>,
): Locale | undefined => {
	const { locales, defaultLocale, request, cookieName } = params
	const nextUrl = 'nextUrl' in request ? request.nextUrl : undefined
	const { headers } = request

	const searchParam = nextUrl?.searchParams.get('locale')

	if (searchParam) {
		return getLocale({
			locales,
			defaultLocale,
			priorityList: searchParam,
		})
	}

	const header = headers.get('X-Locale')

	if (header) {
		return getLocale({
			locales,
			defaultLocale,
			priorityList: header,
		})
	}

	const cookie = cookieName ? HttpCookie.request(request).get<Locale>(cookieName)?.get('value') : undefined

	if (cookie) {
		return getLocale({
			locales,
			defaultLocale,
			priorityList: cookie,
		})
	}

	return getLocale({
		locales,
		defaultLocale,
		priorityList: headers.get('Accept-Language'),
	})
}
