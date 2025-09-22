# 色彩系統使用指南

## 概述

本專案基於設計稿定義了完整的色彩系統，包含主要色彩、中性色彩、狀態色彩以及語義化色彩映射。

## 色彩分類

### 1. 主要色彩系統

| 色彩名稱 | CSS 變數          | SCSS 變數        | 色值      | 用途                 |
| -------- | ----------------- | ---------------- | --------- | -------------------- |
| 主要色   | `--color-primary` | `$color-primary` | `#155DFC` | 主要動作按鈕、連結   |
| 成功色   | `--color-success` | `$color-success` | `#00C951` | 成功狀態、確認動作   |
| 警告色   | `--color-warning` | `$color-warning` | `#F2994A` | 警告提示、待處理狀態 |
| 危險色   | `--color-danger`  | `$color-danger`  | `#FB2C36` | 錯誤狀態、刪除動作   |
| 資訊色   | `--color-info`    | `$color-info`    | `#909399` | 次要資訊、說明文字   |

### 2. 中性色彩

| 色彩名稱 | CSS 變數         | SCSS 變數       | 色值      | 用途                 |
| -------- | ---------------- | --------------- | --------- | -------------------- |
| 白色     | `--color-white`  | `$color-white`  | `#FFFFFF` | 背景色、卡片背景     |
| 黑色     | `--color-black`  | `$color-black`  | `#030213` | 主要文字、標題       |
| 灰色1    | `--color-gray-1` | `$color-gray-1` | `#E9E9E9` | 邊框、分割線         |
| 灰色2    | `--color-gray-2` | `$color-gray-2` | `#F3F3F5` | 次要背景、輸入框背景 |

### 3. 主色調變化

| 色彩名稱   | CSS 變數         | SCSS 變數       | 色值      | 用途               |
| ---------- | ---------------- | --------------- | --------- | ------------------ |
| 主色調淺色 | `--color-main-1` | `$color-main-1` | `#F6FAFF` | 特殊背景、強調區域 |

### 4. 狀態色彩變化

| 色彩名稱 | CSS 變數          | SCSS 變數        | 色值      | 用途               |
| -------- | ----------------- | ---------------- | --------- | ------------------ |
| 紅色主色 | `--color-red-1`   | `$color-red-1`   | `#FB2C36` | 錯誤文字、危險標籤 |
| 紅色淺色 | `--color-red-2`   | `$color-red-2`   | `#FEF2F2` | 錯誤背景、警告區域 |
| 綠色主色 | `--color-green-1` | `$color-green-1` | `#00C951` | 成功文字、確認標籤 |
| 綠色淺色 | `--color-green-2` | `$color-green-2` | `#F0FDF4` | 成功背景、確認區域 |
| 藍色主色 | `--color-blue-1`  | `$color-blue-1`  | `#155DFC` | 主要文字、連結     |
| 藍色淺色 | `--color-blue-2`  | `$color-blue-2`  | `#DBEAFE` | 主要背景、資訊區域 |

## 使用方式

### 1. SCSS 變數使用（推薦）

```scss
.my-component {
  color: $color-primary;
  background: $color-bg-primary;
  border: 1px solid $color-gray-1;
}
```

### 2. Vue 組件中使用

```vue
<template>
  <div class="status-card">
    <div class="status-card__title">狀態標題</div>
    <div class="status-card__content">內容</div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.status-card {
  background: $color-white;
  border: 1px solid $color-gray-1;
  border-radius: $border-radius-lg;
  padding: $spacing-base;

  &__title {
    color: $color-text-primary;
    font-size: $font-size-lg;
    font-weight: 600;
  }

  &__content {
    color: $color-text-secondary;
    font-size: $font-size-base;
  }
}
</style>
```

## 語義化色彩映射

為了提高開發效率，我們定義了語義化的色彩映射：

| 語義     | CSS 變數                 | SCSS 變數               | 對應色彩   | 用途                 |
| -------- | ------------------------ | ----------------------- | ---------- | -------------------- |
| 主要文字 | `--color-text-primary`   | `$color-text-primary`   | 黑色       | 標題、重要文字       |
| 次要文字 | `--color-text-secondary` | `$color-text-secondary` | 灰色1      | 說明文字、副標題     |
| 主要背景 | `--color-bg-primary`     | `$color-bg-primary`     | 白色       | 頁面背景、卡片背景   |
| 次要背景 | `--color-bg-secondary`   | `$color-bg-secondary`   | 灰色2      | 輸入框背景、次要區域 |
| 強調背景 | `--color-bg-accent`      | `$color-bg-accent`      | 主色調淺色 | 特殊強調區域         |

## Vant 4 整合

本色彩系統已與 Vant 4 主題系統整合，Vant 組件會自動使用定義的色彩：

```scss
// Vant 4 主題變數自動映射
--van-primary-color: #{$color-primary};
--van-success-color: #{$color-success};
--van-warning-color: #{$color-warning};
--van-danger-color: #{$color-danger};
--van-info-color: #{$color-info};
```

## 最佳實踐

1. **優先使用語義化色彩**：使用 `$color-text-primary` 而不是 `$color-black`
2. **保持一致性**：同類型的元素使用相同的色彩變數
3. **考慮可訪問性**：確保文字與背景的對比度足夠
4. **響應式設計**：在不同設備上測試色彩效果
5. **主題切換**：預留主題切換的擴展性

## 擴展指南

如需添加新色彩：

1. 在 `variables.scss` 中定義 SCSS 變數
2. 在 `global.scss` 中定義對應的 CSS 變數
3. 更新本指南文件
4. 考慮是否需要添加到 Vant 主題配置中
