# StatisticsCard 統計卡片元件使用指南

## 📋 概述

`StatisticsCard` 是一個按照設計稿重新設計的統計卡片元件，用於顯示每日統計資料，包含頂部標題、重要統計、顯示資料、備註欄位等分區塊設計。

## 🎯 主要功能

- **分區塊設計**：按照設計稿分為多個功能區塊
- **響應式佈局**：支援手機和桌面端顯示
- **詳細資料窗口**：點擊詳細按鈕開啟通用詳細窗口
- **數據展示**：支援多種統計數據的視覺化展示

## 📦 元件結構

### 分區塊設計

1. **頂部標題區域**
   - 日期顯示
   - ID 編號
   - 總支出金額

2. **重要統計區域**
   - 班別數（藍色）
   - 應徵數（綠色）
   - 工時（橘色）

3. **顯示資料區域**
   - 完成率、錄取率（第一行）
   - 平均時薪、主要地點（第二行）

4. **備註欄位**
   - 每日備註內容

5. **分隔線**

6. **統計時間和詳細按鈕**
   - 統計時間顯示
   - 詳細按鈕（開啟詳細窗口）

## 🚀 使用方法

### 基本使用

```vue
<template>
  <StatisticsCard
    :timesheet="timesheetData"
    :show-details="true"
    @view-details="handleViewDetails"
    @edit="handleEdit"
  />
</template>

<script setup>
import StatisticsCard from '@/components/cards/StatisticsCard.vue'

const timesheetData = {
  id: 'DS20240915',
  date: '2024-09-15',
  workingHours: 8,
  adjustedHours: 8,
  startTime: '09:00',
  endTime: '17:00',
  location: '台北信義店',
  address: '台北市信義區信義路五段7號',
  status: 'approved',
}

const handleViewDetails = (timesheet) => {
  console.log('查看詳細資料:', timesheet)
}

const handleEdit = (timesheet) => {
  console.log('編輯資料:', timesheet)
}
</script>
```

### Props 參數

| 參數          | 類型              | 預設值 | 說明                 |
| ------------- | ----------------- | ------ | -------------------- |
| `timesheet`   | `TimesheetRecord` | -      | 工時記錄資料（必填） |
| `showDetails` | `boolean`         | `true` | 是否顯示詳細按鈕     |

### Events 事件

| 事件名        | 參數                         | 說明               |
| ------------- | ---------------------------- | ------------------ |
| `viewDetails` | `timesheet: TimesheetRecord` | 點擊詳細按鈕時觸發 |
| `edit`        | `timesheet: TimesheetRecord` | 編輯資料時觸發     |

## 🎨 樣式自定義

### CSS 變數

元件使用 SCSS 變數，可通過修改 `variables.scss` 來自定義樣式：

```scss
// 主要顏色
$color-blue-1: #2f80ed; // 班別數顏色
$color-green-1: #27ae60; // 應徵數、總支出顏色
$color-orange-1: #f2994a; // 工時顏色
$color-purple-1: #9b59b6; // 平均時薪顏色

// 間距
$spacing-16: 16px;
$spacing-12: 12px;
$spacing-8: 8px;
```

### 響應式設計

```scss
// 桌面端樣式調整
@media (min-width: 768px) {
  .statistics-card {
    padding: $spacing-20;

    &__stats {
      padding: $spacing-16 0;
    }

    &__data-row {
      justify-content: flex-start;
      gap: $spacing-24;
    }
  }
}
```

## 🔧 GenericDetailsDialog 通用詳細窗口

### 功能特點

- **通用性**：可適用於各種詳細資料展示
- **分區塊**：支援多個資訊區塊
- **自定義**：可自定義標題、圖標、內容
- **響應式**：支援手機和桌面端

### 使用方法

```vue
<template>
  <GenericDetailsDialog
    v-model:show="showDialog"
    title="統計詳細資料"
    :sections="dialogSections"
    @close="handleClose"
  />
</template>

<script setup>
import GenericDetailsDialog from '@/components/dialogs/GenericDetailsDialog.vue'

const showDialog = ref(false)

const dialogSections = [
  {
    title: '基本統計',
    icon: '📊',
    items: [
      { label: '班別數', value: '12' },
      { label: '應徵數', value: '45' },
      { label: '工時', value: '68小時' },
      { label: '總支出', value: '$34,500' },
    ],
  },
  {
    title: '績效指標',
    icon: '📈',
    items: [
      { label: '完成率', value: '83%' },
      { label: '錄取率', value: '62%' },
      { label: '平均時薪', value: '$507', valueClass: 'info-value--purple' },
      { label: '主要地點', value: '台北信義店' },
    ],
  },
]

const handleClose = () => {
  showDialog.value = false
}
</script>
```

### Props 參數

| 參數       | 類型        | 預設值  | 說明           |
| ---------- | ----------- | ------- | -------------- |
| `show`     | `boolean`   | `false` | 是否顯示對話框 |
| `title`    | `string`    | -       | 對話框標題     |
| `sections` | `Section[]` | -       | 區塊資料陣列   |

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

### 支援的樣式類別

- `info-value--wage`：薪資樣式（綠色）
- `info-value--deadline`：截止日期樣式（紅色）
- `info-value--link`：連結樣式（藍色）
- `info-value--purple`：紫色樣式
- `info-value--blue`：藍色樣式
- `info-value--green`：綠色樣式
- `info-value--orange`：橘色樣式

## 📱 響應式設計

### 手機端（< 768px）

- 單列佈局
- 緊湊間距
- 觸控友好的按鈕大小

### 桌面端（≥ 768px）

- 多列佈局
- 增加間距
- 更好的視覺層次

## 🎯 最佳實踐

### 1. 數據結構

```typescript
// 確保 TimesheetRecord 包含必要欄位
interface TimesheetRecord {
  id: string
  date: string
  workingHours: number
  adjustedHours?: number
  startTime: string
  endTime: string
  location: string
  address: string
  status: 'submitted' | 'approved' | 'adjusted' | 'pending' | 'accepted' | 'rejected' | 'withdrawn'
}
```

### 2. 事件處理

```javascript
// 建議的事件處理方式
const handleViewDetails = (timesheet) => {
  // 記錄用戶行為
  analytics.track('view_statistics_details', { timesheetId: timesheet.id })

  // 開啟詳細窗口
  showDetailsDialog.value = true
}
```

### 3. 樣式自定義

```scss
// 自定義主題色彩
.statistics-card {
  --primary-color: #2f80ed;
  --success-color: #27ae60;
  --warning-color: #f2994a;
  --danger-color: #eb5757;
}
```

## 🔍 故障排除

### 常見問題

1. **導入錯誤**

   ```javascript
   // ❌ 錯誤
   import GenericDetailsDialog from '@/components/dialogs/GenericDetailsDialog.vue'

   // ✅ 正確
   import GenericDetailsDialog from '../dialogs/GenericDetailsDialog.vue'
   ```

2. **樣式不生效**
   - 確保已導入 SCSS 變數文件
   - 檢查 CSS 類別名稱是否正確

3. **響應式問題**
   - 檢查媒體查詢斷點
   - 確認容器寬度設定

## 📚 相關文件

- [Vant 4 官方文檔](https://vant-ui.github.io/vant/#/zh-CN/)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api/)
- [SCSS 變數指南](./STYLE_SYSTEM_GUIDE.md)

## 🚀 未來規劃

- [ ] 支援更多統計圖表類型
- [ ] 增加數據導出功能
- [ ] 支援自定義主題
- [ ] 增加動畫效果
- [ ] 支援多語言
