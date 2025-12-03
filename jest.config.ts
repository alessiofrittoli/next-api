import type { JestConfigWithTsJest } from 'ts-jest'
import dotenv from 'dotenv'

console.log(
`
____________________________________________________
        _   __          __     ___    ____  ____
       / | / /__  _  __/ /_   /   |  / __ \\/  _/
      /  |/ / _ \\| |/_/ __/  / /| | / /_/ // /
     / /|  /  __/>  </ /_   / ___ |/ ____// /
    /_/ |_/\\___/_/|_|\\__/  /_/  |_/_/   /___/
____________________________________________________
`
)

const env = process.env.NODE_ENV

dotenv.config( { path: [
	`.env.${ env }.local`,
	`.env.${ env }`,
	'.env.local',
	'.env'
] } )


/**
 * Initial file generated with `npx ts-jest config:init`
 * 
 */
const config: JestConfigWithTsJest = {
	/** https://jestjs.io/docs/configuration#testenvironment-string */
	testEnvironment: 'node',
	moduleDirectories: [ 'node_modules', '<rootDir>/' ],
	testMatch: [ '**/__tests__/**/*.(test|spec).ts' ],
	/**
	 * If you're using [Module Path Aliases](https://nextjs.org/docs/advanced-features/module-path-aliases),
	 * you will have to add the moduleNameMapper in order for jest to resolve your absolute paths.
	 * The paths have to be matching with the paths option within the compilerOptions in the tsconfig.json
	 */
	moduleNameMapper: {
		'@/(.*)$': '<rootDir>/src/$1',
	},
	transform: {
		'^.+.tsx?$': [ 'ts-jest', {} ],
	},
}

export default config