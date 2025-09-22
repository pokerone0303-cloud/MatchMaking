import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/MatchMaking/' : '/',
  plugins: [
    vue(),
    // vueDevTools(),
    // 自動導入 Vue API
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
      ],
      dts: true,
      eslintrc: {
        enabled: true
      },
      resolvers: [VantResolver()],
    }),
    // 自動導入組件
    Components({
      resolvers: [VantResolver()],
      dts: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局導入 SCSS 變數
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
}))
