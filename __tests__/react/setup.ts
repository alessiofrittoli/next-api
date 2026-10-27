declare global {
	var IS_REACT_ACT_ENVIRONMENT: boolean
}

/**
 * Tells React that `act()` is being used in a test environment.
 *
 * @see https://react.dev/reference/react/act#error-the-current-testing-environment-is-not-configured-to-support-act
 */
globalThis.IS_REACT_ACT_ENVIRONMENT = true

export {}
