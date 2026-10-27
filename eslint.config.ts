import { nextjsProfile } from '@alessiofrittoli/package-configs/eslint/profiles/nextjs'
import { eslintConfig } from '@alessiofrittoli/package-configs/eslint'

export default eslintConfig(
	...nextjsProfile,
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			// disable this rule since we have no `pages` or `app` folder.
			'@next/next/no-html-link-for-pages': 'off',
			'@typescript-eslint/no-unnecessary-type-constraint': 'off',
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						'scripts/postinstall/index.cjs',
						'scripts/postinstall/ts-setup.cjs',
					],
				},
			},
		},
	},
)
