import type { Api } from '@/types'
import { Cookie } from '@alessiofrittoli/web-utils/storage/Cookie'
import type { RawCookie, ParsedCookie, ParsedCookieMap } from '@alessiofrittoli/web-utils/storage/Cookie'

export { Priority, SameSite } from '@alessiofrittoli/web-utils/storage/Cookie'
export type { RawCookie, ParsedCookie, ParsedCookieMap }


/**
 * Easly handle HTTP cookies.
 * 
 */
export class HttpCookie
{
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
	static request<T>( request: Api.Route.Request<T> )
	{
		this._request = request
		return this
	}
	
	
	/**
	 * Set internal `headers` reference so `HttpCookie` can set cookies to the Response Headers.
	 * 
	 * @param	headers The Response `Headers` instance. Those headers must be returned in the server response so cookies can be effectively set.
	 * @returns	The `HttpCookie` reference for chaining purposes.
	 */
	static headers( headers: Headers )
	{
		this._headers = headers
		return this
	}


	/**
	 * Get Response Headers.
	 * 
	 * @returns The Response Headers.
	 */
	static getHeaders()
	{
		this._headers ||= new Headers()
		return this._headers
	}


	/**
	 * Get a cookie by cookie name from Request Headers.
	 * 
	 * @param	name The name of the cookie.
	 * @returns	The found parsed cookie or `undefined` if no cookie has been found in Request Headers.
	 */
	static get<T, K extends string | number | symbol = string>( name: K )
	{
		if ( ! this._request ) return

		return (
			Cookie.fromListString<Record<K, T>>( this._request.headers.get( 'Cookie' ) || '' )
				.get( name )
		)
	}


	/**
	 * Get all cookies from Request Headers.
	 * 
	 * @returns	The parsed cookie found in Request Headers.
	 */
	static getAll<T extends Record<string, unknown>>()
	{
		return Cookie.fromListString<T>( this._request?.headers.get( 'Cookie' ) || '' )
	}


	/**
	 * Set a cookie to Response Headers.
	 * 
	 * @param	options The cookie options or a parsed Cookie Map.
	 * @returns	The `HttpCookie` reference for chaining purposes.
	 */
	static set<K = string, V = unknown>( options: RawCookie<K, V> | ParsedCookieMap<K, V> )
	{
		const cookie	= Cookie.parse( options )
		const headers	= this.getHeaders()

		if ( ! cookie.has( 'path' ) ) {
			cookie.set( 'path', '/' )
		}

		if ( ! cookie.has( 'httpOnly' ) ) {
			cookie.set( 'httpOnly', true )
		}
		
		headers.append( 'Set-Cookie', Cookie.toString( cookie ) )

		return this
	}


	/**
	 * Delete a cookie by cookie name from `Document.cookie`.
	 * 
	 * @param name The name of the cookie.
	 * @returns	`true` if successful, `false` otherwise.
	 */
	static delete<K = string, V = unknown>( options: RawCookie<K, V> | ParsedCookieMap<K, V> )
	{
		return (
			HttpCookie.set(
				Cookie.parse( options ).set( 'maxAge', 0 )
			)
		)
	}


	static toString			= Cookie.toString
	static fromString		= Cookie.fromString
	static fromListString	= Cookie.fromListString
	static parse			= Cookie.parse
}