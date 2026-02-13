import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),

  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'src/pages/about.html',
        community: 'src/pages/community.html',
        product: 'src/pages/product.html',
        subscribe: 'src/pages/subscribe.html',
        '404': 'src/pages/404.html',
      },
    },
  },
})