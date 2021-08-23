import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'demo',
  plugins: [createVuePlugin()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '../src',
      },
    ],
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
})
