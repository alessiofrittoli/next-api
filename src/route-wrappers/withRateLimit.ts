import { NextResponse } from '@/response'
import { getRequestIp } from '@/request'
import type { Api } from '@/types'

let timeout: number | NodeJS.Timeout | null = null

const list = new Map<string, number>()
type List = typeof list

/**
 * A handler function that is called when the rate limit quota is reached for a given IP address.
 *
 * @param requestIp The IP address of the request that has reached the quota.
 * @param list A map containing the quota information for each IP address.
 */
export type OnQuotaReachedHandler = (requestIp: string, list: List) => void | Promise<void>

export interface WithRateLimitOptions {
	/**
	 * The maximum number of requests allowed within the specified time window.
	 *
	 */
	max?: number
	/**
	 * The time window in seconds for rate limiting.
	 *
	 */
	inS?: number
	/**
	 * CORS policy to apply to the response.
	 *
	 */
	cors?: true | Api.CORS.Policy
	/**
	 * Optional callback to execute when the rate limit is reached.
	 *
	 * @param requestIp The IP address of the request that has reached the quota.
	 * @param list A map containing the quota information for each IP address.
	 */
	onQuotaReached?: OnQuotaReachedHandler
}

/**
 * Apply rate limiting to API requests.
 *
 * @template T The type of the request body.
 *
 * @param request The incoming API request.
 * @param next The next handler to call if the request is within the rate limit.
 * @param options (Optional) An object defining customization options. See {@link WithRateLimitOptions} for more info.
 *
 * @returns The response to be sent back to the client.
 */
export const withRateLimit = async <T = unknown>(
	request: Api.Route.Request<T>,
	next: Api.Route.Handler<T>,
	options: WithRateLimitOptions = {},
): Promise<NextResponse | ReturnType<Api.Route.Handler<T>>> => {
	const { max, inS, cors, onQuotaReached } = options

	if (!max || max === Infinity) {
		return next(request)
	}

	const requestIp = (await getRequestIp(request)) || '::1'

	if (inS) {
		if (timeout) {
			clearTimeout(timeout)
			timeout = null
		}
		timeout = setTimeout(() => {
			list.delete(requestIp)
		}, inS * 1000)
	}

	const quota = (list.get(requestIp) || 0) + 1

	list.set(requestIp, quota)

	if (quota <= max) {
		return next(request)
	}

	const responseInit: ResponseInit = {
		status: 429,
		headers: inS
			? {
					'Retry-After': inS.toString(),
					'X-Max-Requests': max.toString(),
				}
			: undefined,
	}

	const corsOptions: Api.CORS.Policy | undefined = cors
		? {
				...(typeof cors === 'object' ? cors : undefined),
				exposedHeaders: [
					...(typeof cors === 'object' ? cors.exposedHeaders || [] : []),
					'X-Max-Requests',
				],
			}
		: undefined

	if (onQuotaReached) {
		await onQuotaReached(requestIp, list)
	}

	return new NextResponse({
		body: null,
		init: responseInit,
		cors: corsOptions,
		request,
	})
}
