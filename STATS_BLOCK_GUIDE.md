# StatsBlock 元件使用指南

## 概述

`StatsBlock` 是一個統計卡片區塊元件，基於 `EmployerStatsCard.vue` 的樣式設計，支援透過 props 傳入資料進行 v-for 渲染，並實現智慧佈局。

## 功能特色

- ✅ 使用 `EmployerStatsCard.vue` 的樣式設計
- ✅ 支援透過 props 傳入 `data Object[]` 進行 v-for 渲染
- ✅ 智慧佈局：左右平均分配，第三格自動展開全寬
- ✅ 不使用背景色，保持透明設計
- ✅ 支援點擊事件處理
- ✅ 響應式設計

## 基本使用

### 1. 引入元件

```vue
<script setup lang="ts">
import StatsBlock from '@/components/common/StatsBlock.vue'
</script>
```

### 2. 準備資料

```typescript
// 統計資料格式
interface StatItem {
  id: string // 唯一識別碼
  value: number // 數值
  label: string // 標籤文字
  color?: 'blue' | 'green' | 'orange' | 'purple' // 顏色主題
}

// 範例資料
const statsData = ref([
  {
    id: 'total-shifts',
    value: 5,
    label: '總振點數',
    color: 'blue' as const,
  },
  {
    id: 'operating',
    value: 3,
    label: '營運中',
    color: 'green' as const,
  },
])
```

### 3. 在模板中使用

```vue
<template>
  <div class="stats-section">
    <StatsBlock :data="statsData" @item-click="handleStatClick" />
  </div>
</template>
```

### 4. 處理點擊事件

```typescript
const handleStatClick = (item: StatItem) => {
  console.log('點擊統計項目:', item)
  // 處理點擊邏輯，例如跳轉到詳細頁面
}
```

## 佈局規則

### 智慧佈局邏輯

- **1 個項目**：佔滿全寬
- **2 個項目**：左右平均分配
- **3 個項目**：前兩個各佔一半，第三個佔全寬
- **4 個以上**：2x2 網格佈局

### 顏色主題

支援四種顏色主題：

- `blue`：藍色漸層（預設）
- `green`：綠色漸層
- `orange`：橘色漸層
- `purple`：紫色漸層

## 完整範例

```vue
<template>
  <div class="employer-statistics">
    <!-- 統計卡片區塊 -->
    <div class="employer-statistics__stats-section">
      <StatsBlock :data="statsData" @item-click="handleStatClick" />
    </div>

    <!-- 其他內容 -->
    <div class="content">
      <!-- ... -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StatsBlock from '@/components/common/StatsBlock.vue'

// 統計資料
const statsData = ref([
  {
    id: 'total-shifts',
    value: 5,
    label: '總振點數',
    color: 'blue' as const,
  },
  {
    id: 'operating',
    value: 3,
    label: '營運中',
    color: 'green' as const,
  },
  {
    id: 'applications',
    value: 12,
    label: '應徵人次',
    color: 'orange' as const,
  },
])

// 處理統計項目點擊
const handleStatClick = (item: StatItem) => {
  console.log('點擊統計項目:', item)
  // 可以在這裡處理點擊邏輯
}
</script>

<style lang="scss" scoped>
.employer-statistics {
  &__stats-section {
    padding: $spacing-16 $spacing-8;
    background: transparent;
  }
}
</style>
```

## Props 說明

| 屬性   | 類型         | 預設值 | 說明         |
| ------ | ------------ | ------ | ------------ |
| `data` | `StatItem[]` | `[]`   | 統計資料陣列 |

## Events 說明

| 事件名稱     | 參數             | 說明               |
| ------------ | ---------------- | ------------------ |
| `item-click` | `item: StatItem` | 點擊統計項目時觸發 |

## 樣式自訂

元件使用 SCSS 變數，可以透過修改 `variables.scss` 來自訂樣式：

```scss
// 自訂間距
.employer-statistics__stats-section {
  padding: $spacing-20 $spacing-12;
}

// 自訂背景
.employer-statistics__stats-section {
  background: $color-bg-gray;
  border-radius: $border-radius-lg;
}
```

## 注意事項

1. **資料格式**：確保 `data` 陣列中的每個項目都包含必要的 `id`、`value`、`label` 屬性
2. **顏色主題**：`color` 屬性必須是預定義的四種顏色之一，或留空使用預設藍色
3. **響應式設計**：元件已內建響應式設計，在桌面端會自動調整間距和字體大小
4. **透明背景**：元件本身不設定背景色，由父容器控制背景

## 與 EmployerStatsCard 的差異

| 特性     | EmployerStatsCard | StatsBlock     |
| -------- | ----------------- | -------------- |
| 用途     | 單一商家統計卡片  | 通用統計區塊   |
| 資料來源 | 固定 props        | 動態 data 陣列 |
| 佈局     | 固定 2x2 網格     | 智慧佈局       |
| 背景     | 白色卡片          | 透明           |
| 使用場景 | 商家個人頁面      | 通用統計顯示   |
