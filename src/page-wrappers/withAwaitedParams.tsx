import type { Page } from '@/types'
import type { Metadata, ResolvingMetadata } from 'next'

export interface PropsWithAwaitedParams<T = unknown, U = unknown>
{
	/** Page parameters. */
	params: T
	/** Page URL Search Params. */
	searchParams?: Page.SearchParams<U>
}


export type GenerateMetadata<
	T = unknown,
> = (
	props	: T,
	parent	: Awaited<ResolvingMetadata>,
) => Metadata | Promise<Metadata>


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
 * 
 * @param	Page The Next.js Page `React.FunctionComponent`.
 * @returns	The Next.js Page `React.FunctionComponent` Wrapper that Next.js executes while rendering the page.
 * 
 * @example
 * 
 * ```ts
 * withAwaitedParams<{ dynamicPageSlug: string }, { utm_source: string }>( props => {
 * 	const { params }		= props
 * 	const { searchParams }	= props
 * 
 * 	console.log( 'utm_source', searchParams?.utm_source )
 * 
 * 	return (
 * 		<h1>My Dynamic Page - { params.dynamicPageSlug }</h1>
 * 	)
 * } )
 * ```
 */
export function withAwaitedParams<T = unknown, U = unknown>(
	Page: React.FC<React.PropsWithChildren<PropsWithAwaitedParams<T, U>>>
): (
	( props: Page.PropsWithSearchParams<T, U> ) => Promise<React.JSX.Element>
)


/**
 * Await Next.js Page metadata `props.params`, `props.searchParams` and `parent` ResolvingMetadata.
 * 
 * @template T Custom type assigned to `props.params`.
 * @template U Custom type joined with the default type for `props.searchParams`.
 * 
 * @param	generateMetadata The Next.js Page `generateMetadata` handler.
 * @returns	The Next.js Page `generateMetadata` Wrapper that Next.js executes while rendering the page.
 * 
 * @example
 * 
 * ```ts
 * withAwaitedParams<{ dynamicPageSlug: string }, { utm_source: string }>(
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
 * 	}
 * )
 * ```
 */
export function withAwaitedParams<T = unknown, U = unknown>(
	generateMetadata: GenerateMetadata<PropsWithAwaitedParams<T, U>>
): (
	( props: Page.PropsWithSearchParams<T, U>, parent: ResolvingMetadata ) => Promise<Metadata>
)


/**
 * Await Next.js Page metadata `props.params`, `props.searchParams` and `parent` ResolvingMetadata.
 * 
 * @template T Custom type assigned to `props.params`.
 * @template U Custom type joined with the default type for `props.searchParams`.
 * 
 * @param	Page The Next.js Page `React.FunctionComponent` or the Next.js Page `generateMetadata` handler.
 * @returns	The Next.js Page `React.FunctionComponent` Wrapper that Next.js executes while rendering the page or the Next.js Page `generateMetadata` Wrapper that Next.js executes while rendering the page.
 * 
 * @example
 * 
 * ```ts
 * withAwaitedParams<{ dynamicPageSlug: string }, { utm_source: string }>( props => {
 * 	const { params }		= props
 * 	const { searchParams }	= props
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
 * ```ts
 * withAwaitedParams<{ dynamicPageSlug: string }, { utm_source: string }>(
 * 	async ( props, parent ) => {
 * 
 * 		const { params }		= props
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
 * 	}
 * )
 * ```
 */
export function withAwaitedParams<
	T = unknown,
	U = unknown,
>( Page: (
	| React.FC<React.PropsWithChildren<PropsWithAwaitedParams<T, U>>>
	| GenerateMetadata<PropsWithAwaitedParams<T, U>>
) ): (
	( props: Page.PropsWithSearchParams<T, U>, parent: ResolvingMetadata ) => Promise<Metadata | React.JSX.Element>
)
{
	return (
		async ( props: Page.PropsWithSearchParams<T, U>, parent: ResolvingMetadata ) => (
			isPageReactFC<React.PropsWithChildren<PropsWithAwaitedParams<T, U>>>( Page, parent )
				? <Page
					{ ...props }
					params={ await props.params }
					searchParams={ await props.searchParams }
				/>
				: Page( {
					...props,
					params			: await props.params,
					searchParams	: await props.searchParams,
				}, await parent )
		)
	)
}