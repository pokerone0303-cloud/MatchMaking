# Vant 4 自動引入配置指南

## 🎯 概述

根據 [Vant 官方文檔](https://vant-ui.github.io/vant/#/zh-CN/quickstart#2.-pei-zhi-cha-jian) 的建議，本專案已配置自動引入功能，無需手動 import Vant 4 組件和方法。

## ⚙️ 配置說明

### 1. Vite 配置

```typescript
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    // 自動導入 Vue API
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          vant: [
            'showToast',
            'showDialog',
            'showConfirmDialog',
            'showNotify',
            'showLoadingToast',
            'closeToast',
            'closeDialog',
            'closeNotify',
          ],
        },
      ],
      dts: true,
      eslintrc: {
        enabled: true,
      },
    }),
    // 自動導入組件
    Components({
      resolvers: [VantResolver()],
      dts: true,
    }),
  ],
})
```

### 2. 自動生成的文件

配置完成後會自動生成以下文件：

- `auto-imports.d.ts` - 自動導入的類型聲明
- `components.d.ts` - 組件類型聲明
- `.eslintrc-auto-import.json` - ESLint 配置

## 🚀 使用方式

### 1. 組件自動引入

所有 Vant 4 組件都可以直接使用，無需 import：

```vue
<template>
  <!-- 直接使用，無需 import -->
  <van-button type="primary">按鈕</van-button>
  <van-nav-bar title="標題" />
  <van-cell title="列表項" />
  <van-form @submit="onSubmit">
    <van-field v-model="value" label="標籤" />
  </van-form>
</template>

<script setup lang="ts">
// 無需 import 任何 Vant 組件
const onSubmit = () => {
  // 表單提交邏輯
}
</script>
```

### 2. 方法自動引入

常用方法也可以直接使用：

```vue
<script setup lang="ts">
// 無需 import，直接使用
const handleClick = () => {
  showToast('操作成功')

  showDialog({
    title: '確認',
    message: '確定要刪除嗎？',
  })

  showNotify({
    type: 'success',
    message: '操作完成',
  })
}
</script>
```

### 3. Vue API 自動引入

Vue 3 的 API 也會自動引入：

```vue
<script setup lang="ts">
// 無需 import，直接使用
const count = ref(0)
const doubled = computed(() => count.value * 2)

onMounted(() => {
  console.log('組件已掛載')
})

watch(count, (newVal) => {
  console.log('count 變更:', newVal)
})
</script>
```

## 📋 自動引入的內容

### 1. Vant 4 組件

所有 Vant 4 組件都會自動引入，包括：

- **基礎組件**: Button, Cell, CellGroup, Icon, Image, Popup 等
- **導航組件**: NavBar, Tabbar, TabbarItem, Tabs, Tab 等
- **表單組件**: Form, Field, Checkbox, Radio, Switch 等
- **反饋組件**: Dialog, Toast, Notify, Loading 等
- **展示組件**: Badge, Tag, Progress, Card, List 等
- **業務組件**: AddressEdit, ContactCard, Coupon 等

### 2. Vant 4 方法

以下方法會自動引入：

- `showToast()` - 顯示輕提示
- `showDialog()` - 顯示對話框
- `showConfirmDialog()` - 顯示確認對話框
- `showNotify()` - 顯示通知
- `showLoadingToast()` - 顯示載入提示
- `closeToast()` - 關閉提示
- `closeDialog()` - 關閉對話框
- `closeNotify()` - 關閉通知

### 3. Vue 3 API

- `ref`, `reactive`, `computed`, `watch`, `watchEffect`
- `onMounted`, `onUnmounted`, `onUpdated`, `onBeforeMount`
- `nextTick`, `defineProps`, `defineEmits`, `defineExpose`

### 4. Vue Router API

- `useRouter`, `useRoute`, `useLink`

### 5. Pinia API

- `defineStore`, `storeToRefs`

## 🎨 樣式配置

### 1. 全局樣式導入

```typescript
// vite.config.ts
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@/styles/variables.scss";`
    }
  }
}
```

### 2. 使用 SCSS 變數

```vue
<style lang="scss" scoped>
.my-component {
  color: $color-primary; // 自動可用
  background: $color-bg-primary; // 自動可用
  padding: $spacing-base; // 自動可用
}
</style>
```

## 🔧 配置選項

### 1. AutoImport 配置

```typescript
AutoImport({
  imports: [
    'vue', // Vue 3 API
    'vue-router', // Vue Router API
    'pinia', // Pinia API
    {
      vant: [
        // Vant 4 方法
        'showToast',
        'showDialog',
        // ... 其他方法
      ],
    },
  ],
  dts: true, // 生成類型聲明文件
  eslintrc: {
    enabled: true, // 生成 ESLint 配置
  },
})
```

### 2. Components 配置

```typescript
Components({
  resolvers: [VantResolver()], // Vant 4 組件解析器
  dts: true, // 生成組件類型聲明
})
```

## 🎯 優勢

### 1. 開發效率提升

- 無需手動 import 組件和方法
- 減少代碼冗餘
- 提高開發速度

### 2. 類型安全

- 自動生成 TypeScript 類型聲明
- 完整的類型提示
- 編譯時類型檢查

### 3. 代碼簡潔

- main.ts 極簡化
- 組件代碼更簡潔
- 減少維護成本

### 4. 按需載入

- 只載入使用的組件
- 減少打包體積
- 提高運行性能

## 🐛 故障排除

### 1. 組件無法識別

**問題**: 組件無法使用，提示未定義

**解決方案**:

- 檢查 `components.d.ts` 是否生成
- 確認 Vite 配置正確
- 重啟開發服務器

### 2. 類型錯誤

**問題**: TypeScript 類型錯誤

**解決方案**:

- 檢查 `auto-imports.d.ts` 是否生成
- 確認 TypeScript 配置
- 重新生成類型聲明

### 3. ESLint 錯誤

**問題**: ESLint 提示未定義的變數

**解決方案**:

- 檢查 `.eslintrc-auto-import.json` 是否生成
- 在 ESLint 配置中引入自動導入配置
- 重啟 ESLint 服務

## 📚 相關資源

- [Vant 4 官方文檔](https://vant-ui.github.io/vant/)
- [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)
- [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)
- [Vite 官方文檔](https://vitejs.dev/)

## 🎉 總結

通過配置自動引入，我們實現了：

1. **零配置使用** - 組件和方法直接可用
2. **類型安全** - 完整的 TypeScript 支援
3. **按需載入** - 只載入使用的組件
4. **開發效率** - 無需手動 import
5. **代碼簡潔** - 減少冗餘代碼

現在您可以專注於業務邏輯開發，而不用擔心組件引入的問題！
