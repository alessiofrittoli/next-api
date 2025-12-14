import type { NextProxy } from 'next/server'
import type { ChainFactory, ChainLink, LastChainLink } from '@alessiofrittoli/chain-functions/types'
import { NextResponse } from '@/response'


/**
 * Next.js Middleware chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 * 
 * @deprecated use {@link Proxy} instead. Middleware has been renamed to Proxy.
 */
export type Middleware = ChainLink<NextProxy>

/**
 * Next.js Middleware chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 */
export type Proxy = Middleware


/**
 * Last Next.js Middleware chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 * 
 * @deprecated use {@link LastProxy} instead. Middleware has been renamed to Proxy.
 */
export type LastMiddleware = () => NextResponse<unknown>


/**
 * Last Next.js Middleware chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 */
export type LastProxy = LastMiddleware


/**
 * Next.js Middlewares chain passed to [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 * 
 * @deprecated use {@link ProxyFactory} instead. Middleware has been renamed to Proxy.
 */
export type MiddlewareFactory = ChainFactory<NextProxy, LastMiddleware>


/**
 * Next.js Middlewares chain passed to [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 * 
 * @deprecated use {@link ProxyFactory} instead. Middleware has been renamed to Proxy.
 */
export type ProxyFactory = MiddlewareFactory


/**
 * The last Next.js Middleware chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 * This simply calls `NextResponse.next()`.
 * 
 * @deprecated use {@link lastProxy} instead. Middleware has been renamed to Proxy.
 */
export const lastMiddleware: LastChainLink<LastMiddleware> = () => () => NextResponse.next()


/**
 * The last Next.js Middleware chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 * This simply calls `NextResponse.next()`.
 */
export const lastProxy = lastMiddleware