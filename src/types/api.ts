namespace Api
{
	/** The HTTP Request method. */
	export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'

	/** The Response CORS Policy options. */
	export interface CORSPolicy
	{
		/** The Request origin. */
		requestOrigin?: string | null
		/** The Request allowed origin. */
		origin?: string | string[] | null
		/** An array of allowed Request Methods. */
		methods?: Exclude<Api.RequestMethod, 'OPTIONS'>[]
		/** An array of allowed Request Headers. */
		headers?: string[]
		/** An array of exposed Response Headers. */
		exposedHeaders?: string[]
		/** Whether allow credentials or not. */
		credentials?: boolean
	}

	
	/** The JSON Response Type. */
	export interface Response<T = unknown>
	{
		message	: T
		ms?		: number
	}
}

export default Api