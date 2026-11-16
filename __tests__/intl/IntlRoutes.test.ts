import type { TypedMap } from '@alessiofrittoli/typed-map'
import { IntlRoutes, type Route } from '@/intl'
import { describe, expect, it } from 'vitest'

const defaultLocale = 'en'
const locales = [defaultLocale, 'it'] as const

type Locale = (typeof locales)[number]
type RouteName = 'home' | 'about'

const route = (enHref: string, itHref: string, itRewrite?: string): TypedMap<Route, false, Locale> =>
	IntlRoutes.FormatRoute([
		['en', { href: enHref }],
		['it', { href: itHref, ...(itRewrite ? { rewrite: itRewrite } : {}) }],
	])

describe('IntlRoutes', () => {
	const routes = (): IntlRoutes<RouteName, Locale> =>
		new IntlRoutes<RouteName, Locale>({
			locales,
			defaultLocale,
			routes: [
				['home', route('/', '/')],
				['about', route('/about', '/chi-siamo', '/about')],
			],
		})

	describe('get()', () => {
		it('returns a route definition by name', () => {
			const instance = routes()

			expect(instance.get('about').get('it')).toEqual({ href: '/chi-siamo', rewrite: '/about' })
		})
	})

	describe('getAll()', () => {
		it('returns all route definitions as a map', () => {
			const instance = routes()

			expect(instance.getAll()).toBeInstanceOf(Map)
			expect(Array.from(instance.getAll().keys())).toEqual(['home', 'about'])
		})
	})

	describe('set()', () => {
		it('adds or replaces a route definition and returns the map', () => {
			const instance = routes()
			const updatedRoute = route('/contact', '/contatti')

			expect(instance.set('about', updatedRoute)).toBe(instance.getAll())
			expect(instance.get('about')).toBe(updatedRoute)
		})
	})

	describe('getRouteByPathname()', () => {
		it('finds a route by its locale-prefixed pathname and uses the locale rewrite', () => {
			const instance = routes()

			expect(instance.getRouteByPathname('https://example.com/it/about', 'it')).toEqual([
				'about',
				instance.get('about'),
			])
		})

		it('finds a route from another locale when the requested locale has a different href', () => {
			const instance = routes()

			expect(instance.getRouteByPathname('/en/chi-siamo', 'en')).toEqual([
				'about',
				instance.get('about'),
			])
		})

		it('returns undefined when no route matches the pathname', () => {
			expect(routes().getRouteByPathname('/it/missing', 'it')).toBeUndefined()
		})
	})

	describe('FormatRoute()', () => {
		it('creates a map from the locale route entries', () => {
			const formatted = IntlRoutes.FormatRoute([
				['en', { href: '/about' }],
				['it', { href: '/chi-siamo' }],
			])

			expect(formatted).toBeInstanceOf(Map)
			expect(formatted.get('it')).toEqual({ href: '/chi-siamo' })
		})
	})
})
