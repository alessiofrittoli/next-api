import type { NextRequest } from 'next/server'


/**
 * Namespace containing types related to API.
 */
export namespace Api
{
	/** The HTTP Request method. */
	export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'


	/**
	 * Namespace containing types related to CORS.
	 */
	export namespace CORS
	{
		/**
		 * Represents the policy configuration for handling API requests.
		 */
		export interface Policy
		{
			/**
			 * The Request allowed origin.
			 * @remarks
			 * This specifies the allowed origin(s) for the request. It can be a string, an array of strings, or null.
			 */
			origin?: string | string[] | null;

			/**
			 * An array of allowed Request Methods.
			 * @remarks
			 * This specifies the HTTP methods that are allowed for the request, excluding 'OPTIONS'.
			 */
			methods?: Exclude<Api.RequestMethod, 'OPTIONS'>[];

			/**
			 * An array of allowed Request Headers.
			 * @remarks
			 * This specifies the headers that are allowed in the request.
			 */
			headers?: string[];

			/**
			 * An array of exposed Response Headers.
			 * @remarks
			 * This specifies the headers that can be exposed in the response.
			 */
			exposedHeaders?: string[];

			/**
			 * Whether to allow credentials or not.
			 * @remarks
			 * This specifies whether credentials (such as cookies or HTTP authentication) are allowed in the request.
			 */
			credentials?: boolean;
		}
	}


	/**
	 * Namespace containing types related to API routes.
	 */
	export namespace Route
	{
		/**
		 * Represents the context for an API request.
		 *
		 * @template T The type of the parameters.
		 */
		export interface Context<T = unknown>
		{
			params: Promise<T>
		}
		
		
		/**
		 * Represents the context for a catch-all route.
		 * 
		 * This type is used to define the context object that is passed to the route handler
		 * for routes that match a catch-all pattern. The context includes an array of strings
		 * that represent the fragments of the URL that were matched by the catch-all pattern.
		 * 
		 * @typeParam string[] - An array of strings representing the matched URL fragments.
		 */
		export type CatchAllContext = Api.Route.Context<string[]>


		/**
		 * Represents a Next.js API request with an optional generic type for extending the request object.
		 *
		 * @template T An optional type to extend the NextApiRequest object. Defaults to `unknown`.
		 */
		export type Request<T = unknown> = NextRequest & Partial<T>


		/**
		 * Represents the body of a request.
		 * 
		 */
		export interface RequestBody
		{
			/**
			 * The Google reCaptcha v3 token.
			 * reCaptcha is automatically verified in the API handler if the secret is defined in the ENV variables.
			 * The request will be then processed if the token is found in the request body, otherwise it will be rejected.
			 */
			gReCaptchaToken?: string
			/**
			 * User Requested locale.
			 */
			locale?: string
			
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			[ x: string ]: any
		}


		/** The JSON Response Type. */
		export interface ResponseBody<T = unknown>
		{
			message: T
		}


		/**
		 * Represents the return type of an API handler function.
		 * It can either be a `Response` object or a `Promise` that resolves to a `Response` object.
		 */
		export type Response = globalThis.Response | Promise<globalThis.Response>


		/**
		 * Represents a handler function for processing API requests.
		 *
		 * @template T The type of the request payload. Defaults to `unknown`.
		 * @param request The request object containing the payload of type `T`.
		 * @returns A `Response` object or a `Promise` that resolves to a `Response` object.
		 */
		export type Handler<T = unknown> = ( request: Api.Route.Request<T> ) => Api.Route.Response


		/**
		 * Represents a dynamic handler function for API routes.
		 *
		 * @template Body The type of the request body. Defaults to `unknown`.
		 * @template RouteParams The type of the route parameters. Defaults to `unknown`.
		 *
		 * @param request The incoming request object containing the body of type `Body`.
		 * @param ctx The context object containing route parameters of type `RouteParams`.
		 *
		 * @returns A `Response` object or a `Promise` that resolves to a `Response` object.
		 */
		export type DynamicHandler<
			Body = unknown,
			RouteParams = unknown,
		> = ( request: Api.Route.Request<Body>, ctx: Api.Route.Context<RouteParams> ) => Api.Route.Response
		
		
		/**
		 * Represents a dynamic handler function for catch-all API routes.
		 *
		 * @template Body The type of the request body. Defaults to `unknown`.
		 * 
		 * @param request The request object containing the body and other request details.
		 * @param ctx The context object for the catch-all route.
		 * @returns The response object for the route.
		 */
		export type CatchAllHandler<
			Body = unknown
		> = ( request: Api.Route.Request<Body>, ctx: Api.Route.CatchAllContext ) => Api.Route.Response
	}
}