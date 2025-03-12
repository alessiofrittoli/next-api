import { withRateLimit, type OnQuotaReachedHandler } from '@/route-wrappers/withRateLimit'
import { NextResponse } from '@/response'
import type { Api } from '@/types'


describe( 'withRateLimit', () => {
	let request: Api.Route.Request<unknown>
	let next: jest.Mock
	let onQuotaReached: jest.MockedFunction<OnQuotaReachedHandler>

	const headers = new Headers( {
		'Origin': 'http://localhost:3000',
	} )

	beforeEach( () => {
		request = { headers } as Api.Route.Request<unknown>

		next = jest.fn( () => new Response( null, { status: 200 } ) )
		onQuotaReached = jest.fn()

		jest.useFakeTimers()
		jest.runAllTimers()
		jest.runAllTicks()

		jest.spyOn( global, 'setTimeout' )
		jest.spyOn( global, 'clearTimeout' )
	} )

	afterEach( () => (
		jest.useRealTimers()
			.resetAllMocks()
			.resetModules()
	) )


	it( 'calls `next` if `max` is not provided or is Infinity', async () => {
		await withRateLimit( request, next )
		expect( next ).toHaveBeenCalledWith( request )

		await withRateLimit( request, next, Infinity )
		expect( next ).toHaveBeenCalledWith( request )
	} )


	it( 'calls `next` if the request is within the rate limit', async () => {
		await withRateLimit( request, next, 5, 60 )
		await withRateLimit( request, next, 5, 60 )
		expect( next ).toHaveBeenCalledWith( request )
		expect( setTimeout ).toHaveBeenCalledTimes( 2 )
		expect( setTimeout ).toHaveBeenLastCalledWith( expect.any( Function ), 60 * 1000 )
	} )


	it( 'clears timeouts correctly', async () => {

		await withRateLimit( request, next, 1, 60 )
		await withRateLimit( request, next, 1, 60 ) // blacklisted
		jest.advanceTimersByTime( 30 * 1000 )
		await withRateLimit( request, next, 1, 60 ) // still blacklisted
		
		jest.advanceTimersByTime( 61 * 1000 )
		const response = await withRateLimit( request, next, 1, 60 )

		expect( response.status ).toBe( 200 )
		expect( setTimeout ).toHaveBeenCalledTimes( 4 )
		expect( clearTimeout ).toHaveBeenCalledTimes( 4 )
	} )


	it( 'returns a `429` response if the request exceeds the rate limit', async () => {
		for ( let i = 0; i < 5; i++ ) {
			await withRateLimit( request, next, 5, 60 )
		}

		const response = await withRateLimit( request, next, 5, 60 )

		expect( response ).toBeInstanceOf( NextResponse )
		expect( response.status ).toBe( 429 )
		expect( response.headers.get( 'Retry-After' ) ).toBe( '60' )
		expect( response.headers.get( 'X-Max-Requests' ) ).toBe( '5' )
	} )


	it( 'calls `onQuotaReached` if the request exceeds the rate limit', async () => {
		for ( let i = 0; i < 5; i++ ) {
			await withRateLimit( request, next, 5, 60, undefined, onQuotaReached )
		}

		await withRateLimit( request, next, 5, 60, undefined, onQuotaReached )
		expect( onQuotaReached ).toHaveBeenCalledWith( '::1', expect.any( Map ) )
	} )


	it( 'enables CORS if `true` has been provided', async () => {

		const response = await withRateLimit( request, next, 5, 60, true )
		expect( response ).toBeInstanceOf( NextResponse )
		
		const exposedHeaders = response.headers.get( 'Access-Control-Expose-Headers' )?.split( ', ' )

		expect( exposedHeaders ).toContain( 'Retry-After' )
		expect( exposedHeaders ).toContain( 'X-Max-Requests' )
	} )


	it( 'enables CORS if CORS policy object has been provided', async () => {
		const corsPolicy: Api.CORS.Policy = {
			exposedHeaders: [ 'X-Custom-Header' ],
		}

		const response = await withRateLimit( request, next, 5, 60, corsPolicy )
		expect( response ).toBeInstanceOf( NextResponse )
		
		const exposedHeaders = response.headers.get( 'Access-Control-Expose-Headers' )?.split( ', ' )
		
		expect( exposedHeaders ).toContain( 'X-Custom-Header' )
		expect( exposedHeaders ).toContain( 'Retry-After' )
		expect( exposedHeaders ).toContain( 'X-Max-Requests' )
	} )


	it( 'doesn\'t set `Retry-After` and `X-Max-Requests` if `inS` is falsey', async () => {
		const response = await withRateLimit( request, next, 5, 0 )
		const response2 = await withRateLimit( request, next, 5 )

		expect( response ).toBeInstanceOf( NextResponse )
		expect( response2 ).toBeInstanceOf( NextResponse )
		
		expect( response.headers.has( 'Retry-After' ) ).not.toBe( true )
		expect( response.headers.has( 'X-Max-Requests' ) ).not.toBe( true )
		expect( response2.headers.has( 'Retry-After' ) ).not.toBe( true )
		expect( response2.headers.has( 'X-Max-Requests' ) ).not.toBe( true )
	} )
	
	
	it( 'fallback to empty Array if `cors.exposedHeaders` is not defined', async () => {
		const response = await withRateLimit( request, next, 5, 10, {} )
		const exposedHeaders = response.headers.get( 'Access-Control-Expose-Headers' )?.split( ', ' )
		expect( exposedHeaders ).toEqual( [
			...NextResponse.CorsExposedHeaders, 'X-Max-Requests'
		] )
	} )
} )