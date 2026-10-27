/// <reference types='vitest/config' />

import { viteConfig } from '@alessiofrittoli/package-configs/vite'

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
					name: 'react',
					environment: 'jsdom',
					include: ['__tests__/react/**/*.test.tsx'],
					setupFiles: ['__tests__/react/setup.ts'],
				},
			},
		],
	},
})
