import { defineConfig } from 'tsup'

export default defineConfig( {
	entry: [
		'src/index.ts', 'src/error/index.ts', 'src/middlewares/index.ts',
		'src/request/index.ts', 'src/response/index.ts',
		'src/route-wrappers/index.ts', 'src/types/index.ts', 'src/utils/index.ts'
	],
	format		: [ 'cjs', 'esm' ],
	dts			: true,
	splitting	: false,
	shims		: false,
	skipNodeModulesBundle: true,
	clean		: true,
	treeshake	: true,
	minify		: true,
	sourcemap	: true,
} )