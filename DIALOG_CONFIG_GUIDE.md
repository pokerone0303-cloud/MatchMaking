# SheetDetailsDialog 配置指南

## 概述

`SheetDetailsDialog` 組件現在支援通過 `config` prop 傳入自訂配置，讓您可以靈活地定義對話框的內容和樣式。

## 基本使用

### 1. 使用預設配置（不傳入 config）

```vue
<template>
  <SheetDetailsDialog
    :visible="showDialog"
    :timesheet="selectedTimesheet"
    @update:visible="showDialog = $event"
    @close="handleClose"
  />
</template>
```

### 2. 使用自訂配置

```vue
<template>
  <SheetDetailsDialog
    :visible="showDialog"
    :timesheet="selectedTimesheet"
    :config="customConfig"
    @update:visible="showDialog = $event"
    @close="handleClose"
  />
</template>

<script setup>
import { ref } from 'vue';
import type { DialogConfig } from '@/types/dialog';

const customConfig: DialogConfig = {
  title: '自訂標題',
  blocks: [
    {
      type: 'section',
      title: '基本資訊',
      items: [
        { label: '編號', value: 'TS001' },
        { label: '日期', value: '2024/09/13' }
      ]
    }
  ]
};
</script>
```

## 區塊類型

### 1. section（一般區塊）

用於顯示標籤-值對的資訊。

```typescript
{
  type: 'section',
  title: '基本資訊',
  items: [
    { label: '工時單號', value: 'TS20240913' },
    { label: '狀態', value: '待審核', valueClass: 'status-pending' }
  ]
}
```

### 2. highlight（重點區域）

用於突出顯示重要資訊。

```typescript
{
  type: 'highlight',
  title: '職位要求',
  content: '五年以上經驗',
  contentClass: 'highlight-requirement'
}
```

### 3. remark（備註）

用於顯示備註或說明文字。

```typescript
{
  type: 'remark',
  title: '備註',
  content: '深夜班,客流量較大',
  contentClass: 'remark-content'
}
```

## 樣式類別

### 狀態標籤樣式

- `status-pending`: 待審核（橘色）
- `status-approved`: 已核准（綠色）
- `status-adjusted`: 已調整（藍色）
- `status-accepted`: 錄取（綠色）
- `status-rejected`: 未錄取（紅色）
- `status-withdrawn`: 撤回（灰色）

### 文字顏色樣式

- `text-blue`: 藍色文字
- `text-orange`: 橘色文字
- `text-green`: 綠色文字
- `text-red`: 紅色文字

### 內容區域樣式

- `highlight-requirement`: 職位要求樣式（黃色背景）
- `remark-content`: 備註內容樣式（灰色背景）

## 完整範例

```typescript
import type { DialogConfig } from '@/types/dialog'

const exampleConfig: DialogConfig = {
  title: '工時詳細資料',
  blocks: [
    {
      type: 'section',
      title: '基本資訊',
      items: [
        { label: '工時單號', value: 'TS20240913' },
        { label: '工作日期', value: '2024/09/13' },
        { label: '工作時間', value: '20:00 - 02:00' },
        { label: '商家', value: '金沙會館' },
        { label: '地點', value: '台北中山店' },
        { label: '職位', value: '百家樂荷官' },
      ],
    },
    {
      type: 'section',
      title: '工時統計',
      items: [
        { label: '正常工時', value: '6 小時', valueClass: 'text-blue' },
        { label: '加班工時', value: '0 小時', valueClass: 'text-orange' },
        { label: '總工時', value: '6 小時', valueClass: 'text-blue' },
      ],
    },
    {
      type: 'section',
      title: '薪資計算',
      items: [
        { label: '基本時薪', value: '$600' },
        { label: '基本薪資', value: '$3600' },
        { label: '總薪資', value: '$3600', valueClass: 'text-green' },
      ],
    },
    {
      type: 'section',
      title: '狀態資訊',
      items: [
        { label: '狀態', value: '待審核', valueClass: 'status-pending' },
        { label: '記錄時間', value: '2024/9/14 上午8:20:00' },
      ],
    },
    {
      type: 'highlight',
      title: '職位要求',
      content: '五年以上經驗',
      contentClass: 'highlight-requirement',
    },
    {
      type: 'remark',
      title: '備註',
      content: '深夜班,客流量較大',
      contentClass: 'remark-content',
    },
  ],
}
```

## 最佳實踐

1. **保持一致性**: 在整個應用中使用相同的配置結構
2. **適當分組**: 將相關資訊放在同一個區塊中
3. **使用樣式類別**: 利用預定義的樣式類別來突出重要資訊
4. **考慮用戶體驗**: 將最重要的資訊放在前面
5. **響應式設計**: 確保在不同螢幕尺寸下都能正常顯示

## 擴展性

如果需要添加新的區塊類型或樣式，可以：

1. 在 `src/types/dialog.ts` 中添加新的類型定義
2. 在組件模板中添加對應的渲染邏輯
3. 在樣式文件中添加新的樣式類別

這種設計讓組件既保持了靈活性，又確保了類型安全和一致性。
