import acceptLanguage from 'accept-language'

export interface GetLocaleParams<Locale extends string> {
	readonly locales: readonly Locale[]
	readonly defaultLocale: Locale
	readonly priorityList?: string | null
}

/**
 * Get matched locale. If no match, the default locale will be returned.
 *
 * @returns A valid supported locale, the default locale otherwise.
 */
export const getLocale = <Locale extends string>(params: GetLocaleParams<Locale>): Locale => {
	const { locales, defaultLocale, priorityList } = params

	acceptLanguage.languages(locales as unknown as string[])

	return (acceptLanguage.get(priorityList) as Locale) || defaultLocale
}
