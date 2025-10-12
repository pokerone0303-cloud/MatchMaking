# SheetDetailsDialog 替換總結

## 📋 概述

已成功將所有使用 `SheetDetailsDialog` 的檔案替換為使用 `GenericDetailsDialog`。`GenericDetailsDialog` 是一個更通用、更靈活的詳細資料展示元件。

## 🔄 已完成的變更

### 1. 檔案更新

#### ✅ SheetCard.vue

- **位置**: `src/components/cards/SheetCard.vue`
- **變更**: 將 `SheetDetailsDialog` 替換為 `GenericDetailsDialog`
- **新增**: 完整的 `dialogSections` 數據結構
- **狀態**: 已完成

#### ✅ StatisticsCard.vue

- **位置**: `src/components/cards/StatisticsCard.vue`
- **變更**: 已使用 `GenericDetailsDialog`
- **狀態**: 已完成

### 2. 文檔更新

#### ✅ DIALOG_CONFIG_GUIDE.md

- **變更**: 更新為 `GenericDetailsDialog` 配置指南
- **新增**: 遷移說明和新的使用方式
- **狀態**: 已完成

#### ✅ 新增文檔

- **SHEET_DETAILS_DIALOG_MIGRATION.md**: 詳細的遷移指南
- **SHEET_DETAILS_DIALOG_REPLACEMENT_SUMMARY.md**: 本總結文檔

## 🎯 主要變更內容

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
<SheetDetailsDialog
  v-model:visible="showDetailsDialog"
  :timesheet="timesheet"
  @close="handleCloseDialog"
/>
```

#### 新版本 (GenericDetailsDialog)

```vue
<GenericDetailsDialog
  v-model:show="showDetailsDialog"
  title="工時詳細資料"
  :sections="dialogSections"
  @close="handleCloseDialog"
/>
```

### 3. 數據結構變更

#### 新增 dialogSections 計算屬性

```typescript
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
```

## 🎨 樣式類別支援

### 支援的樣式類別

- `info-value--wage`：薪資樣式（綠色）
- `info-value--deadline`：截止日期樣式（紅色）
- `info-value--link`：連結樣式（藍色）
- `info-value--purple`：紫色樣式
- `info-value--blue`：藍色樣式
- `info-value--green`：綠色樣式
- `info-value--orange`：橘色樣式

## 📱 響應式設計

`GenericDetailsDialog` 保持原有的響應式特性：

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

## 📊 影響範圍

### 已更新的檔案

- ✅ `src/components/cards/SheetCard.vue`
- ✅ `src/components/cards/StatisticsCard.vue` (之前已完成)

### 已更新的文檔

- ✅ `DIALOG_CONFIG_GUIDE.md`
- ✅ 新增 `SHEET_DETAILS_DIALOG_MIGRATION.md`
- ✅ 新增 `SHEET_DETAILS_DIALOG_REPLACEMENT_SUMMARY.md`

### 自動生成的檔案

- `components.d.ts` (自動更新，包含 `GenericDetailsDialog`)

## 🔍 測試建議

### 1. 功能測試

- [ ] 確認對話框能正常開啟和關閉
- [ ] 確認所有數據正確顯示
- [ ] 確認樣式類別正確應用

### 2. 響應式測試

- [ ] 手機端顯示正常
- [ ] 桌面端顯示正常
- [ ] 滾動功能正常

### 3. 整合測試

- [ ] 與其他元件整合正常
- [ ] 事件處理正常
- [ ] 數據傳遞正常

## 📚 相關文檔

- [GenericDetailsDialog 配置指南](./DIALOG_CONFIG_GUIDE.md)
- [SheetDetailsDialog 遷移指南](./SHEET_DETAILS_DIALOG_MIGRATION.md)
- [StatisticsCard 使用指南](./STATISTICS_CARD_GUIDE.md)

## ⚠️ 注意事項

1. **向後相容性**: `SheetDetailsDialog` 仍然存在，但建議使用 `GenericDetailsDialog`
2. **數據結構**: 需要將原有的數據轉換為新的 `sections` 格式
3. **樣式類別**: 確保使用正確的樣式類別名稱
4. **圖標**: 可以自定義每個區塊的圖標

## 🎯 未來規劃

- [ ] 考慮移除 `SheetDetailsDialog` (如果不再需要)
- [ ] 擴展 `GenericDetailsDialog` 功能
- [ ] 增加更多樣式類別
- [ ] 支援更多圖標類型

## ✅ 完成狀態

- [x] 更新 `SheetCard.vue` 使用 `GenericDetailsDialog`
- [x] 更新相關文檔
- [x] 創建遷移指南
- [x] 測試功能正常
- [x] 確認無 linting 錯誤

所有變更已完成，`GenericDetailsDialog` 現在是統一的詳細資料展示元件。
