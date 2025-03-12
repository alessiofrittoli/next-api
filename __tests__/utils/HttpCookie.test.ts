import type { NextRequest } from 'next/server'
import { HttpCookie, Priority, SameSite, type RawCookie } from '@/utils'

describe( 'HttpCookie', () => {

	beforeEach( () => {
		HttpCookie[ '_request' ] = undefined
		HttpCookie[ '_headers' ] = undefined
	} )


	it( 'exports `Priority` and `SameSite` from `@alessiofrittoli/web-utils`', () => {
		expect( Priority ).toBe( Priority )
		expect( SameSite ).toBe( SameSite )
	} )


	describe( 'HttpCookie.request()', () => {

		const request = {} as NextRequest

		it( 'allows to set Next.js request object', () => {
			HttpCookie.request( request )

			expect( HttpCookie[ '_request' ] ).toBe( request )
		} )


		it( 'returns `HttpCookie` reference for chaining purposes', () => {
			expect( HttpCookie.request( request ) ).toBe( HttpCookie )
		} )

	} )


	describe( 'HttpCookie.headers()', () => {

		const headers = new Headers()

		it( 'allows to set Response Headers', () => {
			HttpCookie.headers( headers )

			expect( HttpCookie[ '_headers' ] ).toBe( headers )
		} )


		it( 'returns `HttpCookie` reference for chaining purposes', () => {
			expect( HttpCookie.headers( headers ) ).toBe( HttpCookie )
		} )

	} )


	describe( 'HttpCookie.getHeaders()', () => {

		it( 'returns previously set Response Headers', () => {

			const headers = new Headers()

			expect( HttpCookie.headers( headers ).getHeaders() ).toBe( headers )

		} )


		it( 'returns a new instance of Headers if no Headers has been provided', () => {

			expect( HttpCookie.getHeaders() ).toBeInstanceOf( Headers )

		} )

	} )


	describe( 'HttpCookie.get()', () => {

		it( 'returns a Cookie Map object within the given Cookie name if any', () => {

			const request = {
				headers: new Headers( {
					'Cookie': HttpCookie.toString( {
						name	: 'somecookie',
						value	: true,
					} )
				} )
			} as NextRequest

			const cookie = HttpCookie
				.request( request )
				.get<boolean>( 'somecookie' )

			expect( cookie ).toBeInstanceOf( Map )
			expect( cookie?.get( 'value' ) ).toBe( true )

		} )


		it( 'returns `undefined` if no `request` has been given', () => {

			expect(
				HttpCookie.get<boolean>( 'somecookie' )
			).toBeUndefined()

		} )


		it( 'returns `undefined` if no `Cookie` header has been found in the Request Headers', () => {

			const request = {
				headers: new Headers()
			} as NextRequest

			expect(
				HttpCookie.request( request ).get<boolean>( 'somecookie' )
			).toBeUndefined()

		} )

	} )


	describe( 'HttpCookie.getAll()', () => {

		it( 'returns all cookies found in the Request Headers', () => {

			const request = {
				headers: new Headers()
			} as NextRequest

			request.headers.append( 'Cookie', HttpCookie.toString( {
				name	: 'somecookie',
				value	: true,
			} ) )

			request.headers.append( 'Cookie', HttpCookie.toString( {
				name	: 'somecookie_2',
				value	: false,
			} ) )

			const cookies = HttpCookie.request( request ).getAll()

			expect( cookies.size ).toBe( 2 )
			expect( cookies.has( 'somecookie' ) ).toBe( true )
			expect( cookies.has( 'somecookie_2' ) ).toBe( true )

		} )


		it( 'returns an empty Map object if no `request` has been provided', () => {

			expect( HttpCookie.getAll().size ).toBe( 0 )

		} )


		it( 'returns an empty Map object if no `Cookie` header has been found in the Request Headers', () => {

			const request = {
				headers: new Headers()
			} as NextRequest

			expect( HttpCookie.request( request ).getAll().size ).toBe( 0 )

		} )

	} )


	describe( 'HttpCookie.set()', () => {

		
		it( 'sets a cookie to Response Headers', () => {

			const cookie: RawCookie = {
				name	: 'somecookie',
				value	: true,
				path	: '/',
				httpOnly: true,
			}

			expect(
				HttpCookie
					.set( cookie )
					.getHeaders()
					.getSetCookie()
					.includes( HttpCookie.toString( cookie ) )
			).toBe( true )

		} )


		it( 'default sets Cookie `path` to `/`', () => {
			const cookie = HttpCookie.parse( {
				name	: 'somecookie',
				value	: true,
			} )
			
			const cookie2 = HttpCookie.parse( {
				name	: 'somecookie',
				value	: true,
				path	: '/api/v1/specific-path',
			} )

			HttpCookie.set( cookie ).set( cookie2 )
			
			expect( cookie.get( 'path' ) ).toBe( '/' )
			expect( cookie2.get( 'path' ) ).toBe( '/api/v1/specific-path' )
		} )


		it( 'default sets Cookie `httpOnly` to `true`', () => {
			const cookie = HttpCookie.parse( {
				name	: 'somecookie',
				value	: true,
			} )
			const cookie2 = HttpCookie.parse( {
				name	: 'somecookie',
				value	: true,
				httpOnly: false,
			} )

			HttpCookie.set( cookie ).set( cookie2 )
			
			expect( cookie.get( 'httpOnly' ) ).toBe( true )
			expect( cookie2.get( 'httpOnly' ) ).toBe( false )

		} )

	} )


	describe( 'HttpCookie.delete()', () => {

		it( 'sets `maxAge` to `0` for the given cookie to Response Headers', () => {

			const cookie = HttpCookie.parse( {
				name	: 'cookiename',
				value	: true,
				maxAge	: 120,
				path	: '/',
				httpOnly: true,
			} )

			expect(
				HttpCookie.delete( cookie )
					.getHeaders().getSetCookie()
					.includes( HttpCookie.toString( cookie.set( 'maxAge', 0 ) ) )
			)
			
		} )

	} )


	describe( 'HttpCookie.toString()', () => {} )


	describe( 'HttpCookie.fromString()', () => {} )


	describe( 'HttpCookie.fromListString()', () => {} )

} )