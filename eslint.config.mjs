import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'
import nextTs from 'eslint-config-next/typescript'
import nextVitals from 'eslint-config-next/core-web-vitals'

const __filename	= fileURLToPath( import.meta.url )
const __dirname		= dirname( __filename )

const compat = new FlatCompat( {
	baseDirectory: __dirname,
} )

/** @type {import('eslint').Linter.Config[]} */
const config = [
	...nextVitals,
	...nextTs,
	...fixupConfigRules( compat.extends( 'plugin:react-server-components/recommended' ) ),
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{ ignores: [ 'dist', 'coverage', 'scripts' ] },
	{ rules: {
		// disable this rule since we have no `pages` or `app` folder.
		'@next/next/no-html-link-for-pages': 'off',
		// namespaces are beautiful
		'@typescript-eslint/no-namespace': 'off',
	} },
]

export default config