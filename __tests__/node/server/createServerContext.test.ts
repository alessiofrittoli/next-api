import { createServerContext } from '@/server'
import { getTypedMap } from '@alessiofrittoli/typed-map'
import { describe, expect, it } from 'vitest'

describe('createServerContext()', () => {
	it('returns the supplied initial context map', () => {
		const initial = getTypedMap<{ locale: string }, false>([['locale', 'en']])

		expect(createServerContext(initial)).toBe(initial)
		expect(createServerContext(initial).get('locale')).toBe('en')
	})

	it('creates an empty map when no initial context is provided', () => {
		const context = createServerContext<{ locale: string }, false>()

		expect(context).toBeInstanceOf(Map)
		expect(context.size).toBe(0)
	})

	it('returns a default readonly-typed map when no type arguments are provided', () => {
		const context = createServerContext()

		expect(context).toBeInstanceOf(Map)
		expect(context.size).toBe(0)
	})
})
