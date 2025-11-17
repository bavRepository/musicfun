import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'dashesOnly', // или 'camelCaseOnly', 'dashes', 'camelCase'
      generateScopedName: '[name]__[local]___[hash:base64:5]', // формат: ComponentName_className_hash
    },
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
})
