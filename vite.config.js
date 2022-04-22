/*
 * @Description: 
 * @Project: 
 * @Author: yunfei
 * @Date: 2022-03-22 15:46:00
 * @LastEditors: yunfei
 * @LastEditTime: 2022-03-24 16:59:00
 * @Modified By: yunfei
 * @FilePath: /trunkverse/vite.config.js
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import * as path from 'path';


export default defineConfig({
  plugins: [
    vue(),
    ElementPlus(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  css: {
    postcss: {
      plugins: [
        require('postcss-px-to-viewport')({
          unitToConvert: 'px',
          viewportWidth: 1920,
          viewportHeight: 1080, // 视窗的高度
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ['*'],
        }),
      ],
    },
  },
  //配置路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    open: true,
    host: '0.0.0.0',
    hmr: true,
    proxy: {
      // "/api":{
      //   target: 'http://10.11.24.114:8001/',
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/api/, '')
      // }
    }
  }
})
