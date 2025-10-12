# SheetDetailsDialog 遷移指南

## 📋 概述

`SheetDetailsDialog` 已經被 `GenericDetailsDialog` 替代。`GenericDetailsDialog` 是一個更通用、更靈活的詳細資料展示元件，可以適用於各種場景。

## 🔄 遷移變更

### 1. 導入變更

```typescript
// ❌ 舊版本
import SheetDetailsDialog from '@/components/dialogs/SheetDetailsDialog.vue'

// ✅ 新版本
import GenericDetailsDialog from '../dialogs/GenericDetailsDialog.vue'
```

### 2. 使用方式變更

#### 舊版本 (SheetDetailsDialog)

```vue
<template>
  <SheetDetailsDialog
    v-model:visible="showDetailsDialog"
    :timesheet="timesheet"
    @close="handleCloseDialog"
  />
</template>
```

#### 新版本 (GenericDetailsDialog)

```vue
<template>
  <GenericDetailsDialog
    v-model:show="showDetailsDialog"
    title="工時詳細資料"
    :sections="dialogSections"
    @close="handleCloseDialog"
  />
</template>

<script setup>
// 需要定義對話框數據結構
const dialogSections = computed(() => [
  {
    title: '基本資訊',
    icon: '🕐',
    items: [
      { label: '工時單號', value: `TS${props.timesheet.id}` },
      { label: '工作日期', value: formattedDate.value },
      { label: '工作時間', value: formattedTime.value },
      { label: '商家', value: '金沙會館' },
      { label: '地點', value: `${props.timesheet.location} ${props.timesheet.address}` },
      { label: '職位', value: '百家樂荷官' },
    ],
  },
  {
    title: '工時統計',
    icon: '⏰',
    items: [
      {
        label: '正常工時',
        value: `${props.timesheet.workingHours} 小時`,
        valueClass: 'info-value--blue',
      },
      { label: '加班工時', value: '0 小時', valueClass: 'info-value--orange' },
      {
        label: '總工時',
        value: `${props.timesheet.workingHours} 小時`,
        valueClass: 'info-value--blue',
      },
    ],
  },
  {
    title: '薪資計算',
    icon: '💰',
    items: [
      { label: '基本時薪', value: '$600' },
      { label: '加班時薪', value: '$900' },
      { label: '基本薪資', value: `$${totalSalary.value}` },
      { label: '加班薪資', value: '$0' },
      { label: '總薪資', value: `$${totalSalary.value}`, valueClass: 'info-value--green' },
    ],
  },
  {
    title: '狀態資訊',
    icon: '📊',
    items: [
      { label: '狀態', value: statusConfig.value.text, valueClass: statusConfig.value.class },
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
</script>
```

## 🎯 主要差異

### Props 變更

| 舊版本 (SheetDetailsDialog) | 新版本 (GenericDetailsDialog) |
| --------------------------- | ----------------------------- |
| `v-model:visible`           | `v-model:show`                |
| `:timesheet`                | `:sections`                   |
| `:config` (可選)            | `:title` (必填)               |

### 數據結構變更

#### 舊版本

- 直接傳入 `timesheet` 物件
- 可選的 `config` 配置

#### 新版本

- 需要定義 `sections` 陣列
- 每個 section 包含 `title`、`icon`、`items`
- 每個 item 包含 `label`、`value`、`valueClass`

## 🔧 遷移步驟

### 1. 更新導入

```typescript
// 將 SheetDetailsDialog 改為 GenericDetailsDialog
import GenericDetailsDialog from '../dialogs/GenericDetailsDialog.vue'
```

### 2. 定義數據結構

```typescript
const dialogSections = computed(() => [
  // 根據需要定義各個區塊
])
```

### 3. 更新模板

```vue
<!-- 更新 props 和事件 -->
<GenericDetailsDialog
  v-model:show="showDetailsDialog"
  title="工時詳細資料"
  :sections="dialogSections"
  @close="handleCloseDialog"
/>
```

## 🎨 樣式類別支援

`GenericDetailsDialog` 支援以下樣式類別：

- `info-value--wage`：薪資樣式（綠色）
- `info-value--deadline`：截止日期樣式（紅色）
- `info-value--link`：連結樣式（藍色）
- `info-value--purple`：紫色樣式
- `info-value--blue`：藍色樣式
- `info-value--green`：綠色樣式
- `info-value--orange`：橘色樣式

## 📱 響應式設計

`GenericDetailsDialog` 繼承了原有的響應式設計：

- 手機端：90% 寬度，最大高度 70vh
- 桌面端：最大寬度 768px
- 自動滾動支援

## 🚀 優勢

### 1. 通用性

- 可適用於各種詳細資料展示場景
- 不局限於工時資料

### 2. 靈活性

- 支援自定義區塊結構
- 支援多種樣式類別
- 支援圖標顯示

### 3. 可維護性

- 統一的對話框元件
- 減少重複代碼
- 更好的類型安全

## 📚 相關文件

- [GenericDetailsDialog 使用指南](./STATISTICS_CARD_GUIDE.md#genericdetailsdialog-通用詳細窗口)
- [StatisticsCard 使用指南](./STATISTICS_CARD_GUIDE.md)

## ⚠️ 注意事項

1. **數據結構**：需要將原有的 `timesheet` 數據轉換為 `sections` 格式
2. **樣式類別**：確保使用正確的樣式類別名稱
3. **圖標**：可以自定義每個區塊的圖標
4. **響應式**：新元件保持原有的響應式特性

## 🔍 故障排除

### 常見問題

1. **導入錯誤**

   ```typescript
   // ❌ 錯誤
   import GenericDetailsDialog from '@/components/dialogs/GenericDetailsDialog.vue'

   // ✅ 正確
   import GenericDetailsDialog from '../dialogs/GenericDetailsDialog.vue'
   ```

2. **數據結構錯誤**
   - 確保 `sections` 陣列格式正確
   - 檢查 `items` 中的 `label` 和 `value` 屬性

3. **樣式不生效**
   - 檢查 `valueClass` 是否使用正確的類別名稱
   - 確保樣式類別在 `GenericDetailsDialog` 中有定義

## 🎯 遷移檢查清單

- [ ] 更新導入語句
- [ ] 定義 `dialogSections` 數據結構
- [ ] 更新模板中的 props
- [ ] 測試對話框功能
- [ ] 檢查樣式是否正確
- [ ] 驗證響應式設計
- [ ] 更新相關文檔
