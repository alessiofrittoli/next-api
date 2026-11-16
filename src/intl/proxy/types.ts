export interface ProxyCommonParams<Locale extends string> {
	/**
	 * An array of locales handled by the application.
	 *
	 */
	readonly locales: readonly Locale[]
	/**
	 * The application default locale.
	 *
	 */
	readonly defaultLocale: Locale
}
