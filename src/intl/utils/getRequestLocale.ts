// import { defaultLocale, type Locale, localeCookieName } from '@i18n'
// import { HttpCookie } from '@alessiofrittoli/next-api/HttpCookie'
// import { getLocale } from '@i18n/utils/acceptLanguage'
// import type { Api } from '@alessiofrittoli/next-api'

import { getLocale } from './acceptLanguage'
import { HttpCookie } from '@/HttpCookie'
import type { Api } from '@/types'

export interface GetRequestLocaleParams<Locale extends string> {
	readonly locales: readonly Locale[]
	readonly defaultLocale: Locale
	readonly cookieName: string
	readonly request: Api.Route.Request
	readonly respectUser?: boolean
}

/**
 * Get Request Locale from Cookies (set by a language switcher) or `Accept-Language` Request Header.
 *
 * @param	request		The Next.js API Request object.
 * @param	respectUser	Wether to respect user `Locale` preference or not.
 *
 * @returns The request `Locale` or user preferred `Locale` if `respectUser` is set to true.
 */
export const getRequestLocale = <Locale extends string>(
	params: GetRequestLocaleParams<Locale>,
): Locale | undefined => {
	const { locales, defaultLocale, request, cookieName, respectUser = true } = params
	const { nextUrl } = request
	const { headers } = request

	const searchParam = nextUrl.searchParams.get('locale')

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

	const cookie = HttpCookie.request(request).get<Locale>(cookieName)?.get('value')

	if (cookie) {
		return getLocale({
			locales,
			defaultLocale,
			priorityList: cookie,
		})
	}

	if (respectUser) {
		return getLocale({
			locales,
			defaultLocale,
			priorityList: headers.get('Accept-Language'),
		})
	}

	return defaultLocale
}
