import { NextResponse as NextApiResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { removeTrailingSlash } from '@alessiofrittoli/url-utils/slash'

import { Exception } from '@alessiofrittoli/exception'
import { generatorToReadableStream } from '@alessiofrittoli/stream-reader/utils'
import { isGeneratorObject } from '@alessiofrittoli/web-utils/generators'

import { ErrorCode } from '@/error'
import type { CorsHeadersOptions, NextResponseProps, NextResponseStreamInput } from './types'
import type { Api } from '@/types'

export * from './types'


/**
 * This class extends the [`NextResponse` API](https://nextjs.org/docs/app/api-reference/functions/next-response) with additional convenience methods.
 * 
 */
export class NextResponse<Body = unknown> extends NextApiResponse<Body>
{
	/**
	 * The NextResponse CORS options.
	 *
	 */
	static CorsOptions?: CorsHeadersOptions[ 'options' ]


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
	 * @returns	The NextResponse instance.
	 */
	static successJson<JsonBody>( body: JsonBody, init?: ResponseInit )
	{
		const data: Api.Route.ResponseBody<JsonBody> = {
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
		const status	= ( init.status ?? exception.status ?? 500 )
		const error		= new Exception( exception.message, { ...exception, status } )
		init.status		= status

		return this.json( error, init )
	}


	static generatorToStream = generatorToReadableStream


	/**
	 * Stream to Response.
	 *
	 * @param	stream The Iterator or ReadableStream to stream.
	 * @returns	A new Response with ReadableStream Body.
	 */
	static stream<T = unknown>(
		stream	: NextResponseStreamInput<T>,
		init?	: ResponseInit,
	)
	{
		return (
			new Response(
				! isGeneratorObject( stream )
					? stream as ReadableStream<T>
					: this.generatorToStream( stream ),
				this.CorsInit( init )
			)
		)
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
					code	: ErrorCode.Exception.EMPTY_VALUE,
					status	: 422,
				}
			), init )
		)
	}


	/**
	 * Enables Cross Origin Resource Sharing.
	 *
	 * @param	request	The incoming NextRequest instance.
	 * @param	cors	( Optional ) An Object of {@link Api.CORS.Policy} defining custom policies for the API Response.
	 * @returns The NextResponse instance allowing chaining methods.
	 */
	static cors( request?: NextRequest, cors?: Api.CORS.Policy )
	{
		const requestOrigin = request?.headers.get( 'origin' ) || undefined

		this.CorsOptions = { ...cors, requestOrigin }

		return this
	}


	/**
	 * Get CORS ResponseInit.
	 *
	 * @param	init ( Optional ) The ResponseInit.
	 * @returns	ResponseInit with CORS Response Headers, the given ResponseInit if CORS is disabled.
	 */
	static CorsInit( init?: ResponseInit ): ResponseInit | undefined
	{
		if ( ! this.CorsOptions ) return init

		const headers = this.CorsHeaders( {
			options: this.CorsOptions,
			headers: init?.headers,
		} )

		// reset `CorsOptions` so next usage of `NextResponse` doesn't inherit unwanted options.
		this.CorsOptions = undefined

		return { ...init, headers }
	}


	/**
	 * Get CORS Response Headers.
	 * 
	 * @param param0 ( Optional ) An object with optional `options` and `headers`. @see {@link CorsHeadersOptions}.
	 * @returns	CORS Response Headers instance.
	 */
	static CorsHeaders(
		{ options = {}, headers }: CorsHeadersOptions = {}
	)
	{
		const wildCard = '*'

		const { ALLOWED_API_ORIGINS }	= process.env
		const { requestOrigin }			= options
		const allowedMethods			= ( options.methods || this.CorsAllowedMethods )
		let allowedOrigin				= options.origin || ALLOWED_API_ORIGINS || wildCard

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

		if ( typeof options.credentials !== 'undefined' ) {
			corsHeaders.set( 'Access-Control-Allow-Credentials', options.credentials.toString() )
		}

		const allowdHeaders = this.CorsAllowedHeaders.concat( options.headers || [] )
		const exposeHeaders = this.CorsExposedHeaders.concat( options.exposedHeaders || [] )

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