// 引入統一樣式文件
import './assets/main.css'
import './styles/index.scss'

// 引入 Vant 4 樣式
// import 'vant/lib/index.css'

// 引入觸控模擬器（PC 端支援）
// 此套件會自動檢測並在非觸控設備上啟用觸控模擬
import '@vant/touch-emulator'

// 引入 Vue 相關
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 創建 Vue 應用實例
const app = createApp(App)

// 註冊 Pinia 和 Router
app.use(createPinia())
app.use(router)

// 掛載應用
app.mount('#app')
