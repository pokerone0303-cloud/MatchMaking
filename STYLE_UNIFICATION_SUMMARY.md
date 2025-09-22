# 樣式系統統一總結

## 🎯 統一方案

**採用 SCSS 變數作為統一樣式管理方式**

## ✅ 已完成的統一工作

### 1. 移除重複的 CSS 變數定義

**之前**：

```scss
// global.scss - 定義了大量 CSS 變數
:root {
  --color-primary: #{$color-primary};
  --color-success: #{$color-success};
  // ... 50+ 個 CSS 變數
}
```

**現在**：

```scss
// global.scss - 只保留 Vant 4 主題映射
:root {
  --van-primary-color: #{$color-primary};
  --van-success-color: #{$color-success};
  --van-warning-color: #{$color-warning};
  --van-danger-color: #{$color-danger};
  --van-info-color: #{$color-info};
}
```

### 2. 統一使用 SCSS 變數

**所有樣式文件現在都使用 SCSS 變數**：

```scss
// ✅ 統一使用 SCSS 變數
.my-component {
  color: $color-primary; // SCSS 變數
  background: $color-bg-primary; // SCSS 變數
  padding: $spacing-base; // SCSS 變數
  border-radius: $border-radius-lg; // SCSS 變數
}
```

## 🚀 統一後的優勢

### 1. 開發體驗提升

- **全局導入** - 無需手動 import
- **IDE 提示** - 完整的變數提示
- **類型安全** - 編譯時檢查

### 2. 性能優化

- **按需載入** - 只載入使用的變數
- **編譯優化** - 未使用的變數會被移除
- **更小的包體積** - 減少重複定義

### 3. 維護性提升

- **單一來源** - 所有變數定義在 `variables.scss`
- **易於修改** - 修改一處，全局生效
- **一致性** - 統一的命名和使用方式

## 📁 統一後的文件結構

```
src/styles/
├── index.scss          # 統一樣式入口
├── variables.scss      # SCSS 變數定義（核心）
├── global.scss         # 全局樣式 + Vant 4 主題映射
├── vant-theme.scss     # Vant 4 主題定制
├── utilities.scss      # 工具類樣式（使用 SCSS 變數）
├── animations.scss     # 動畫效果
├── breakpoints.scss    # 響應式斷點
└── color-guide.md      # 色彩使用指南（已更新）
```

## 🎨 使用方式

### 1. 在 Vue 組件中

```vue
<template>
  <div class="my-component">
    <h1>標題</h1>
    <p>內容</p>
  </div>
</template>

<style lang="scss" scoped>
.my-component {
  // 直接使用 SCSS 變數，無需 import
  color: $color-text-primary;
  background: $color-bg-primary;
  padding: $spacing-base;
  border-radius: $border-radius-lg;

  h1 {
    font-size: $font-size-xl;
    color: $color-primary;
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

## 🔧 配置說明

### Vite 全局導入配置

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

這確保了所有 SCSS 文件都能自動訪問變數，無需手動 import。

## 📋 變數命名規範

### 色彩變數

```scss
// 主要色彩
$color-primary: #155dfc;
$color-success: #00c951;
$color-warning: #f2994a;
$color-danger: #fb2c36;
$color-info: #909399;

// 語義化色彩
$color-text-primary: $color-black;
$color-bg-primary: $color-white;
```

### 字級變數

```scss
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-size-2xl: 24px;
```

### 間距變數

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-base: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
```

## 🎯 最佳實踐

### 1. 優先使用 SCSS 變數

```scss
// ✅ 推薦
.my-component {
  color: $color-primary;
  padding: $spacing-base;
}

// ❌ 避免
.my-component {
  color: #155dfc;
  padding: 16px;
}
```

### 2. 使用語義化變數

```scss
// ✅ 推薦
.text-primary {
  color: $color-text-primary;
}

// ❌ 避免
.text-primary {
  color: $color-black;
}
```

### 3. 合理使用工具類

```vue
<!-- ✅ 簡單樣式使用工具類 -->
<div class="text-center p-base bg-white rounded-lg">
  內容
</div>

<!-- ✅ 複雜樣式使用自定義 CSS -->
<div class="custom-card">
  複雜內容
</div>
```

## 🎉 總結

通過統一使用 SCSS 變數系統，我們實現了：

1. **一致性** - 統一的變數命名和使用方式
2. **簡潔性** - 移除了重複的 CSS 變數定義
3. **效率性** - 全局導入，無需手動 import
4. **維護性** - 集中管理，易於修改
5. **性能** - 按需載入，編譯優化

現在您的樣式系統更加統一、高效且易於維護！
