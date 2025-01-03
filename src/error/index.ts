import { ErrorCode as Exception } from '@alessiofrittoli/exception/code'

export enum Next
{
	// other custom error codes...
}

export const ErrorCode	= { Exception, Next }
export type ErrorCode	= MergedEnumValue<typeof ErrorCode>