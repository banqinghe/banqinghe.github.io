import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import externalGlobals from 'rollup-plugin-external-globals';
import analyze from 'rollup-plugin-analyzer';
import './src/vite-env.d';
import { resolve } from 'path';

export default ({ mode }) => {
  const rollupPlugins = [
    externalGlobals({
      react: 'React',
      'react-dom': 'ReactDOM',
      katex: 'katex',
      // '@waline/client': 'Waline',
      'highlight.js/lib/core': 'hljs',
    }),
  ];
  if (loadEnv(mode, process.cwd()).VITE_IS_ANALYZE) {
    rollupPlugins.push(analyze());
  }

  return defineConfig({
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        plugins: rollupPlugins,
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      fs: {
        strict: false,
      },
    },
  });
};
