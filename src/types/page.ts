import type { Metadata, ResolvingMetadata } from 'next'

/**
 * Namespace containing types related to Next.js Pages.
 * 
 */
export namespace Page
{
	/**
	 * Represent `Awaited<Page.Props[ 'params' ]>`.
	 * 
	 */
	export type Params = Record<string, string | string[]>


	/**
	 * Represent a URLSearchParam value.
	 * 
	 */
	export type SearchParam = string | string[] | null


	/**
	 * Next.js Page URL Search Params.
	 * 
	 * @template T Custom type joined with the default type for `props.searchParams`.
	 */
	export type SearchParams<
		T extends Record<string, Page.SearchParam> = Record<string, Page.SearchParam>
	> = T & {
		[ x: string ]: Page.SearchParam
	}


	/**
	 * Default Next.js Page Component props.
	 * 
	 * @template T Custom type assigned to `props.params`.
	 * @template U Custom type joined with the default type for `props.searchParams`.
	 * 
	 * @example
	 * 
	 * #### Basic usage
	 * 
	 * ```tsx
	 * // src/app/dynamic/[slug]/page.tsx
	 * const DynamicPage: React.FC<Page.Props> = (
	 * 	async props => {
	 * 
	 * 		const params	= await props.params
	 * 		const { slug }	= params // `slug` is now type of `string | string[] | undefined`
	 * 	
	 * 		return (
	 * 			<h1>Dynamic page - { slug }</h1>
	 * 		)
	 * 	
	 * 	}
	 * )
	 * ```
	 * 
	 * ---
	 * 
	 * @example
	 * 
	 * #### `Page.Props[ 'params' ]` safe access
	 * 
	 * ```tsx
	 * // src/app/dynamic/[slug]/page.tsx
	 * const DynamicPage: React.FC<Page.Props<{ slug: string }>> = (
	 * 	async props => {
	 * 
	 * 		const params	= await props.params
	 * 		const { slug }	= params // safe access to `params.slug`
	 * 	
	 * 		return (
	 * 			<h1>Dynamic page - { slug }</h1>
	 * 		)
	 * 	
	 * 	}
	 * )
	 * ```
	 * 
	 * ---
	 * 
	 * @example
	 * 
	 * #### Catch-all Page
	 * 
	 * ```tsx
	 * // src/app/catch-all/[...rest]/page.tsx
	 * const CatchAllPage: React.FC<Page.Props<{ rest: string[] }>> = (
	 * 	async props => {
	 * 
	 * 		const params	= await props.params
	 * 		const { rest }	= params // safe access to `params.rest`
	 * 	
	 * 		return (
	 * 			<h1>Catch-all page - { rest.join( ' - ' ) }</h1>
	 * 		)
	 * 	
	 * 	}
	 * )
	 * ```
	 * 
	 * ---
	 * 
	 * @example
	 * 
	 * #### Page with search params
	 * 
	 * ```tsx
	 * // src/app/page.tsx
	 * const PageWithSearchParams: React.FC<Page.Props> = (
	 * 	async props => {
	 * 
	 * 		const searchParams	= await props.searchParams
	 * 		const { param }		= searchParams || {} // `param` is now type of `string | string[] | null | undefined`
	 * 	
	 * 		return (
	 * 			<h1>Page with search param - { param }</h1>
	 * 		)
	 * 	
	 * 	}
	 * )
	 * ```
	 * 
	 * ---
	 * 
	 * @example
	 * 
	 * #### Page with typed search params
	 * 
	 * ```tsx
	 * // src/app/page.tsx
	 * const PageWithSearchParams: React.FC<Page.Props<never, { param: Page.SearchParam }>> = (
	 * 	async props => {
	 * 
	 * 		const searchParams	= await props.searchParams
	 * 		const { param }		= searchParams || {} // safe access to `searchParams?.param` - `param` is now type of `string | string[] | null | undefined`
	 * 	
	 * 		return (
	 * 			<h1>Page with search param - { param }</h1>
	 * 		)
	 * 	
	 * 	}
	 * )
	 * ```
	 */
	export type Props<
		T extends Page.Params = Page.Params,
		U extends Record<string, Page.SearchParam> = Record<string, Page.SearchParam>,
	> = {
		/** Page parameters. */
		params: Promise<T>
		/** Page URL Search Params. */
		searchParams?: Promise<Page.SearchParams<U>>
	}


	/**
	 * The Next.js React.FC Page `props` with awaited `params`.
	 * 
	 * @template T Custom type assigned to `props.params`.
	 * @template U Custom type joined with the default type for `props.searchParams`.
	 * @template V Indicates whether `props.searchParams` are awaited or not. Default: `false`.
	 */
	export interface AwaitedProps<
		T extends Page.Params = Page.Params,
		U extends Record<string, Page.SearchParam> = Record<string, Page.SearchParam>,
		V extends boolean = false,
	>
	{
		/** Page parameters. */
		params: T
		/** Page URL Search Params. */
		searchParams?: V extends false ? Promise<Page.SearchParams<U>> : Page.SearchParams<U> 
	}


	/**
	 * The Next.js Page generateMetadata handler with awaited `params`.
	 * 
	 * @template T Custom type assigned to `props`.
	 */
	export type GenerateMetadata<
		T = unknown,
	> = (
		props	: T,
		parent	: Awaited<ResolvingMetadata>,
	) => Metadata | Promise<Metadata>
	
}