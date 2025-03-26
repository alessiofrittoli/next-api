import type { Page } from '@/types'
import type { Metadata, ResolvingMetadata } from 'next'


/**
 * Check if function is a Next.js React.FC Page component or `generateMetadata` function.
 * 
 */
export const isPageReactFC = <
	T = unknown
>( input: unknown, parent?: ResolvingMetadata | Awaited<ResolvingMetadata> ): input is React.FC<T> => (
	typeof parent === 'undefined'
)


/**
 * Await Next.js Page `props.params` and `props.searchParams`.
 * 
 * @template T Custom type assigned to `props.params`.
 * @template U Custom type joined with the default type for `props.searchParams`.
 * @template V Indicates whether `props.searchParams` are awaited or not. Default: `false`.
 * 
 * @param	Page The Next.js Page `React.FunctionComponent`.
 * @param	awaitSearchParams Indicates whether to await `searchParams` or not. Default: `false`.\
 * 								⚠️ Keep in mind that awaiting `searchParams` will cause the page to render for each request.
 * 
 * @returns	The Next.js Page `React.FunctionComponent` Wrapper that Next.js executes while rendering the page.
 * 
 * @example
 * 
 * #### Awaited page params (no `searchParams` usage).
 * 
 * ```tsx
 * withAwaitedParams<{ dynamicPageSlug: string }>( props => {
 * 	const { params } = props
 * 
 * 	return (
 * 		<h1>My Dynamic Page - { params.dynamicPageSlug }</h1>
 * 	)
 * } )
 * ```
 * 
 * @example
 * 
 * #### Awaited page params with manual `searchParams` resolution.
 * 
 * ```tsx
 * withAwaitedParams<{ dynamicPageSlug: string }>( async props => {
 * 	const { params }	= props
 * 	const searchParams	= await props.searchParams
 * 
 * 	console.log( 'utm_source', searchParams?.utm_source )
 * 
 * 	return (
 * 		<h1>My Dynamic Page - { params.dynamicPageSlug }</h1>
 * 	)
 * } )
 * ```
 * 
 * @example
 * 
 * #### Awaited page params with auto `searchParams` resolution.
 * 
 * ```tsx
 * withAwaitedParams<{ dynamicPageSlug: string }, { utm_source: string }, true>( props => {
 * 	const { params }		= props
 * 	const { searchParams }	= props
 * 
 * 	console.log( 'utm_source', searchParams?.utm_source )
 * 
 * 	return (
 * 		<h1>My Dynamic Page - { params.dynamicPageSlug }</h1>
 * 	)
 * }, true )
 * ```
 */
export function withAwaitedParams<
	T extends Page.Params = Page.Params,
	U extends Record<string, Page.SearchParam> = Record<string, Page.SearchParam>,
	V extends boolean = false,
>(
	Page: React.FC<React.PropsWithChildren<Page.AwaitedProps<T, U, V>>>,
	awaitSearchParams?: V,
): (
	( props: Page.Props<T, U> ) => Promise<React.JSX.Element>
)


/**
 * Await Next.js Page metadata `props.params`, `props.searchParams` and `parent` ResolvingMetadata.
 * 
 * @template T Custom type assigned to `props.params`.
 * @template U Custom type joined with the default type for `props.searchParams`.
 * @template V Indicates whether `props.searchParams` are awaited or not. Default: `false`.
 * 
 * @param	generateMetadata The Next.js Page `generateMetadata` handler.
 * @param	awaitSearchParams Indicates whether to await `searchParams` or not. Default: `false`.\
 * 								⚠️ Keep in mind that awaiting `searchParams` will cause the page to render for each request.
 * 
 * @returns	The Next.js Page `generateMetadata` Wrapper that Next.js executes while rendering the page.
 * 
 * @example
 * 
 * #### Awaited page params (no `searchParams` usage).
 * 
 * ```ts
 * withAwaitedParams<{ dynamicPageSlug: string }>(
 * 	async ( props, parent ) => {
 * 
 * 		const { params } = props
 * 
 * 		console.log( 'dynamicPageSlug', params.dynamicPageSlug )
 * 		console.log( 'parent metadata', parent )
 * 
 * 		return {
 * 			// ... page metadata ...
 * 		}
 * 
 * 	}
 * )
 * ```
 * 
 * @example
 * 
 * #### Awaited page params with auto `searchParams` resolution.
 * 
 * ```ts
 * withAwaitedParams<{ dynamicPageSlug: string }, { utm_source: string }, true>(
 * 	async ( props, parent ) => {
 * 
 * 		const { params }	= props
 * 		const { searchParams }	= props
 * 
 * 		console.log( 'dynamicPageSlug', params.dynamicPageSlug )
 * 		console.log( 'utm_source', searchParams?.utm_source )
 * 
 * 		console.log( 'parent metadata', parent )
 * 
 * 		return {
 * 			// ... page metadata ...
 * 		}
 * 
 * 	}, true
 * )
 * ```
 */
export function withAwaitedParams<
	T extends Page.Params = Page.Params,
	U extends Record<string, Page.SearchParam> = Record<string, Page.SearchParam>,
	V extends boolean = false,
>(
	generateMetadata: Page.GenerateMetadata<Page.AwaitedProps<T, U, V>>,
	awaitSearchParams?: V,
): (
	( props: Page.Props<T, U>, parent: ResolvingMetadata ) => Promise<Metadata>
)


/**
 * Await Next.js Page metadata `props.params`, `props.searchParams` and `parent` ResolvingMetadata.
 * 
 * @template T Custom type assigned to `props.params`.
 * @template U Custom type joined with the default type for `props.searchParams`.
 * @template V Indicates whether `props.searchParams` are awaited or not. Default: `false`.
 * 
 * @param	Page The Next.js Page `React.FunctionComponent` or the Next.js Page `generateMetadata` handler.
 * @param	awaitSearchParams Indicates whether to await `searchParams` or not. Default: `false`.\
 * 								⚠️ Keep in mind that awaiting `searchParams` will cause the page to render for each request.
 * 
 * @returns	The Next.js Page `React.FunctionComponent` Wrapper that Next.js executes while rendering the page or the Next.js Page `generateMetadata` Wrapper that Next.js executes while rendering the page.
 */
export function withAwaitedParams<
	T extends Page.Params = Page.Params,
	U extends Record<string, Page.SearchParam> = Record<string, Page.SearchParam>,
	V extends boolean = false,
>( Page: (
	| React.FC<React.PropsWithChildren<Page.AwaitedProps<T, U, V>>>
	| Page.GenerateMetadata<Page.AwaitedProps<T, U, V>>
), awaitSearchParams: V = false as V ): (
	( props: Page.Props<T, U>, parent: ResolvingMetadata ) => Promise<Metadata | React.JSX.Element>
)
{
	return (
		async ( props: Page.Props<T, U>, parent: ResolvingMetadata ) => {
			
			const params		= await props.params
			const searchParams	= (
				awaitSearchParams
					? await props.searchParams
					: props.searchParams
			) as Page.AwaitedProps<T, U, V>[ 'searchParams' ]

			return (
				isPageReactFC<React.PropsWithChildren<Page.AwaitedProps<T, U, V>>>( Page, parent )
					? <Page
						{ ...props }
						params={ params }
						searchParams={ searchParams }
					/>
					: Page( { ...props, params, searchParams }, await parent )
			)

		}
	)
}