import { withImplictDefaultLocale, withIntlRoutes, withUserPreferredLocale } from '@/intl/proxy'
import { describe, expect, it, vi } from 'vitest'
import { IntlRoutes, type Route } from '@/intl'
import { NextRequest } from 'next/server'
import { NextResponse } from '@/response'

const locales = ['en', 'it'] as const
type Locale = (typeof locales)[number]

const routes = new IntlRoutes<'login', Locale>({
	locales,
	defaultLocale: 'en',
	routes: [
		[
			'login',
			IntlRoutes.FormatRoute<Route<Locale>>([
				['en', { href: '/login', rewrite: '/auth/login' }],
				['it', { href: '/autenticazione', rewrite: '/auth/login' }],
			]),
		],
	],
})

const next = vi.fn(() => NextResponse?.next())
const event = {} as never

describe('withUserPreferredLocale', () => {
	it('redirects to the preferred locale and saves it in a cookie', async () => {
		const request = new NextRequest('https://example.com/en/about', {
			headers: { 'Accept-Language': 'it-IT,it;q=0.9' },
		})
		const response = await withUserPreferredLocale({ locales, defaultLocale: 'en' })(next)(request, event)

		expect(response?.status).toBe(307)
		expect(response?.headers.get('location')).toBe('https://example.com/it/about')
		expect(response?.headers.get('set-cookie')).toContain('user-locale=')

		expect(next).toHaveBeenCalledWith(request, event)
	})

	it('uses the configured cookie name', async () => {
		const request = new NextRequest('https://example.com/it/about', {
			headers: { 'X-Locale': 'it' },
		})
		const response = await withUserPreferredLocale({
			locales,
			defaultLocale: 'en',
			cookieName: 'locale-pref',
		})(next)(request, event)

		expect(response?.headers.get('set-cookie')).toContain('locale-pref=')
	})
})

describe('withIntlRoutes', () => {
	it('rewrites a localized public route to its internal page path', async () => {
		const request = new NextRequest('https://example.com/it/autenticazione')
		const response = await withIntlRoutes({ locales, defaultLocale: 'en', routes })(next)(request, event)

		expect(response?.headers.get('x-middleware-rewrite')).toBe('https://example.com/it/auth/login')
		expect(next).not.toHaveBeenCalled()
	})

	it('redirects to the current locale href when a known route uses another locale path', async () => {
		const request = new NextRequest('https://example.com/it/login')
		const response = await withIntlRoutes({ locales, defaultLocale: 'en', routes })(next)(request, event)

		expect(response?.status).toBe(308)
		expect(response?.headers.get('location')).toBe('https://example.com/it/autenticazione')
		expect(next).toHaveBeenCalledWith(request, event)
	})

	it('passes through paths that are not in the route registry', async () => {
		const request = new NextRequest('https://example.com/it/not-found')
		const response = await withIntlRoutes({ locales, defaultLocale: 'en', routes })(next)(request, event)

		expect(response?.headers.get('x-middleware-rewrite')).toBeNull()
		expect(next).toHaveBeenCalledWith(request, event)
	})
})

describe('withImplictDefaultLocale', () => {
	it('rewrites an unprefixed path to the default locale internal path', async () => {
		const request = new NextRequest('https://example.com/about')
		const response = await withImplictDefaultLocale({ locales, defaultLocale: 'en' })(next)(
			request,
			event,
		)

		expect(response?.headers.get('x-middleware-rewrite')).toBe('https://example.com/en/about')
		expect(next).toHaveBeenCalledWith(request, event)
	})

	it('does not rewrite a non-default locale path', async () => {
		const request = new NextRequest('https://example.com/it/about')
		const response = await withImplictDefaultLocale({ locales, defaultLocale: 'en' })(next)(
			request,
			event,
		)

		expect(response?.headers.get('x-middleware-rewrite')).toBeNull()
		expect(response).toBeInstanceOf(NextResponse)
	})
})
