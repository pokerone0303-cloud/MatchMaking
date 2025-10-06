# BackToTop 回到頂部按鈕組件指南

## 概述

`BackToTop` 是一個可重用的懸浮按鈕組件，用於快速回到頁面頂部。組件具有智能顯示邏輯和流暢的動畫效果。

## 功能特點

- ✅ **智能顯示**：滾動超過 300px 時自動顯示
- ✅ **流暢動畫**：平滑滾動到頂部
- ✅ **響應式設計**：適配不同螢幕尺寸
- ✅ **懸浮效果**：hover 和 active 狀態動畫
- ✅ **淡入淡出**：顯示/隱藏時的過渡動畫
- ✅ **可重用組件**：可在任何頁面使用

## 基本使用

### 1. 在 App.vue 中使用（全域）

```vue
<template>
  <div class="app">
    <!-- 其他內容 -->
    <BackToTop />
  </div>
</template>

<script setup>
import BackToTop from '@/components/common/BackToTop.vue'
</script>
```

### 2. 在特定頁面中使用

```vue
<template>
  <div class="page">
    <!-- 頁面內容 -->
    <BackToTop />
  </div>
</template>

<script setup>
import BackToTop from '@/components/common/BackToTop.vue'
</script>
```

## 組件特性

### 顯示邏輯

- 當頁面滾動超過 **300px** 時，按鈕會自動顯示
- 當滾動回到頂部附近時，按鈕會自動隱藏
- 使用 `fade` 過渡動畫，提供流暢的顯示/隱藏效果

### 定位和樣式

- **位置**：固定在右側中下位置
- **大小**：48px × 48px（移動端 52px × 52px）
- **樣式**：圓形按鈕，主色調背景
- **圖標**：向上箭頭圖標
- **陰影**：提供立體感

### 響應式設計

- **桌面端**：右側 24px，底部 24px
- **移動端**：右側 12px，底部 16px
- **觸控優化**：移動端按鈕稍大，提供更好的觸控體驗

## 動畫效果

### 1. 顯示/隱藏動畫

```scss
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
```

### 2. 懸浮效果

```scss
&:hover {
  background: $color-primary-dark;
  transform: translateY(-2px);
  box-shadow: $shadow-xl;
}

&:active {
  transform: translateY(0);
}
```

## 自訂配置

如果需要自訂按鈕行為，可以通過修改組件來實現：

### 1. 修改顯示閾值

```typescript
// 修改滾動距離閾值（預設 300px）
const handleScroll = () => {
  isVisible.value = window.scrollY > 500 // 改為 500px
}
```

### 2. 修改滾動行為

```typescript
// 修改滾動動畫（預設 smooth）
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'auto', // 改為瞬間滾動
  })
}
```

### 3. 自訂樣式

```scss
.back-to-top {
  // 修改位置
  right: 20px;
  bottom: 30px;

  // 修改大小
  width: 56px;
  height: 56px;

  // 修改顏色
  background: $color-success;
}
```

## 最佳實踐

1. **全域使用**：建議在 `App.vue` 中使用，確保所有頁面都有此功能
2. **避免重複**：不要在單個頁面中重複使用此組件
3. **考慮內容**：確保按鈕不會遮擋重要內容
4. **測試體驗**：在不同設備上測試滾動和點擊體驗

## 技術實現

### 核心功能

- 使用 `window.scrollTo()` API 實現平滑滾動
- 使用 `window.addEventListener('scroll')` 監聽滾動事件
- 使用 Vue 3 的 `Transition` 組件實現動畫

### 性能優化

- 在組件卸載時自動移除事件監聽器
- 使用 `ref` 響應式變數控制顯示狀態
- 使用 CSS 動畫而非 JavaScript 動畫

### 可訪問性

- 提供足夠的觸控區域（最小 44px × 44px）
- 使用語義化的圖標（向上箭頭）
- 提供視覺反饋（hover 和 active 狀態）

## 瀏覽器支援

- ✅ Chrome 61+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ 移動端瀏覽器

## 注意事項

1. **滾動容器**：組件監聽的是 `window` 的滾動事件，適用於整頁滾動
2. **Z-index**：按鈕的 z-index 為 `$z-index-fixed`，確保在其他元素之上
3. **性能**：滾動事件會頻繁觸發，但組件已做優化處理
4. **兼容性**：使用現代瀏覽器 API，不支援舊版瀏覽器

這個組件提供了完整的回到頂部功能，具有良好的用戶體驗和可維護性。
