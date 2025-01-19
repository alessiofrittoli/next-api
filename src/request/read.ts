import { getTypedMap } from '@alessiofrittoli/web-utils'
import type { Api } from '@/types/api'


/**
 * Reads and parses the JSON body from a given resource.
 * 
 * @template T The expected type of the parsed JSON body.
 * 
 * @param	body The request or response object containing the JSON body.
 * @param	clone If `false`, reads the Body without cloning. Default: `false`.
 * @returns	A Promise that resolves to the parsed JSON body of type `T`, or `null` if an error occurs.
 */
export const readJsonBody = async <
	T extends Api.Route.RequestBody = Api.Route.RequestBody
>( body: Request | Api.Route.Request<T> | Response, clone: boolean = false ) => {

	try {
		if ( ! clone ) {
			return await body.json<T>()
		}
		return await body.clone().json<T>()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch ( error ) {

		return null

	}

}


/**
 * Interface representing a map of form data values where the key is a string 
 * and the value can be a single form entry value or an array of form entry values.
 */
interface DefaultFormDataReadMap
{
	[ x: string ]: FormDataEntryValue | FormDataEntryValue[]
}


/**
 * A callback type for processing form data entries when read. 
 * This function is called for each key-value pair in the form data.
 * 
 * @template T The type of the form data map.
 * @template K The key of the form data entry.
 * 
 * @param key The key of the form data entry.
 * @param value The value associated with the key.
 * @returns The processed value for the form data entry.
 */
export type OnRead<
	T extends Record<string, unknown | unknown[]> = DefaultFormDataReadMap,
	K extends keyof T = keyof T
> = ( key: K, value: T[ K ] ) => T[ K ]


/**
 * Reads and processes form data from a request or response body.
 * It extracts the form data and optionally processes each entry using a provided `onRead` callback.
 * 
 * @template T The type of the form data map (defaults to `DefaultFormDataReadMap`).
 * 
 * @param	body	The body of the request or response, from which the form data is to be read.
 * @param	clone	(Optional) Whether to clone the body before reading the form data. Default: `false`.
 * @param	onRead	(Optional) An optional callback function to process the form data entry.
 * 
 * @returns A map of form data entries, where the keys are the field names and the values are the field values.
 */
export const readFormDataBody = async <
	T extends Record<string, unknown | unknown[]> = DefaultFormDataReadMap
>(
	body	: Request | Api.Route.Request | Response,
	clone	: boolean = false,
	onRead?	: OnRead<T>,
) => {

	const formData	= await ( clone ? body.clone() : body ).formData()
	const entries	= getTypedMap<T>()

	Array.from( formData.entries() )
		.map( ( [ k, v ], index, array ) => {
			if ( entries.has( k ) ) return
			
			const subitems	= array.filter( ( [ _k ] ) => _k === k )
			const value		= (
				subitems.length <= 1 ? v : subitems.map( ( [, v ] ) => v )
			) as T[ typeof k ]

			if ( onRead ) return entries.set( k, onRead( k, value ) )
			entries.set( k, value )
		} )
	return entries

}


/**
 * Extracts and returns all the files from the form data in a request or response body.
 * 
 * This function reads the form data, filters out entries that are instances of `File`, 
 * and returns only the file entries.
 * 
 * @param	body	The body of the request or response from which the files should be extracted.
 * @param	clone	(Optional) Whether to clone the body before reading the form data. Default: `false`.
 * 
 * @returns A promise that resolves to an array of `File` objects extracted from the form data.
 */
export const getRequestFiles = async (
	body	: Request | Api.Route.Request | Response,
	clone	: boolean = false,
) => (
	Array.from( ( await ( clone ? body.clone() : body ).formData() ).entries() )
		.map( ( [, value ] ) => value )
		.filter( ( value ) => value instanceof File )
)