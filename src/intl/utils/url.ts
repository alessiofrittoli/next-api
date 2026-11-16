import { removeLeadingSlash, Url, type UrlInput } from '@alessiofrittoli/url-utils'
import { getLocale, type GetLocaleParams } from './acceptLanguage'

export interface GetPathnameLocaleParams<Locale extends string> extends Pick<
	GetLocaleParams<Locale>,
	'locales' | 'defaultLocale'
> {
	readonly pathname: string
}

export const getPathnameLocale = <Locale extends string>(params: GetPathnameLocaleParams<Locale>): Locale => {
	const { locales, defaultLocale, pathname } = params

	return getLocale({
		locales,
		defaultLocale,
		priorityList: removeLeadingSlash(pathname).split('/').at(0),
	})
}

export interface RemoveUrlLocalePrefixParams<Locale extends string> {
	readonly url: UrlInput
	readonly locales: readonly Locale[]
}

export const removeUrlLocalePrefix = <Locale extends string>(
	params: RemoveUrlLocalePrefixParams<Locale>,
): URL => {
	const { url, locales } = params

	const parsed = Url.parse(url)
	const { pathname } = parsed
	const fragments = removeLeadingSlash(pathname).split('/')
	const routeLocale = fragments.at(0) as Locale | undefined

	if (routeLocale && locales.includes(routeLocale)) {
		fragments.shift() // remove locale prefix
	}

	parsed.pathname = fragments.join('/')

	return parsed
}

interface AddUrlLocalePrefixOptions<Locale extends string> {
	readonly url: UrlInput
	readonly locales: readonly Locale[]
	readonly locale?: Locale
	readonly defaultLocale: Locale
	readonly baseUrl?: UrlInput
	readonly skipDefaultLocale?: boolean
}

export const addUrlLocalePrefix = <Locale extends string>(params: AddUrlLocalePrefixOptions<Locale>): URL => {
	const { baseUrl, locales, defaultLocale, locale = defaultLocale, skipDefaultLocale = true } = params

	const _url = baseUrl ? new URL(Url.format(params.url), Url.format(baseUrl)) : params.url

	const url = removeUrlLocalePrefix({
		url: _url,
		locales,
	})

	const fragments = removeLeadingSlash(url.pathname).split('/')

	if (!skipDefaultLocale || locale !== defaultLocale) {
		fragments.unshift(locale) // add new locale prefix
	}

	url.pathname = fragments.join('/')

	return url
}
