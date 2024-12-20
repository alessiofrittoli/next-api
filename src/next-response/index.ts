import { NextResponse as NextApiResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { removeTrailingSlash } from '@alessiofrittoli/url-utils/slash'

import Exception from '@alessiofrittoli/exception'
import { ResponseStatus } from '@alessiofrittoli/http-server-status'
import { message as responseMessage } from '@alessiofrittoli/http-server-status/message'

import type Api from '../types/api'
import ErrorCode from '../error'


export interface NextResponseProps
{
	/** The Response BodyInit. */
	body?: BodyInit | null
	/** ResponseInit */
	init?: ResponseInit
	/** The NextRequest instance. This is used internally to retrieve Request Headers. */
	request?: NextRequest
	/** An Object of {@link Api.CORSPolicy} defining custom policies for the API Response. If `true` CORS is enabled with the default configuration. */
	cors?: Api.CORSPolicy | true
}


export interface CorsHeadersOptions
{
	/** An object of {@link Api.CORSPolicy} defining custom policies for the API Response. */
	options?: Api.CORSPolicy
	/** Custom Response Headers. */
	headers?: Headers | HeadersInit
}

export type NextResponseIterator = (
	| Generator<Uint8Array, void, unknown>
	| AsyncGenerator<Uint8Array, void, unknown>
)

export type NextResponseStreamIterator = (
	| ReadableStream | NextResponseIterator
)


/**
 * This class extends the [`NextResponse` API](https://nextjs.org/docs/app/api-reference/functions/next-response) with additional convenience methods.
 * 
 * FIXME: add link to doc
 * Read more: [Next API Docs: NextResponse](#todo-add-link)
 */
class NextResponse<Body = unknown> extends NextApiResponse<Body>
{
	/**
	 * The NextResponse CORS options.
	 *
	 */
	static CorsOptions?: Api.CORSPolicy | true


	/**
	 * The NextResponse CORS default allowed HTTP methods.
	 *
	 */
	static CorsAllowedMethods: Api.RequestMethod[] = [
		'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'
	]


	/**
	 * The NextResponse CORS default allowed Headers.
	 *
	 */
	static CorsAllowedHeaders = [
		'Accept',
		'Accept-Version',
		'Authorization',
		'Content-Length',
		'Content-MD5',
		'Content-Type',
		'Date',
		'X-Api-Key',
		'X-Api-Version',
		'X-CSRF-Token',
		'X-Locale',
		'X-Requested-With',
	]


	/**
	 * The NextResponse CORS exposed Headers.
	 *
	 */
	static CorsExposedHeaders = [
		'Connection',
		'Retry-After',
		'Keep-Alive',
		'Date',
	]

	/**
	 * Create a new NextResponse instance.
	 *
	 * @param props ( Optional ) An object with {@link NextResponseProps} properties.
	 */
	constructor( props: NextResponseProps = {} )
	{
		const { body, init, request, cors } = props

		if ( cors ) {
			NextResponse.cors(
				request,
				typeof cors !== 'boolean' ? cors : undefined
			)
		}

		super( body, NextResponse.CorsInit( init ) )
	}


	/**
	 * Convert an Iterator into a ReadableStream.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
	 *
	 * @param	iterator The Iterator to convert.
	 * @returns	A new ReadableStream instance
	 */
	static iteratorToStream( iterator: NextResponseIterator ): ReadableStream<Uint8Array>
	{
		return (
			new ReadableStream<Uint8Array>( {
				async pull( controller ) {

					const { value, done } = await iterator.next()

					if ( ! done ) return controller.enqueue( value )

					return controller.close()

				},
			} )
		)
	}


	/**
	 * Stream Iterator to Response.
	 *
	 * @param	iterator The Iterator to stream.
	 * @returns	A new Response with Iterator ReadableStream Body.
	 */
	static stream(
		iterator: NextResponseStreamIterator,
		init?	: ResponseInit,
	)
	{
		return (
			new Response(
				iterator instanceof ReadableStream
					? iterator
					: this.iteratorToStream( iterator ),
				this.CorsInit( init )
			)
		)
	}


	/**
	 * Send a JSON Response.
	 *
	 * @param	body The JSON response body.
	 * @param	init The ResponseInit.
	 * @returns	The NextResponse instance.
	 */
	static json<JsonBody>( body: JsonBody, init?: ResponseInit )
	{
		return super.json( body, this.CorsInit( init ) )
	}


	/**
	 * Send a JSON Success Response.
	 *
	 * @param	body The JSON response body.
	 * @param	init ( Optional ) The ResponseInit.
	 * @param	time ( Optional ) Execution time in MS.
	 * @returns	The NextResponse instance.
	 */
	static successJson<JsonBody>( body: JsonBody, init?: ResponseInit, time?: number )
	{
		const data: Api.Response<JsonBody> = {
			ms		: time,
			message	: body,
		}

		return this.json( data, init )
	}


	/**
	 * Send a JSON Error Response.
	 *
	 * @param	exception	The `Exception` Error instance.
	 * @param	init		( Optional ) The ResponseInit.
	 *
	 * @returns	The NextResponse instance.
	 */
	static errorJson<TCode = number>(
		exception	: Exception<string, TCode>,
		init		: ResponseInit = {},
	)
	{
		const status	= ( init.status ?? exception.status ?? 500 ) as ResponseStatus
		const message	= exception?.message || responseMessage[ status ] || 'Bad request.'
		const error		= new Exception( message, { ...exception, status } )
		init.status		= status

		return this.json( error, init )
	}


	/**
	 * Send a JSON Empty Body Error Response.
	 *
	 * @param init ( Optional ) The ResponseInit.
	 * @returns	The NextResponse instance.
	 */
	static emptyBody( init?: ResponseInit )
	{
		return (
			this.errorJson( new Exception(
				'Empty, invalid or locked Request Body',
				{
					code	: ErrorCode.EMPTY_VALUE,
					status	: ResponseStatus.UnprocessableEntity,
				}
			), init )
		)
	}


	/**
	 * Enables Cross Origin Resource Sharing.
	 *
	 * @param	request	The incoming NextRequest instance.
	 * @param	cors	( Optional ) An Object of {@link Api.CORSPolicy} defining custom policies for the API Response.
	 * @returns The NextResponse instance allowing chaining methods.
	 */
	static cors( request?: NextRequest, cors?: Api.CORSPolicy )
	{
		const origin = request?.headers.get( 'origin' )

		this.CorsOptions = {
			...cors,
			requestOrigin: cors?.requestOrigin || origin
		}

		return this
	}


	/**
	 * Get CORS ResponseInit.
	 *
	 * @param	init ( Optional ) The ResponseInit.
	 * @returns	ResponseInit with CORS Response Headers, the given ResponseInit if CORS is disabled.
	 */
	private static CorsInit( init?: ResponseInit ): ResponseInit | undefined
	{
		if ( ! this.CorsOptions ) return init

		const headers = this.CorsHeaders( {
			options: typeof this.CorsOptions !== 'boolean' ? this.CorsOptions : undefined,
			headers: init?.headers,
		} )

		return { ...init, headers }
	}


	/**
	 * Get CORS Response Headers.
	 * 
	 * @param param0 ( Optional ) An object with optional `options` and `headers`. @see {@link CorsHeadersOptions}.
	 * @returns	CORS Response Headers instance.
	 */
	private static CorsHeaders(
		{ options = {}, headers }: CorsHeadersOptions = {}
	)
	{
		const wildCard = '*'

		const { ALLOWED_API_ORIGINS }	= process.env
		const { requestOrigin }			= options || {}
		const allowedMethods			= ( options?.methods || this.CorsAllowedMethods )
		let allowedOrigin				= options?.origin || ALLOWED_API_ORIGINS || wildCard

		if ( typeof allowedOrigin === 'string' && allowedOrigin !== wildCard ) {
			allowedOrigin = (
				allowedOrigin
					.replace( /\s/g, '' )		// remove white spaces.
					.split( ',' )				// split using comma.
					.filter( Boolean )			// filter array avoiding empty strings.
					.map( removeTrailingSlash )	// remove trailing slashes.
			)
		}
		if (
			requestOrigin &&
			(
				allowedOrigin.includes( removeTrailingSlash( requestOrigin ) ) ||
				allowedOrigin === wildCard
			)
		) {
			allowedOrigin = requestOrigin
		}

		const corsHeaders = new Headers( headers )
		corsHeaders.set( 'Access-Control-Allow-Origin', allowedOrigin.toString() )

		if ( typeof options?.credentials !== 'undefined' ) {
			corsHeaders.set( 'Access-Control-Allow-Credentials', options.credentials.toString() )
		}

		const allowdHeaders = this.CorsAllowedHeaders.concat( options?.headers || [] )
		const exposeHeaders = this.CorsExposedHeaders.concat( options?.exposedHeaders || [] )

		if ( allowdHeaders.length > 0 ) {
			corsHeaders.set( 'Access-Control-Allow-Headers', allowdHeaders.join( ', ' ) )
		}
		if ( exposeHeaders.length > 0 ) {
			corsHeaders.set( 'Access-Control-Expose-Headers', exposeHeaders.join( ', ' ) )
		}
		if ( allowedMethods.length > 0 ) {
			corsHeaders.set( 'Access-Control-Allow-Methods', allowedMethods.join( ', ' ) )
		}
		
		return corsHeaders

	}
}



export default NextResponse