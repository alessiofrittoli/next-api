import { getRequestIp } from '@/request'
import { NextResponse } from '@/response'
import type { Api } from '@/types/api'

let countTimeout: number | NodeJS.Timeout | null = null

const quotaMap	= new Map<string, number>()
type QuotaMap	= typeof quotaMap


/**
 * A handler function that is called when the rate limit quota is reached for a given IP address.
 *
 * @param requestIp - The IP address of the request that has reached the quota.
 * @param quotaMap - A map containing the quota information.
 * @returns A promise that resolves to void or void.
 */
export type OnQuotaReachedHandler = ( requestIp: string, quotaMap: QuotaMap ) => void | Promise<void>


/**
 * Middleware to apply rate limiting to an API route.
 *
 * @template T - The type of the request body.
 * 
 * @param	request - The incoming API request.
 * @param	next - The next handler to call if the request is within the rate limit.
 * @param	max - The maximum number of requests allowed within the specified time window.
 * @param	inS - The time window in seconds for rate limiting.
 * @param	cors - CORS policy to apply to the response.
 * @param	onQuotaReached - Optional callback to execute when the rate limit is reached.
 * @returns The response to be sent back to the client.
 */
export const withRateLimit = async <T = unknown>(
	request	: Api.Route.Request<T>,
	next	: Api.Route.Handler<T>,
	max?	: number,
	inS?	: number,
	cors?	: true | Api.CORS.Policy,
	onQuotaReached?: OnQuotaReachedHandler,
) => {

	if ( ! max || max === Infinity ) return next( request )

	const requestIp = await getRequestIp( request ) || '::1'

	if ( inS ) {
		if ( countTimeout ) clearTimeout( countTimeout )
		countTimeout = setTimeout( () => {
			quotaMap.delete( requestIp )
		}, inS * 1000 )
	}

	const quota = ( quotaMap.get( requestIp ) || 0 ) + 1
	quotaMap.set( requestIp, quota )

	if ( quota <= max ) {
		return next( request )
	}

	const responseInit: ResponseInit = {
		status	: 429,
		headers	: inS ? {
			'Retry-After'	: inS.toString(),
			'X-Max-Requests': max.toString(),
		} : undefined
	}

	const corsOptions: Api.CORS.Policy | undefined = cors ? {
		...( typeof cors === 'object' ? cors : undefined ),
		exposedHeaders: [ ...( typeof cors === 'object' ? ( cors.exposedHeaders || [] ) : [] ), 'X-Max-Requests' ]
	} : undefined
	
	if ( onQuotaReached ) {
		await onQuotaReached( requestIp, quotaMap )
	}

	return (
		new NextResponse( {
			body: null,
			init: responseInit,
			cors: corsOptions,
			request,
		} )
	)

}