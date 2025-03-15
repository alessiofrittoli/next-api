/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import type { ResolvingMetadata } from 'next'
import type { Page } from '@/types'
import { withAwaitedParams } from '@/page-wrappers'
import type { GenerateMetadata, PropsWithAwaitedParams,  } from '@/page-wrappers'


describe( 'withAwaitedParams', () => {

	it( 'renders the given component with awaited params and searchParams', async () => {

		const WrappedComponent = withAwaitedParams<{ id: string }, { query: string }>(
			( { params, searchParams } ) => (
				<div>
					<span>{ params.id }</span>
					<span>{ searchParams?.query }</span>
				</div>
			)
		)

		// ARRANGE
		const { getByText } = (
			render(
				await WrappedComponent( {
					params			: Promise.resolve( { id: '123' } ),
					searchParams	: Promise.resolve( { query: 'test' } )
				} )
			)
		)

		// ASSERT
		expect( getByText( '123' ) ).toBeInTheDocument()
		expect( getByText( 'test' ) ).toBeInTheDocument()

	} )


	it( 'calls `generateMetadata` with awaited `params`, `searchParams` and `parent` ResolvingMetadata', async () => {

		const generateMetadata: GenerateMetadata<PropsWithAwaitedParams<{ id: string }, { query: string }>> = (
			jest.fn( props => ( {
				title		: `Page - ${ props.params.id }`,
				description	: `Query - ${ props.searchParams?.query }`,
			} ) )
		)

		const wrappedGenerateMetadata = (
			withAwaitedParams<{ id: string }, { query: string }>( generateMetadata )
		)

		const props: Page.PropsWithSearchParams<{ id: string }, { query: string }> = {
			params			: Promise.resolve( { id: '123' } ),
			searchParams	: Promise.resolve( { query: 'test' } )
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
			alternates: {
				canonical: { url: 'http://localhost:3000' },
				languages: null,
				media: null,
				types: null,
			}
		}
		const parent: ResolvingMetadata = (
			Promise.resolve( resolvingMetadata )
		)

		await wrappedGenerateMetadata( props, parent )

		expect( generateMetadata ).toHaveBeenCalledWith(
			{
				params			: { id: '123' },
				searchParams	: { query: 'test' },
			},
			resolvingMetadata
		)
	} )

} )