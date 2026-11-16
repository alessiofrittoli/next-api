import { addUrlLocalePrefix, getPathnameLocale } from '@/intl/utils'
import type { ProxyCommonParams } from '@/intl/proxy/types'
import { Console } from '@alessiofrittoli/console'
import { Url } from '@alessiofrittoli/url-utils'
import { NextResponse } from '@/response'
import type { Proxy } from '@/proxy'

export type WithImplictDefaultLocaleParams<Locale extends string> = ProxyCommonParams<Locale>

/**
 * Rewrite requests from `/*` to `/{defaultLocale}/*`.
 *
 * ⚠️ make sure to add your routes inside a 1st level dynamic fragment (e.g. `app/[locale]/**\/page.tsx`)
 *
 * @param params An object defining required parameters. See {@link WithImplictDefaultLocaleParams} for more info.
 *
 * @returns The `Proxy` function.
 */
export const withImplictDefaultLocale =
	<Locale extends string>(params: WithImplictDefaultLocaleParams<Locale>): Proxy =>
	next =>
	async (request, event) => {
		const { locales, defaultLocale } = params

		const { nextUrl } = request

		const routeLocale = getPathnameLocale({
			pathname: nextUrl.pathname,
			locales,
			defaultLocale,
		})

		const response = await next(request, event)

		/**
		 * Rewrite requests from `/*` to `/{defaultLocale}/*`.
		 * Ignore requests from `/{nonDefaultLocale}/*`.
		 */
		if (routeLocale === defaultLocale) {
			const rewriteUrl = Url.parse(request.url)

			rewriteUrl.pathname = addUrlLocalePrefix({
				url: nextUrl.pathname,
				locale: routeLocale,
				locales,
				defaultLocale,
				skipDefaultLocale: false,
			}).pathname

			Console.raw('•')
				.fg.blue('withImplictDefaultLocale')
				.apply()
				.raw('|')
				.fg.cyan('rewrite')
				.apply()
				.log(`request from "${nextUrl.pathname}" to "${rewriteUrl.pathname}"`)

			return NextResponse.rewrite(rewriteUrl, {
				headers: response?.headers,
			})
		}

		return response
	}
