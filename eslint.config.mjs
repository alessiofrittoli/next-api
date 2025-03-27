import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'

const __filename	= fileURLToPath( import.meta.url )
const __dirname		= dirname( __filename )

const compat = new FlatCompat( {
	baseDirectory: __dirname,
} )


/** @type {import('eslint').Linter.Config[]} */
const config = [
	...compat.extends( 'next/core-web-vitals', 'next/typescript' ),
	...fixupConfigRules( compat.extends( 'plugin:react-server-components/recommended' ) ),
	{ ignores: [ 'dist', 'coverage', 'scripts' ] },
	{ rules: {
		// disable this rule since we have no `pages` or `app` folder.
		'@next/next/no-html-link-for-pages': 'off',
		// namespaces are beautiful
		'@typescript-eslint/no-namespace': 'off',
	} },
]

export default config