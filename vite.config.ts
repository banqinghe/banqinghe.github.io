import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import externalGlobals from 'rollup-plugin-external-globals';
// import analyze from 'rollup-plugin-analyzer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      plugins: [
        externalGlobals({
          'react': 'React',
          'react-dom': 'ReactDOM',
          katex: 'katex',
          // '@waline/client': 'Waline',
          'highlight.js/lib/core': 'hljs',
        }),
        // analyze(),
      ],
    },
  },
})
