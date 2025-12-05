import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		tailwindcss(),
		reactRouter(), // React Router v7 "framework" mode
		tsconfigPaths(), // Workspace/tsconfig path aliases
	],
	// resolve: {
	// 	// Prevent duplicate React if your lib is linked/hoisted
	// 	dedupe: ['react', 'react-dom'],
	// 	alias: {
	// 		// (optional) direct alias to workspace package if needed
	// 		// 'maxstack': path.resolve(__dirname, '../../packages/maxstack/src'),
	// 	},
	// },
	// optimizeDeps: {
	// 	// Makes sure Vite pre-bundler doesn't choke on linked workspace deps
	// 	// include: ['maxstack'],
	// },
	// server: {
	// 	// Let the dev server read files from your workspace if needed
	// 	fs: { allow: [path.resolve(__dirname, '..', '..')] },
	// },
	test: {
		globals: true,
		environment: 'jsdom',
		css: true,
		setupFiles: ['./vitest.setup.ts'],
		exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
		include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	},
	// If you do SSR/hydration with RR7, avoid externalizing the UI lib:
	// ssr: { noExternal: ['maxstack'] },
})
