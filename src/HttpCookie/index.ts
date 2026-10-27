import type {
	RawCookie,
	ParsedCookie,
	ParsedCookieMap,
	CookiesTypedMap,
} from '@alessiofrittoli/web-utils/cookie'
import { Cookie } from '@alessiofrittoli/web-utils/cookie'
import type { Api } from '@/types'

export { Priority, SameSite } from '@alessiofrittoli/web-utils/cookie'
export type { RawCookie, ParsedCookie, ParsedCookieMap }

/**
 * Easly handle HTTP cookies.
 *
 * Requires the following packages to be installed:
 *
 * - [`@alessiofrittoli/typed-map`](https://npmjs.com/package/@alessiofrittoli/typed-map)
 * - [`@alessiofrittoli/web-utils`](https://npmjs.com/package/@alessiofrittoli/web-utils)
 * - [`@alessiofrittoli/date-utils`](https://npmjs.com/package/@alessiofrittoli/date-utils)
 * - [`@alessiofrittoli/math-utils`](https://npmjs.com/package/@alessiofrittoli/math-utils)
 */
export class HttpCookie {
	/**
	 * Internal Next.js API Request object use to read cookies.
	 *
	 */
	private static _request?: Api.Route.Request<unknown>

	/**
	 * Internal Response Headers used to set new cookies.
	 *
	 */
	private static _headers?: Headers

	/**
	 * Set internal `request` reference so `HttpCookie` can retrieve cookies from the Request Headers.
	 *
	 * @param	request The Next.js API Request object.
	 * @returns	The `HttpCookie` reference for chaining purposes.
	 */
	public static request<T>(request: Api.Route.Request<T>): typeof HttpCookie {
		this._request = request
		return this
	}

	/**
	 * Set internal `headers` reference so `HttpCookie` can set cookies to the Response Headers.
	 *
	 * @param	headers The Response `Headers` instance. Those headers must be returned in the server response so cookies can be effectively set.
	 * @returns	The `HttpCookie` reference for chaining purposes.
	 */
	public static headers(headers: Headers): typeof HttpCookie {
		this._headers = headers
		return this
	}

	/**
	 * Get Response Headers.
	 *
	 * @returns The Response Headers.
	 */
	public static getHeaders(): Headers {
		this._headers ||= new Headers()
		return this._headers
	}

	/**
	 * Get a cookie by cookie name from Request Headers.
	 *
	 * @param	name The name of the cookie.
	 * @returns	The found parsed cookie or `undefined` if no cookie has been found in Request Headers.
	 */
	public static get<T, K extends string | number | symbol = string>(
		name: K,
	): ParsedCookieMap<K, T> | undefined {
		if (!this._request) return

		return Cookie.fromListString<Record<K, T>>(this._request.headers.get('Cookie') || '').get(name)
	}

	/**
	 * Get all cookies from Request Headers.
	 *
	 * @returns	The parsed cookie found in Request Headers.
	 */
	public static getAll<T extends Record<string, unknown>>(): CookiesTypedMap<T, keyof T> {
		return Cookie.fromListString<T>(this._request?.headers.get('Cookie')?.replace(/, /gi, '; ') || '')
	}

	/**
	 * Set a cookie to Response Headers.
	 *
	 * @param	options The cookie options or a parsed Cookie Map.
	 * @returns	The `HttpCookie` reference for chaining purposes.
	 */
	public static set<K = string, V = unknown>(
		options: RawCookie<K, V> | ParsedCookieMap<K, V>,
	): typeof HttpCookie {
		const cookie = Cookie.parse(options)
		const headers = this.getHeaders()

		if (!cookie.has('path')) {
			cookie.set('path', '/')
		}

		if (!cookie.has('httpOnly')) {
			cookie.set('httpOnly', true)
		}

		headers.append('Set-Cookie', Cookie.toString(cookie))

		return this
	}

	/**
	 * Delete a cookie by cookie name from `Document.cookie`.
	 *
	 * @param name The name of the cookie.
	 * @returns	`true` if successful, `false` otherwise.
	 */
	public static delete<K = string, V = unknown>(
		options: RawCookie<K, V> | ParsedCookieMap<K, V>,
	): typeof HttpCookie {
		return HttpCookie.set(Cookie.parse(options).set('maxAge', 0))
	}

	public static readonly toString = Cookie.toString
	public static readonly fromString = Cookie.fromString
	public static readonly fromListString = Cookie.fromListString
	public static readonly parse = Cookie.parse
}
