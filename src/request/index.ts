import type { NextRequest } from 'next/server'

export * from './read'


/**
 * Get request IP address.
 *
 * @param	request The NextRequest Instance.
 * @returns	The Request IP address.
 */
export const getRequestIp = async ( request?: NextRequest ) => {

	const headers		= request?.headers || await ( await import( 'next/headers' ) ).headers()
	const forwarded		= headers.get( 'X-Forwarded-For' )?.replace( /\s/g, '' ).split( ',' ).at( -1 )
	const realIp		= headers.get( 'X-Real-Ip' )?.replace( /\s/g, '' ).split( ',' ).at( -1 )

	return forwarded || realIp || null

}