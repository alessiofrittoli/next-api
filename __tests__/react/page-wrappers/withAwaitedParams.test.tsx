import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { withAwaitedParams } from '@/page-wrappers'
import type { ResolvingMetadata } from 'next'
import type { Page } from '@/types'

type Param = { id: string }
type SearchParam = { query: string }

describe('withAwaitedParams', () => {
	it('renders the given component with awaited params and no searchParams', async () => {
		const WrappedComponent = withAwaitedParams<Param, SearchParam>(({ params, searchParams }) => {
			expect(searchParams).toBeInstanceOf(Promise)
			return <span>{params.id}</span>
		})

		// ARRANGE
		render(
			await WrappedComponent({
				params: Promise.resolve({ id: '123' }),
				searchParams: Promise.resolve({ query: 'test' }),
			}),
		)

		// ASSERT
		expect(screen.getByText('123')).toBeInTheDocument()
	})

	it('renders the given component with awaited params and searchParams', async () => {
		const WrappedComponent = withAwaitedParams<Param, SearchParam, true>(
			({ params, searchParams }) => (
				<div>
					<span>{params.id}</span>
					<span>{searchParams?.query}</span>
				</div>
			),
			true,
		)

		// ARRANGE
		render(
			await WrappedComponent({
				params: Promise.resolve({ id: '123' }),
				searchParams: Promise.resolve({ query: 'test' }),
			}),
		)

		// ASSERT
		expect(screen.getByText('123')).toBeInTheDocument()
		expect(screen.getByText('test')).toBeInTheDocument()
	})

	it('calls `generateMetadata` with awaited `params`, `searchParams` and `parent` ResolvingMetadata', async () => {
		const generateMetadata: Page.GenerateMetadata<Page.AwaitedProps<Param, SearchParam, true>> = vi.fn(
			props => ({
				title: `Page - ${props.params.id}`,
				description: `Query - ${props.searchParams?.query}`,
			}),
		)

		const wrappedGenerateMetadata = withAwaitedParams<Param, SearchParam, true>(generateMetadata, true)

		const props: Page.Props<Param, SearchParam> = {
			params: Promise.resolve({ id: '123' }),
			searchParams: Promise.resolve({ query: 'test' }),
		}

		const resolvingMetadata: Awaited<ResolvingMetadata> = {
			abstract: null,
			appleWebApp: null,
			applicationName: null,
			appLinks: null,
			archives: null,
			assets: null,
			authors: null,
			bookmarks: null,
			category: null,
			classification: null,
			creator: null,
			description: null,
			facebook: null,
			formatDetection: null,
			generator: null,
			icons: null,
			itunes: null,
			keywords: null,
			manifest: null,
			metadataBase: null,
			openGraph: null,
			other: null,
			pagination: { previous: null, next: null },
			publisher: null,
			referrer: null,
			robots: null,
			title: null,
			twitter: null,
			verification: null,
			themeColor: null,
			colorScheme: null,
			viewport: null,
			pinterest: {},
			alternates: {
				canonical: { url: 'http://localhost:3000' },
				languages: null,
				media: null,
				types: null,
			},
		}
		const parent: ResolvingMetadata = Promise.resolve(resolvingMetadata)

		await wrappedGenerateMetadata(props, parent)

		expect(generateMetadata).toHaveBeenCalledWith(
			{
				params: { id: '123' },
				searchParams: { query: 'test' },
			},
			resolvingMetadata,
		)
	})
})
