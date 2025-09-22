# 統一樣式系統使用指南

## 🎯 概述

本專案採用 **SCSS 變數** 作為統一的樣式管理方式，所有樣式變數都定義在 `variables.scss` 中，並通過 Vite 配置全局導入。

## 📁 文件結構

```
src/styles/
├── index.scss          # 統一樣式入口
├── variables.scss      # SCSS 變數定義（核心）
├── global.scss         # 全局樣式 + Vant 4 主題映射
├── vant-theme.scss     # Vant 4 主題定制
├── utilities.scss      # 工具類樣式
├── animations.scss     # 動畫效果
├── breakpoints.scss    # 響應式斷點
└── color-guide.md      # 色彩使用指南
```

## 🎨 變數系統

### 1. 色彩變數

```scss
// 主要色彩
$color-primary: #155dfc;
$color-success: #00c951;
$color-warning: #f2994a;
$color-danger: #fb2c36;
$color-info: #909399;

// 中性色彩
$color-white: #ffffff;
$color-black: #030213;
$color-gray-1: #e9e9e9;
$color-gray-2: #f3f3f5;

// 語義化色彩
$color-text-primary: $color-black;
$color-text-secondary: $color-gray-1;
$color-bg-primary: $color-white;
$color-bg-secondary: $color-gray-2;
```

### 2. 字級變數

```scss
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-size-2xl: 24px;
```

### 3. 間距變數

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-base: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
```

### 4. 圓角變數

```scss
$border-radius-sm: 4px;
$border-radius-base: 8px;
$border-radius-lg: 12px;
$border-radius-xl: 16px;
```

## 🚀 使用方式

### 1. 在 Vue 組件中使用

```vue
<template>
  <div class="my-component">
    <h1>標題</h1>
    <p>內容</p>
  </div>
</template>

<style lang="scss" scoped>
.my-component {
  // 直接使用 SCSS 變數
  color: $color-text-primary;
  background: $color-bg-primary;
  padding: $spacing-base;
  border-radius: $border-radius-lg;

  h1 {
    font-size: $font-size-xl;
    color: $color-primary;
    margin-bottom: $spacing-sm;
  }

  p {
    font-size: $font-size-base;
    color: $color-text-secondary;
    line-height: 1.5;
  }
}
</style>
```

### 2. 使用工具類

```vue
<template>
  <!-- 使用預定義的工具類 -->
  <div class="text-primary bg-white rounded-lg p-base">
    <h2 class="text-xl font-semibold">標題</h2>
    <p class="text-secondary">副標題</p>
  </div>
</template>
```

### 3. 使用響應式混入

```vue
<style lang="scss" scoped>
.responsive-component {
  padding: $spacing-sm;

  @include tablet-up {
    padding: $spacing-base;
  }

  @include desktop-up {
    padding: $spacing-lg;
  }
}
</style>
```

## 🎯 最佳實踐

### 1. 優先使用 SCSS 變數

```scss
// ✅ 推薦：使用 SCSS 變數
.my-component {
  color: $color-primary;
  background: $color-bg-primary;
}

// ❌ 避免：硬編碼值
.my-component {
  color: #155dfc;
  background: #ffffff;
}
```

### 2. 使用語義化變數

```scss
// ✅ 推薦：使用語義化變數
.text-primary {
  color: $color-text-primary;
}

// ❌ 避免：使用具體色彩變數
.text-primary {
  color: $color-black;
}
```

### 3. 合理使用工具類

```vue
<template>
  <!-- ✅ 推薦：簡單樣式使用工具類 -->
  <div class="text-center p-base bg-white rounded-lg">內容</div>

  <!-- ✅ 推薦：複雜樣式使用自定義 CSS -->
  <div class="custom-card">複雜內容</div>
</template>

<style lang="scss" scoped>
.custom-card {
  // 複雜的樣式邏輯
  display: flex;
  flex-direction: column;
  gap: $spacing-base;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
}
</style>
```

## 🔧 配置說明

### 1. Vite 全局導入

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

### 2. 樣式入口文件

```scss
// styles/index.scss
@import './variables.scss'; // 變數定義
@import './global.scss'; // 全局樣式
@import './vant-theme.scss'; // Vant 主題
@import './utilities.scss'; // 工具類
@import './animations.scss'; // 動畫
@import './breakpoints.scss'; // 響應式
```

## 📋 變數命名規範

### 1. 色彩變數

```scss
// 格式：$color-{語義}-{變化}
$color-primary: #155dfc; // 主要色
$color-text-primary: $color-black; // 主要文字色
$color-bg-primary: $color-white; // 主要背景色
$color-red-1: #fb2c36; // 紅色主色
$color-red-2: #fef2f2; // 紅色淺色
```

### 2. 字級變數

```scss
// 格式：$font-size-{大小}
$font-size-xs: 12px; // 超小
$font-size-sm: 14px; // 小
$font-size-base: 16px; // 基礎
$font-size-lg: 18px; // 大
$font-size-xl: 20px; // 超大
$font-size-2xl: 24px; // 特大
```

### 3. 間距變數

```scss
// 格式：$spacing-{大小}
$spacing-xs: 4px; // 超小間距
$spacing-sm: 8px; // 小間距
$spacing-base: 16px; // 基礎間距
$spacing-lg: 24px; // 大間距
$spacing-xl: 32px; // 超大間距
```

## 🎨 工具類系統

### 1. 文字工具類

```scss
.text-primary {
  color: $color-text-primary;
}
.text-secondary {
  color: $color-text-secondary;
}
.text-success {
  color: $color-success;
}
.text-danger {
  color: $color-danger;
}
.text-warning {
  color: $color-warning;
}
.text-info {
  color: $color-info;
}
```

### 2. 字級工具類

```scss
.text-xs {
  font-size: $font-size-xs;
}
.text-sm {
  font-size: $font-size-sm;
}
.text-base {
  font-size: $font-size-base;
}
.text-lg {
  font-size: $font-size-lg;
}
.text-xl {
  font-size: $font-size-xl;
}
.text-2xl {
  font-size: $font-size-2xl;
}
```

### 3. 間距工具類

```scss
.p-xs {
  padding: $spacing-xs;
}
.p-sm {
  padding: $spacing-sm;
}
.p {
  padding: $spacing-base;
}
.p-lg {
  padding: $spacing-lg;
}
.p-xl {
  padding: $spacing-xl;
}
```

## 🔄 遷移指南

### 從 CSS 變數遷移到 SCSS 變數

```scss
// 之前（CSS 變數）
.my-component {
  color: var(--color-primary);
  background: var(--color-bg-primary);
}

// 現在（SCSS 變數）
.my-component {
  color: $color-primary;
  background: $color-bg-primary;
}
```

## 🐛 故障排除

### 1. 變數無法使用

**問題**: SCSS 變數未定義

**解決方案**:

- 檢查 `vite.config.ts` 中的 `additionalData` 配置
- 確認 `variables.scss` 文件存在
- 重啟開發服務器

### 2. 樣式不生效

**問題**: 樣式沒有應用

**解決方案**:

- 檢查 SCSS 語法是否正確
- 確認變數名稱是否正確
- 查看瀏覽器開發者工具

### 3. 工具類衝突

**問題**: 工具類樣式被覆蓋

**解決方案**:

- 檢查 CSS 優先級
- 使用 `!important` 或更具體的選擇器
- 調整樣式順序

## 📚 相關資源

- [Sass 官方文檔](https://sass-lang.com/)
- [Vite CSS 預處理器](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Vant 4 主題定制](https://vant-ui.github.io/vant/#/zh-CN/theme)

## 🎉 總結

通過統一使用 SCSS 變數系統，我們實現了：

1. **一致性** - 統一的變數命名和使用方式
2. **可維護性** - 集中管理所有樣式變數
3. **開發效率** - 全局導入，無需手動 import
4. **類型安全** - 編譯時檢查，減少錯誤
5. **性能優化** - 未使用的變數會被移除

現在您可以享受更統一、更高效的樣式開發體驗！
