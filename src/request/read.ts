import type { Api } from '@/types/api'

/**
 * Read Incoming Request Json Body.
 * 
 * @param	body The Request|Body instance.
 * @returns	The Awaited result of {@link Body.json}, null if Body is empty, locked or invalid.
 */
export const readJsonBody = async <
	T extends Api.Route.RequestBody = Api.Route.RequestBody
>( body: Api.Route.Request<T> ) => {

	try {
		
		return await body.clone().json<T>()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch ( error ) {

		return null

	}

}