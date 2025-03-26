import { NextRequest } from 'next/server'
import { Exception } from '@alessiofrittoli/exception'
import { StreamReader } from '@alessiofrittoli/stream-reader'

import { ErrorCode } from '@/error'
import { NextResponse } from '@/response'
import type { Api } from '@/types'


describe( 'NextResponse', () => {

	const origin = 'http://localhost:3000'
	const headers = new Headers( {
		'Origin': origin
	} )
	const request = new NextRequest( origin, { headers } )

	it( 'returns a new instance of Response', () => {
		expect( new NextResponse() ).toBeInstanceOf( Response )
	} )


	describe( 'JSON', () => {
		describe( 'NextResponse.json()', () => {
			it( 'returns a JSON Response', async () => {
				type Body = Api.Route.ResponseBody<{ someData: string }>
				const responseBody: Body = { message: { someData: 'Ok' } }

				const response		= NextResponse.json<Body>( responseBody )
				const { headers }	= response
				const body			= await response.json<Body>()

				expect( headers.get( 'Content-Type' ) ).toBe( 'application/json' )
				expect( body ).toEqual( responseBody )
			} )
		} )


		describe( 'NextResponse.successJson()', () => {
			it( 'automatically set body data to `message` property', async () => {
				type Body = { someData: string }
				const responseBody: Body = { someData: 'Ok' }

				const response		= NextResponse.successJson<Body>( responseBody )
				const { headers }	= response
				const body			= await response.json<Api.Route.ResponseBody<Body>>()

				expect( headers.get( 'Content-Type' ) ).toBe( 'application/json' )
				expect( body.message ).toEqual( responseBody )
			} )
		} )


		describe( 'NextResponse.errorJson()', () => {
			it( 'returns a JSON Error Response', async () => {
				const exception	= new Exception( 'An error occured.', { code: ErrorCode.Exception.UNKNOWN } )
				const response	= NextResponse.errorJson( exception )
				const body		= await response.json<Exception<string, ErrorCode>>()				

				expect( Exception.isException( body ) ).toBe( true )
				expect( body.code ).toBe( ErrorCode.Exception.UNKNOWN )

				expect( response.status ).toBe( 500 )
				expect( body.status ).toBe( response.status )
				expect( body.message ).toBe( 'An error occured.' )
			} )
		} )


		describe( 'NextResponse.emptyBody()', () => {
			it( 'returns a JSON Error Response with default Error code and Response stauts', async () => {
				const response	= NextResponse.emptyBody()
				const body		= await response.json<Exception<string, ErrorCode>>()

				expect( Exception.isException( body ) ).toBe( true )
				expect( body.code ).toBe( ErrorCode.Exception.EMPTY_VALUE )

				expect( response.status ).toBe( 422 )
			} )
		} )
	} )


	describe( 'Stream', () => {
	
		describe( 'NextResponse.stream()', () => {

			const words = [ 'some', 'input', 'data', 'streamed', 'word by', 'word' ]
			
			it( 'supports ReadableStream as input', async () => {
				const streamData = async ( writer: WritableStreamDefaultWriter<Uint8Array>, encoder: TextEncoder ) => {
					for ( const word of words ) {
						await writer.write( encoder.encode( word ) )
					}
					await writer.close()
				}

				const stream	= new TransformStream<Uint8Array, Uint8Array>()
				const decoder	= new TextDecoder()
				const encoder	= new TextEncoder()
				const writer	= stream.writable.getWriter()
				const response	= NextResponse.stream( stream.readable )

				streamData( writer, encoder )

				expect( response.body ).not.toBeUndefined()

				const reader = new StreamReader<Uint8Array, string>( response.body!, {
					transform( chunk ) {
						return decoder.decode( chunk )
					}
				} )
				const chunks = await reader.read()
				expect( chunks ).toEqual( words )
			} )


			it( 'supports Generator or AsyncGenerator as input', async () => {
				async function* makeIterator( encoder: TextEncoder )
				{
					for ( const word of words ) {
						yield encoder.encode( word )
					}
				}
		
				const decoder	= new TextDecoder()
				const encoder	= new TextEncoder()
				const iterator	= makeIterator( encoder )
				const response	= NextResponse.stream( iterator )

				expect( response.body ).not.toBeUndefined()

				const reader = new StreamReader<Uint8Array, string>( response.body!, {
					transform( chunk ) {
						return decoder.decode( chunk )
					}
				} )
				const chunks = await reader.read()
				expect( chunks ).toEqual( words )
			} )

		} )
	} )


	describe( 'CORS', () => {

		const corsPolicy: Api.CORS.Policy = {
			origin			: 'https://front-end-allowed-to-consume-api.com',
			credentials		: true,
			methods			: [ 'GET' ],
			exposedHeaders	: [ 'X-Exposed-Custom-Header' ],
			headers			: [ 'X-Custom-Allowed-Header' ],
		}

		it( 'sets default CORS options when `cors` is set to `true`', () => {
			const { headers }		= new NextResponse( { cors: true } )
			const allowedOrigin		= headers.get( 'Access-Control-Allow-Origin' )
			const allowedMethods	= headers.get( 'Access-Control-Allow-Methods' )
			const allowedHeaders	= headers.get( 'Access-Control-Allow-Headers' )
			const exposeHeaders		= headers.get( 'Access-Control-Expose-Headers' )

			expect( allowedOrigin ).toBe( '*' )
			expect( allowedMethods ).toBe( NextResponse.CorsAllowedMethods.join( ', ' ) )
			expect( allowedHeaders ).toBe( NextResponse.CorsAllowedHeaders.join( ', ' ) )
			expect( exposeHeaders ).toBe( NextResponse.CorsExposedHeaders.join( ', ' ) )
		} )


		it( 'correctly sets custom CORS policy', () => {
			const { headers }		= new NextResponse( { cors: corsPolicy, request } )
			const allowedOrigin		= headers.get( 'Access-Control-Allow-Origin' )
			const allowedMethods	= headers.get( 'Access-Control-Allow-Methods' )
			const allowedHeaders	= headers.get( 'Access-Control-Allow-Headers' )
			const exposeHeaders		= headers.get( 'Access-Control-Expose-Headers' )

			expect( allowedOrigin ).toBe( 'https://front-end-allowed-to-consume-api.com' )
			expect( allowedMethods ).toBe( corsPolicy.methods?.join( ', ' ) )
			expect( allowedHeaders?.split( ', ' ) ).toContain( 'X-Custom-Allowed-Header' )
			expect( exposeHeaders?.split( ', ' ) ).toContain( 'X-Exposed-Custom-Header' )
		} )


		it(
			'set allowed origin to request origin if credentials is set to true and no allowed origin as been specified or `*` has been given',
			() => {
				const { headers } = new NextResponse( { cors: {
					credentials: true,
				}, request } )

				const allowedOrigin = headers.get( 'Access-Control-Allow-Origin' )
				expect( allowedOrigin ).toBe( origin )
				
				const { headers: headers2 } = new NextResponse( { cors: {
					credentials	: true,
					origin		: '*',
				}, request } )

				const allowedOrigin2 = headers2.get( 'Access-Control-Allow-Origin' )
				expect( allowedOrigin2 ).toBe( origin )
			}
		)


		describe( 'NextResponse.cors()', () => {

			it( 'allows chaining', () => {
				expect( NextResponse.cors() ).toBe( NextResponse )
			} )


			it( 'sets default CORS options', () => {
				const { headers } = (
					NextResponse.cors().json( null )
				)

				const allowedOrigin		= headers.get( 'Access-Control-Allow-Origin' )
				const allowedMethods	= headers.get( 'Access-Control-Allow-Methods' )
				const allowedHeaders	= headers.get( 'Access-Control-Allow-Headers' )
				const exposeHeaders		= headers.get( 'Access-Control-Expose-Headers' )
	
				expect( allowedOrigin ).toBe( '*' )
				expect( allowedMethods ).toBe( NextResponse.CorsAllowedMethods.join( ', ' ) )
				expect( allowedHeaders ).toBe( NextResponse.CorsAllowedHeaders.join( ', ' ) )
				expect( exposeHeaders ).toBe( NextResponse.CorsExposedHeaders.join( ', ' ) )
			} )


			it( 'correctly sets custom CORS policy', () => {
				const { headers } = (
					NextResponse.cors( request, corsPolicy ).json( null )
				)

				const allowedOrigin		= headers.get( 'Access-Control-Allow-Origin' )
				const allowedMethods	= headers.get( 'Access-Control-Allow-Methods' )
				const allowedHeaders	= headers.get( 'Access-Control-Allow-Headers' )
				const exposeHeaders		= headers.get( 'Access-Control-Expose-Headers' )
	
				expect( allowedOrigin ).toBe( 'https://front-end-allowed-to-consume-api.com' )
				expect( allowedMethods ).toBe( corsPolicy.methods?.join( ', ' ) )
				expect( allowedHeaders?.split( ', ' ) ).toContain( 'X-Custom-Allowed-Header' )
				expect( exposeHeaders?.split( ', ' ) ).toContain( 'X-Exposed-Custom-Header' )
			} )

		} )
		
		
		describe( 'NextResponse.CorsHeaders()', () => {

			it( 'fallback to an empty object if no argument is passed and returns default Response Headers', () => {

				const headers = NextResponse.CorsHeaders()

				expect( headers.get( 'Access-Control-Allow-Origin' ) ).toBe( '*' )
				expect( headers.get( 'Access-Control-Allow-Headers' ) ).toBe( NextResponse.CorsAllowedHeaders.join( ', ' ) )
				expect( headers.get( 'Access-Control-Expose-Headers' ) ).toBe( NextResponse.CorsExposedHeaders.join( ', ' ) )
				expect( headers.get( 'Access-Control-Allow-Methods' ) ).toBe( NextResponse.CorsAllowedMethods.join( ', ' ) )

			} )

		} )

	} )

} )