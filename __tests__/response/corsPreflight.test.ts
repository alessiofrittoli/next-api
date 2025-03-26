import { NextRequest } from 'next/server'
import { NextResponse, corsPreflight } from '@/response'
import type { Api } from '@/types'


describe( 'corsPreflight', () => {

	it( 'returns a NextResponse with status 204 and default CORS Policy options', async () => {
		
		const origin = 'http://localhost:3000'
		const headers = new Headers( {
			'Origin': origin
		} )
		const request	= new NextRequest( origin, { headers } )
		const response	= await corsPreflight( request )
		const { headers: responseHeaders } = response

		const allowedOrigin		= responseHeaders.get( 'Access-Control-Allow-Origin' )
		const allowedMethods	= responseHeaders.get( 'Access-Control-Allow-Methods' )
		const allowedHeaders	= responseHeaders.get( 'Access-Control-Allow-Headers' )
		const exposeHeaders		= responseHeaders.get( 'Access-Control-Expose-Headers' )

		
		expect( response ).toBeInstanceOf( NextResponse )
		expect( response.status ).toBe( 204 )
		expect( response.body ).toBeNull()
		// check default CORS options
		expect( allowedOrigin ).toBe( origin )
		expect( allowedMethods ).toBe( NextResponse.CorsAllowedMethods.join( ', ' ) )
		expect( allowedHeaders ).toBe( NextResponse.CorsAllowedHeaders.join( ', ' ) )
		expect( exposeHeaders ).toBe( NextResponse.CorsExposedHeaders.join( ', ' ) )
	} )


	it( 'returns a NextResponse with custom CORS Policy options', async () => {

		const origin = 'http://localhost:3000'
		const headers = new Headers( {
			'Origin': origin
		} )

		const policy: Api.CORS.Policy = {
			credentials	   : true,
			exposedHeaders : [ 'X-Custom-Header' ],
			headers        : [ 'X-CORS-Request-Allowed-Header' ],
			methods        : [ 'GET' ],
			origin         : 'https://allowed-origin.it',
		}

		const request	= new NextRequest( origin, { headers } )
		const response	= await corsPreflight( request, undefined, policy )

		const { headers: responseHeaders } = response

		const allowedOrigin		= responseHeaders.get( 'Access-Control-Allow-Origin' )
		const allowCredentials	= responseHeaders.get( 'Access-Control-Allow-Credentials' )
		const allowedMethods	= responseHeaders.get( 'Access-Control-Allow-Methods' )
		const allowedHeaders	= responseHeaders.get( 'Access-Control-Allow-Headers' )
		const exposeHeaders		= responseHeaders.get( 'Access-Control-Expose-Headers' )
		

		expect( response ).toBeInstanceOf( NextResponse )
		expect( response.status ).toBe( 204 )
		expect( response.body ).toBeNull()

		expect( allowedOrigin ).toBe( policy.origin )
		expect( allowCredentials ).toBe( policy.credentials?.toString() )
		expect( allowedMethods ).toBe( policy.methods?.toString() )
		if ( policy.headers ) {
			expect( allowedHeaders ).toContain( policy.headers.join( ', ' ) )
		}
		if ( policy.exposedHeaders ) {
			expect( exposeHeaders ).toContain( policy.exposedHeaders.join( ', ' ) )
		}

	} )

} )