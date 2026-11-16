import { getTypedMap, type TypedMap } from '@alessiofrittoli/typed-map'
import { cache } from 'react'

/**
 * Create server context with `React.cache()`.
 *
 */
export const createServerContext = <T, P extends boolean = true>(initial?: TypedMap<T, P>): TypedMap<T, P> =>
	cache(() => initial || getTypedMap<T, P>())()
