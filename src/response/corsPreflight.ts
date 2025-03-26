import { NextResponse } from '@/response'
import type { Api } from '@/types'

/**
 * Return a proper Response for the `OPTIONS` preflight request.
 * 
 * @param	request The `NextRequest` object.
 * @param	ctx 	The API Route Request context.
 * @param	cors	( Optional ) Custom CORS policy options. See {@link Api.CORS.Policy} for available options. Default: `true`.
 * @returns A new `NextResponse` instance.
 * 
 * @example
 * 
 * #### Basic usage
 * 
 * ```ts
 * // src/app/api/v1/route.ts
 * import { corsPreflight } from '@alessiofrittoli/next-api/response'
 * 
 * export const OPTIONS = corsPreFlight
 * ```
 * 
 * ---
 * 
 * @example
 * 
 * #### Defining custom CORS Policy options
 * 
 * ```ts
 * // src/app/api/v1/route.ts
 * import { corsPreflight } from '@alessiofrittoli/next-api/response'
 * 
 * export const OPTIONS: Api.Route.Handler = ( request ) => corsPreflight( request, undefined, {
 * 	credentials	   : true,
 * 	exposedHeaders : [ 'X-Custom-Header' ],
 * 	headers        : [ 'X-CORS-Request-Allowed-Header' ],
 * 	methods        : [ 'GET' ],
 * 	origin         : 'https://allowed-origin.it',
 * } )
 * ```
 */
export const corsPreflight: Api.Route.CorsPreFlightHandler = (
	request, ctx, cors = true
) => (
	new NextResponse( { body: null, init: { status: 204 }, request, cors } )
)