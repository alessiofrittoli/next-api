/// <reference types='vitest/config' />

import { viteConfig } from '@alessiofrittoli/package-configs/vite'
import { playwright } from '@vitest/browser-playwright'

export default viteConfig({
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'node',
					environment: 'node',
					include: ['__tests__/node/**/*.test.ts'],
				},
			},
			{
				extends: true,
				test: {
					name: 'browser',
					include: ['__tests__/react/**/*.test.tsx'],
					setupFiles: ['__tests__/react/setup.ts'],
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						instances: [{ browser: 'chromium' }],
					},
				},
			},
		],
	},
})
