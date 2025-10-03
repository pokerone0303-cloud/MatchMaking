# Vant 觸控模擬器設定

## 問題說明

Vant 的 DatePicker 和 Picker 組件在 PC 端需要額外的觸控支援才能正常工作，因為這些組件是為移動端設計的。

## 解決方案

### 1. 安裝觸控模擬器套件

```bash
npm install @vant/touch-emulator
```

### 2. 在 main.ts 中引入

```typescript
// 引入觸控模擬器（PC 端支援）
// 此套件會自動檢測並在非觸控設備上啟用觸控模擬
import '@vant/touch-emulator'
```

### 3. 完整設定範例

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 引入觸控模擬器（必須在 Vue 應用創建之前引入）
import '@vant/touch-emulator'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

## 功能說明

`@vant/touch-emulator` 套件會：

1. **模擬觸控事件**：將滑鼠事件轉換為觸控事件
2. **支援手勢操作**：如滑動、拖拽等
3. **改善 PC 端體驗**：讓 Vant 組件在 PC 端也能正常使用

## 注意事項

- 必須在 Vue 應用創建之前引入此套件
- 僅在非觸控設備上生效
- 不會影響移動端的正常使用

## 相關文檔

- [Vant DatePicker 文檔](https://vant-ui.github.io/vant/#/zh-CN/date-picker)
- [Vant Picker 文檔](https://vant-ui.github.io/vant/#/zh-CN/picker)
- [@vant/touch-emulator 文檔](https://github.com/vant-ui/vant/tree/main/packages/vant-touch-emulator)
