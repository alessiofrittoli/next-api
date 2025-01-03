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