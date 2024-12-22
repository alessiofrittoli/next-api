import Exception from '@alessiofrittoli/exception/code'

export enum Next
{
	// other custom error codes...
}

const ErrorCode	= { Exception, Next }
type ErrorCode	= MergedEnumValue<typeof ErrorCode>

export default ErrorCode