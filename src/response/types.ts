import type { NextRequest } from 'next/server'
import type { StreamGenerator } from '@alessiofrittoli/stream-reader/types'
import type { Api } from '@/types/api'

/**
 * Interface representing the options for the NextResponse constructor.
 * 
 */
export interface NextResponseProps
{
	/** The Response BodyInit. */
	body?: BodyInit | null
	/** ResponseInit */
	init?: ResponseInit
	/** The NextRequest instance. This is used internally to retrieve Request Headers. */
	request?: NextRequest
	/** An Object of {@link Api.CORS.Policy} defining custom policies for the API Response. If `true` CORS is enabled with the default configuration. */
	cors?: Api.CORS.Policy | true
}


/**
 * Options for configuring CORS headers in an API response.
 */
export interface CorsHeadersOptions
{
	/** An object of {@link Api.CORS.Policy} defining custom policies for the API Response. */
	options?: Api.CORS.Policy
	/** Custom Response Headers. */
	headers?: Headers | HeadersInit
}


/**
 * Represents an iterator for a Next.js response stream.
 *
 * @template T - The type of data being streamed. Defaults to `unknown`.
 *
 * This type can be either a `ReadableStream` of type `T` or a `StreamGenerator` of type `T`.
 */
export type NextResponseStreamIterator<T = unknown> = (
	| ReadableStream<T> | StreamGenerator<T>
)