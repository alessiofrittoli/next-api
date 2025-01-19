import { NextRequest } from 'next/server'
import { getRequestIp, OnRead, readFormDataBody, readJsonBody } from '@/request'


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


	it( 'allows subsequent reading', async () => {
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


describe( 'readFormDataBody', () => {

	type ExpectedFileNames = (
		| 'file-1.txt'
		| 'file-2.txt'
	)

	type ExpectedBody = {
		'field-1': string
		'field-2': 'true'
	} & {
		[ F in ExpectedFileNames ]: File
	}

	const body = new FormData()

	body.append( 'field-1', 'value 1' )
	body.append( 'field-2', 'true' )
	body.append( 'file-1.txt', new File( [ Buffer.from( 'file-1' ) ], 'file-1.txt', { type: 'text/plain' } ) )
	body.append( 'file-2.txt', new File( [ Buffer.from( 'file-2' ) ], 'file-2.txt', { type: 'text/plain' } ) )


	it( 'returns a FormData TypedMap', async () => {
		const response	= new Response( body )
		const fields	= await readFormDataBody<ExpectedBody>( response )

		expect( fields ).toBeInstanceOf( Map )
		expect( fields.get( 'field-1' ) ).toBe( 'value 1' )
		expect( fields.get( 'field-2' ) === 'true' ).toBe( true )
	} )


	it( 'allows subsequent reading', async () => {
		const response	= new Response( body )
		const result1	= await readFormDataBody<ExpectedBody>( response, true )
		expect( response.bodyUsed ).toBe( false )
		const result2	= await readFormDataBody<ExpectedBody>( response )
		expect( response.bodyUsed ).toBe( true )

		expect( result1 ).toBeInstanceOf( Map )
		expect( result1.get( 'field-1' ) ).toBe( 'value 1' )
		expect( result2 ).toBeInstanceOf( Map )
		expect( result2.get( 'field-1' ) ).toBe( 'value 1' )
	} )
	
	
	it( 'returns an array value when multiple fields with same name are provided', async () => {

		type ExpectedBody = {
			'field-1': string | string[]
		}
		const body = new FormData()
		body.append( 'field-1', 'value 1' )
		body.append( 'field-1', 'value 2' )

		const fields = await readFormDataBody<ExpectedBody>( new Response( body ) )

		expect( fields.get( 'field-1' ) ).toEqual( [ 'value 1', 'value 2' ] )
	} )


	it( 'handles received files correctly', async () => {
		const fields = await readFormDataBody<ExpectedBody>( new Response( body ) )
		expect( fields.get( 'file-1.txt' ) )
			.toBeInstanceOf( File )
		expect( fields.get( 'file-2.txt' ) )
			.toBeInstanceOf( File )

		expect( Buffer.from( await fields.get( 'file-1.txt' )!.arrayBuffer() ).toString() )
			.toBe( 'file-1' )
		expect( Buffer.from( await fields.get( 'file-2.txt' )!.arrayBuffer() ).toString() )
			.toBe( 'file-2' )		
	} )
	
	
	it( 'accepts an `onRead` callback that transform the received field', async () => {
		type ExpectedOutputBody = {
			'field-2': boolean
		} & Omit<ExpectedBody, 'field-2'>

		const onRead: OnRead<ExpectedBody, ExpectedOutputBody> = ( key, value ) => {
			if ( key === 'field-2' ) return value === 'true'
			return value
		}
		const fields = await readFormDataBody<ExpectedBody, ExpectedOutputBody>( new Response( body ), false, onRead )

		expect( fields.get( 'field-1' ) ).toBe( 'value 1' )
		expect( fields.get( 'field-2' ) ).toBe( true )
	} )


	it( 'throws an error when an empty body is provided', async () => {
		expect( () => readFormDataBody( new Response() ) )
			.rejects.toThrow( 'Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded"' )
	} )


	it( 'throws an error when body is locked', async () => {
		const response	= new Response( body )
		await readFormDataBody<ExpectedBody>( response )

		expect( () => readFormDataBody( response ) )
			.rejects.toThrow( 'Body is unusable: Body has already been read' )
	} )

} )