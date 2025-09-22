# Vant 4 + SCSS 變數管理設置指南

## 🎯 概述

本專案已成功配置 Vant 4 組件庫和統一的 SCSS 變數管理系統，提供完整的移動端開發解決方案。

## 📦 已安裝的套件

### 核心依賴

- **Vant 4.9.21** - 移動端組件庫
- **Vue 3.5.18** - 前端框架
- **Vite 7.0.6** - 構建工具
- **Pinia 3.0.3** - 狀態管理
- **Vue Router 4.5.1** - 路由管理
- **Sass 1.92.1** - CSS 預處理器

### 開發依賴

- **unplugin-vue-components** - 組件自動導入
- **unplugin-auto-import** - API 自動導入
- **TypeScript 5.8.0** - 類型檢查
- **ESLint + Prettier** - 代碼規範

## 🎨 色彩系統

### 主要色彩

- **主要色**: `#155dfc` (藍色)
- **成功色**: `#00c951` (綠色)
- **警告色**: `#f2994a` (橙色)
- **危險色**: `#fb2c36` (紅色)
- **資訊色**: `#909399` (灰色)

### 使用方式

#### 1. SCSS 變數

```scss
.my-component {
  color: $color-primary;
  background: $color-bg-primary;
  border: 1px solid $color-gray-1;
}
```

#### 2. CSS 變數

```css
.my-component {
  color: var(--color-primary);
  background: var(--color-bg-primary);
}
```

#### 3. 工具類

```html
<div class="text-primary bg-white rounded-lg p-base">內容</div>
```

## 🧩 Vant 4 組件使用

### 已註冊的組件

所有常用 Vant 4 組件已全局註冊，可直接使用：

```vue
<template>
  <div>
    <!-- 按鈕 -->
    <van-button type="primary" @click="handleClick"> 主要按鈕 </van-button>

    <!-- 表單 -->
    <van-form @submit="onSubmit">
      <van-field v-model="value" name="field" label="標籤" placeholder="請輸入" />
    </van-form>

    <!-- 列表 -->
    <van-list>
      <van-cell v-for="item in list" :key="item.id" :title="item.title" />
    </van-list>
  </div>
</template>
```

### 組件方法

常用方法已全局可用：

```javascript
// 提示
Toast('操作成功')

// 對話框
Dialog.confirm({
  title: '確認',
  message: '確定要刪除嗎？',
})

// 通知
Notify({
  type: 'success',
  message: '操作成功',
})

// 載入
const loading = Loading({
  message: '載入中...',
})
```

## 📁 文件結構

```
src/
├── styles/
│   ├── index.scss          # 統一樣式入口
│   ├── variables.scss      # SCSS 變數定義
│   ├── global.scss         # 全局樣式
│   ├── vant-theme.scss     # Vant 主題定制
│   ├── utilities.scss      # 工具類樣式
│   ├── animations.scss     # 動畫效果
│   ├── breakpoints.scss    # 響應式斷點
│   └── color-guide.md      # 色彩使用指南
├── components/
│   └── AutoImportExample.vue  # 自動引入示例
├── main.ts                 # 應用入口
└── vite.config.ts          # Vite 配置
```

## ⚙️ 配置說明

### 1. Vite 配置

- 支援 SCSS 變數全局導入
- 配置路徑別名 `@` 指向 `src`
- 開發服務器端口 3000

### 2. 樣式配置

- 全局導入 SCSS 變數
- Vant 4 主題自動應用
- 響應式斷點支援

### 3. 自動引入系統

- 基於 [Vant 官方文檔](https://vant-ui.github.io/vant/#/zh-CN/quickstart#2.-pei-zhi-cha-jian) 配置
- 組件和方法自動引入，無需手動 import
- 完整的 TypeScript 類型支援
- 按需載入，減少打包體積

## 🚀 快速開始

### 1. 啟動開發服務器

```bash
npm run dev
```

### 2. 使用組件（自動引入）

```vue
<template>
  <!-- 直接使用，無需 import -->
  <van-nav-bar title="頁面標題" />
  <van-button type="primary">按鈕</van-button>
  <van-cell title="列表項" />
</template>

<script setup lang="ts">
// 無需 import 任何 Vant 組件
// 方法也自動引入
const handleClick = () => {
  showToast('操作成功')
}
</script>
```

### 3. 使用樣式

```vue
<style lang="scss" scoped>
.my-component {
  color: $color-primary;
  padding: $spacing-base;
  border-radius: $border-radius-lg;
}
</style>
```

## 🎯 最佳實踐

### 1. 色彩使用

- 優先使用語義化色彩變數
- 保持色彩一致性
- 考慮可訪問性

### 2. 組件使用

- 遵循 Vant 4 設計規範
- 合理使用組件屬性
- 注意響應式適配

### 3. 樣式編寫

- 使用 SCSS 變數
- 遵循 BEM 命名規範
- 利用工具類提高效率

## 📚 參考資源

- [Vant 4 官方文檔](https://vant-ui.github.io/vant/)
- [Vue 3 官方文檔](https://vuejs.org/)
- [Sass 官方文檔](https://sass-lang.com/)
- [Vite 官方文檔](https://vitejs.dev/)

## 🔧 故障排除

### 1. 樣式不生效

- 檢查 SCSS 變數是否正確導入
- 確認組件是否正確註冊
- 檢查 CSS 優先級

### 2. 組件無法使用

- 確認組件是否已註冊
- 檢查導入語句
- 查看控制台錯誤

### 3. 響應式問題

- 檢查斷點設置
- 確認媒體查詢語法
- 測試不同設備

## 📝 更新日誌

- **v2.0.0** - 自動引入配置完成
  - 配置 Vant 4 自動引入
  - 簡化 main.ts 文件
  - 添加 TypeScript 類型支援
  - 實現按需載入

- **v1.0.0** - 初始設置完成
  - 配置 Vant 4 組件庫
  - 建立 SCSS 變數系統
  - 設置統一樣式管理
  - 添加響應式支援
