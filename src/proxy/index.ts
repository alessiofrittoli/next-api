import type { ChainFactory, ChainLink, LastChainLink } from '@alessiofrittoli/chain-functions/types'
import type { NextProxy } from 'next/server'
import { NextResponse } from '@/response'

/**
 * Next.js Proxy chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 *
 */
export type Proxy = ChainLink<NextProxy>

/**
 * Last Next.js Proxy chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 *
 */
export type LastProxy = () => NextResponse<unknown>

/**
 * Next.js Proxy chain passed to [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 *
 */
export type ProxyFactory = ChainFactory<NextProxy, LastProxy>

/**
 * The last Next.js Middleware chained using [`Chain.functions()`](https://npmjs.com/package/@alessiofrittoli/chain-functions).
 * This simply calls `NextResponse.next()`.
 */
export const lastProxy: LastChainLink<LastProxy> = () => () => NextResponse.next()
