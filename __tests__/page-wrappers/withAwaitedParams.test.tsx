/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import type { ResolvingMetadata } from 'next'
import type { Page } from '@/types'
import { withAwaitedParams } from '@/page-wrappers'

type Param			= { id: string }
type SearchParam	= { query: string }

/**
 * @docs https://testing-library.com/docs/react-testing-library/intro
 */
describe( 'withAwaitedParams', () => {

	it( 'renders the given component with awaited params and no searchParams', async () => {

		const WrappedComponent = withAwaitedParams<Param, SearchParam>(
			( { params, searchParams } ) => {
				expect( searchParams ).toBeInstanceOf( Promise )
				return (
					<span>{ params.id }</span>
				)
			}
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

	} )


	it( 'renders the given component with awaited params and searchParams', async () => {

		const WrappedComponent = withAwaitedParams<Param, SearchParam, true>(
			( { params, searchParams } ) => (
				<div>
					<span>{ params.id }</span>
					<span>{ searchParams?.query }</span>
				</div>
			), true
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

		const generateMetadata: (
			Page.GenerateMetadata<Page.AwaitedProps<Param, SearchParam, true>>
		) = (
			jest.fn( props => ( {
				title		: `Page - ${ props.params.id }`,
				description	: `Query - ${ props.searchParams?.query }`,
			} ) )
		)

		const wrappedGenerateMetadata = (
			withAwaitedParams<Param, SearchParam, true>( generateMetadata, true )
		)

		const props: Page.Props<Param, SearchParam> = {
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