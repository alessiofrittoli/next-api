declare global
{
	namespace NodeJS
	{
		interface ProcessEnv
		{
			/** Defines the comma separated list of origins allowed to consume API routes. */
			ALLOWED_API_ORIGINS?: string
		}
	}
}

export {}