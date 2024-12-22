const Chain		= require( '@alessiofrittoli/chain-functions' )
const tsSetup	= require( './ts-setup.js' )

/** @type {import( '@alessiofrittoli/chain-functions/types' ).LastChainLink<() => void | Promise<void>>} */
const lastChainLink = () => () => {
	console.log( 'Post-install done.' )
}

/** @type {import( '@alessiofrittoli/chain-functions/types' ).ChainFactory<() => void | Promise<void>>} */
const chain = [ tsSetup, lastChainLink ]

;( async () => {
	await Chain.functions( chain )()
} )()