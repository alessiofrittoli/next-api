const project = require( '../../package.json' )
const { addTypesReference } = require( '@alessiofrittoli/post-install-scripts' )


/** @type {import( '@alessiofrittoli/chain-functions/types' ).ChainLink<() => void | Promise<void>>} */
const tsSetup = next => () => {
	
	/** @type {import( '@alessiofrittoli/post-install-scripts/types' ).AddTypesReferenceOptions} */
	const options = {
		projectName: project.name,
	}
	addTypesReference( options )

	return next()
}

module.exports = tsSetup