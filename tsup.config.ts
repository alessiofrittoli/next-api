import { defineConfig } from 'tsup'

export default defineConfig( {
	entry: [
		'src/index.ts', 'src/error/index.ts', 'src/middlewares/index.ts',
		'src/request/index.ts', 'src/response/index.ts',
		'src/page-wrappers/index.tsx', 'src/route-wrappers/index.ts',
		'src/types/index.ts', 'src/utils/index.ts'
	],
	// entry		: [ 'src/**/index.(.ts|.tsx)' ],
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