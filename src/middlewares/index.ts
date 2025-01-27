import type { NextMiddleware } from 'next/server'
import type { ChainFactory, ChainLink, LastChainLink } from '@alessiofrittoli/chain-functions/types'
import { NextResponse } from '@/response'


/**
 * Next.js Middleware chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 */
export type Middleware = ChainLink<NextMiddleware>


/**
 * Last Next.js Middleware chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 */
export type LastMiddleware = () => NextResponse<unknown>


/**
 * Next.js Middlewares chain passed to [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 */
export type MiddlewareFactory = ChainFactory<NextMiddleware, LastMiddleware>


/**
 * The last Next.js Middleware chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 * This simply calls `NextResponse.next()`.
 */
export const lastMiddleware: LastChainLink<LastMiddleware> = () => () => NextResponse.next()