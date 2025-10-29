import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Vue3CollapsiblePanel',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.mjs';
        if (format === 'cjs') return 'index.cjs';
        return 'index.umd.js';
      }
    },
    rollupOptions: {
      external: ['vue', '@jamescoyle/vue-icon', '@mdi/js'],
      output: {
        globals: {
          vue: 'Vue',
          '@jamescoyle/vue-icon': 'Vue3SvgIcon',
          '@mdi/js': 'MdiJs'
        }
      }
    },
    sourcemap: true,
    cssCodeSplit: true,
    minify: true,
    emptyOutDir: true,
    outDir: 'dist'
  }
});


