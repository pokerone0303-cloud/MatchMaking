# GenericDetailsDialog 配置指南

## 概述

⚠️ **重要通知**: `SheetDetailsDialog` 已經被 `GenericDetailsDialog` 替代。`GenericDetailsDialog` 是一個更通用、更靈活的詳細資料展示元件，可以適用於各種場景。

## 遷移說明

如果您正在使用 `SheetDetailsDialog`，請參考 [SheetDetailsDialog 遷移指南](./SHEET_DETAILS_DIALOG_MIGRATION.md) 來了解如何遷移到 `GenericDetailsDialog`。

## 基本使用

### 1. 基本使用

```vue
<template>
  <GenericDetailsDialog
    v-model:show="showDialog"
    title="工時詳細資料"
    :sections="dialogSections"
    @close="handleClose"
  />
</template>

<script setup>
import { computed } from 'vue'
import GenericDetailsDialog from '@/components/dialogs/GenericDetailsDialog.vue'

const dialogSections = computed(() => [
  {
    title: '基本資訊',
    icon: '🕐',
    items: [
      { label: '工時單號', value: 'TS001' },
      { label: '工作日期', value: '2024/09/13' },
      { label: '工作時間', value: '20:00 - 02:00' },
      { label: '商家', value: '金沙會館' },
      { label: '地點', value: '台北中山店' },
      { label: '職位', value: '百家樂荷官' },
    ],
  },
  {
    title: '工時統計',
    icon: '⏰',
    items: [
      { label: '正常工時', value: '6 小時', valueClass: 'info-value--blue' },
      { label: '加班工時', value: '0 小時', valueClass: 'info-value--orange' },
      { label: '總工時', value: '6 小時', valueClass: 'info-value--blue' },
    ],
  },
  {
    title: '薪資計算',
    icon: '💰',
    items: [
      { label: '基本時薪', value: '$600' },
      { label: '基本薪資', value: '$3600' },
      { label: '總薪資', value: '$3600', valueClass: 'info-value--green' },
    ],
  },
])
</script>
```

## 數據結構

### Section 類型定義

```typescript
interface Section {
  title: string // 區塊標題
  icon: string // 區塊圖標
  items: SectionItem[] // 區塊項目
}

interface SectionItem {
  label: string // 項目標籤
  value: string // 項目值
  valueClass?: string // 值的樣式類別
}
```

### 基本區塊結構

```typescript
{
  title: '基本資訊',
  icon: '🕐',
  items: [
    { label: '工時單號', value: 'TS20240913' },
    { label: '狀態', value: '待審核', valueClass: 'info-value--wage' }
  ]
}
```

## 樣式類別

### 支援的樣式類別

- `info-value--wage`：薪資樣式（綠色）
- `info-value--deadline`：截止日期樣式（紅色）
- `info-value--link`：連結樣式（藍色）
- `info-value--purple`：紫色樣式
- `info-value--blue`：藍色樣式
- `info-value--green`：綠色樣式
- `info-value--orange`：橘色樣式

### 使用範例

```typescript
{
  title: '薪資計算',
  icon: '💰',
  items: [
    { label: '基本時薪', value: '$600' },
    { label: '基本薪資', value: '$3600', valueClass: 'info-value--green' },
    { label: '總薪資', value: '$3600', valueClass: 'info-value--green' }
  ]
}
```

## 完整範例

```vue
<template>
  <GenericDetailsDialog
    v-model:show="showDialog"
    title="工時詳細資料"
    :sections="dialogSections"
    @close="handleClose"
  />
</template>

<script setup>
import { computed } from 'vue'
import GenericDetailsDialog from '@/components/dialogs/GenericDetailsDialog.vue'

const dialogSections = computed(() => [
  {
    title: '基本資訊',
    icon: '🕐',
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
    title: '工時統計',
    icon: '⏰',
    items: [
      { label: '正常工時', value: '6 小時', valueClass: 'info-value--blue' },
      { label: '加班工時', value: '0 小時', valueClass: 'info-value--orange' },
      { label: '總工時', value: '6 小時', valueClass: 'info-value--blue' },
    ],
  },
  {
    title: '薪資計算',
    icon: '💰',
    items: [
      { label: '基本時薪', value: '$600' },
      { label: '基本薪資', value: '$3600' },
      { label: '總薪資', value: '$3600', valueClass: 'info-value--green' },
    ],
  },
  {
    title: '狀態資訊',
    icon: '📊',
    items: [
      { label: '狀態', value: '待審核', valueClass: 'info-value--wage' },
      { label: '記錄時間', value: '2024/9/14 上午8:20:00' },
    ],
  },
  {
    title: '備註資訊',
    icon: '📝',
    items: [
      { label: '職位要求', value: '五年以上經驗' },
      { label: '備註', value: '深夜班,客流量較大' },
    ],
  },
])

const handleClose = () => {
  showDialog.value = false
}
</script>
```

## 最佳實踐

1. **保持一致性**: 在整個應用中使用相同的區塊結構
2. **適當分組**: 將相關資訊放在同一個區塊中
3. **使用樣式類別**: 利用預定義的樣式類別來突出重要資訊
4. **考慮用戶體驗**: 將最重要的資訊放在前面
5. **響應式設計**: 確保在不同螢幕尺寸下都能正常顯示
6. **圖標選擇**: 選擇合適的圖標來增強視覺識別

## 優勢

### 1. 通用性

- 可適用於各種詳細資料展示場景
- 不局限於特定業務邏輯

### 2. 靈活性

- 支援自定義區塊結構
- 支援多種樣式類別
- 支援圖標顯示

### 3. 可維護性

- 統一的對話框元件
- 減少重複代碼
- 更好的類型安全

## 相關文件

- [SheetDetailsDialog 遷移指南](./SHEET_DETAILS_DIALOG_MIGRATION.md)
- [StatisticsCard 使用指南](./STATISTICS_CARD_GUIDE.md)
