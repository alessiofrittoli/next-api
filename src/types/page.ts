// type DynamicPageProps = Page.WithSearchParams<
// 	LocalePageProps<{ slug: string }>, DynamicPageSearchParams
// >

// const DynamicPage: React.FC<DynamicPageProps> = async props => {

// 	const { locale, params }	= await setPageLocale( props )
// 	const { searchParam }		= await props.searchParams || {}
// 	const { slug }				= params

// 	return (
// 		<>
// 			<h1>Dynamic page</h1>
// 			<h2>Slug: { slug }</h2>
// 			<h2>Locale: { locale }</h2>
// 			{ searchParam && (
// 				<h2>param: { searchParam }</h2>
// 			) }
// 		</>
// 	)

// }

/**
 * Namespace containing types related to Next.js Pages.
 * 
 * @todo add example usage
 */
export namespace Page
{
	/**
	 * Default Next.js Page Component props.
	 * 
	 * @template T Custom type assigned to `props.params`.
	 */
	export interface Props<T = unknown>
	{
		/** Page parameters. */
		params: Promise<T>
	}


	/**
	 * Next.js Page URL Search Params.
	 * 
	 * @template T Custom type joined with the default type for `props.searchParams`.
	 */
	export type SearchParams<T = unknown> = T & {
		[ x: string ]: string | string[] | null
	}


	/**
	 * Next.js Page Props with `searchParams`.
	 * 
	 * @template T Custom type assigned to `props.params`.
	 * @template U Custom type joined with the default type for `props.searchParams`.
	 */
	export type PropsWithSearchParams<
		T = unknown,
		U = unknown,
	> = (
		Page.Props<T> & {
			/** Page URL Search Params. */
			searchParams?: Promise<Page.SearchParams<U>>
		}
	)
	
}