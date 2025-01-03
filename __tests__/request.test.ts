import { NextRequest } from 'next/server'
import { getRequestIp, readJsonBody } from '@/request'


describe( 'getRequestIp', () => {

	it( 'returns the IP address from `X-Forwarded-For` Header', async () => {
		const request = {
			headers: new Headers( [ [ 'X-Forwarded-For', '192.168.1.1' ] ] ),
		} as NextRequest

		expect( await getRequestIp( request ) )
			.toBe( '192.168.1.1' )
	} )


	it( 'returns the IP address from `X-Real-Ip` Header if `X-Forwarded-For` is not present', async () => {
		const request = {
			headers: new Headers( [ [ 'X-Real-Ip', '192.168.1.2' ] ] ),
		} as NextRequest

		expect( await getRequestIp( request ) )
			.toBe( '192.168.1.2' )
	} )


	it( 'returns `null` if no IP address has been found', async () => {
		const request = {
			headers: new Headers(),
		} as NextRequest

		expect( await getRequestIp( request ) )
			.toBeNull()
	} )


	it( 'handles Headers with multiple IP addresses correctly', async () => {
		const request = {
			headers: new Headers( [ [ 'X-Forwarded-For', '192.168.1.1, 192.168.1.3' ] ] ),
		} as NextRequest

		expect( await getRequestIp( request ) )
			.toBe( '192.168.1.3' )
	} )


	it( 'retrieves Request Headers with `headers()` from \'next/headers\' if no Request object has been provided', async () => {
		jest.mock( 'next/headers', () => ( {
			headers: (
				jest.fn()
					.mockResolvedValue( new Headers( [ [ 'X-Forwarded-For', '192.168.1.1' ] ] ) )
			)
		} ) )

		expect( await getRequestIp() )
			.toBe( '192.168.1.1' )
		
		jest.resetAllMocks().resetModules()
	} )
} )


describe( 'readJsonBody', () => {

	type ExpectedBody = { data: string }
	const requestBody: ExpectedBody = { data: 'message' }

	it( 'returns parsed JSON', async () => {
		const response = new Response( JSON.stringify( requestBody ) )
		expect( readJsonBody( response ) )
			.resolves.toEqual( requestBody )
	} )


	it( 'allows multiple reading', async () => {
		const response	= new Response( JSON.stringify( requestBody ) )
		const result1	= await readJsonBody( response, true )
		expect( response.bodyUsed ).toBe( false )
		const result2	= await readJsonBody( response )
		expect( response.bodyUsed ).toBe( true )

		expect( result1 ).toEqual( requestBody )
		expect( result2 ).toEqual( requestBody )
	} )


	it( 'returns `null` when body is empty', async () => {
		expect( readJsonBody( new Response() ) )
			.resolves.toBeNull()
	} )


	it( 'returns `null` when body is locked', async () => {
		const response = new Response( JSON.stringify( requestBody ) )
		await readJsonBody( response )

		expect( response.bodyUsed ).toBe( true )
		expect( readJsonBody( response ) )
			.resolves.toBeNull()
	} )

} )