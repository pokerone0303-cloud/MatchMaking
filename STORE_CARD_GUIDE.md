# StoreCard 據點卡片元件使用指南

## 📋 概述

`StoreCard` 是一個仿照 `StatisticsCard.vue` 製作的據點內容卡片元件，用於顯示據點的詳細資訊，包含頂部標題、聯絡資訊、重要統計、設施資訊、營業時間、備註等分區塊設計。

## 🎯 主要功能

- **分區塊設計**：按照設計稿分為多個功能區塊
- **響應式佈局**：支援手機和桌面端顯示
- **詳細資料窗口**：點擊詳細按鈕開啟通用詳細窗口
- **編輯功能**：點擊編輯按鈕開啟編輯對話框
- **狀態顯示**：支援營運中、維護中、已關閉等狀態

## 📦 元件結構

### 分區塊設計

1. **頂部標題區域**
   - 據點名稱（垂直排列）
   - 據點 ID
   - 狀態標籤（絕對位置）

2. **聯絡資訊區塊**
   - 地址（位置圖標）
   - 負責人和員工數
   - 電話號碼

3. **重要統計區域**
   - 容納人數（藍色）
   - 總班別數（綠色）
   - 進行中（橘色）

4. **提供設施區域**
   - 設施標籤列表

5. **營業時間區域**
   - 營業時間資訊（淺藍色背景）

6. **備註區域**
   - 備註內容（淺黃色背景）

7. **分隔線**

8. **底部區域**
   - 成立時間
   - 編輯和詳細按鈕

## 🚀 使用方法

### 基本使用

```vue
<template>
  <StoreCard
    :store="storeData"
    :show-details="true"
    :show-edit="true"
    @view-details="handleViewDetails"
    @edit="handleEdit"
    @update="handleUpdate"
  />
</template>

<script setup>
import StoreCard from '@/components/cards/StoreCard.vue'

const storeData = {
  id: 'BR004',
  name: '桃園中壢店',
  address: '桃園市中壢區中正路88號6樓',
  contactPerson: '陳主任',
  employeeCount: 18,
  phone: '03-4567-890',
  capacity: 100,
  totalShifts: 42,
  inProgress: 3,
  facilities: ['百家樂', '輪盤'],
  operatingHours: '13:00-01:00',
  remarks: '新據點,持續拓展中',
  establishmentDate: '2023-04-01',
  status: 'operating',
}

const handleViewDetails = (store) => {
  console.log('查看詳細資料:', store)
}

const handleEdit = (store) => {
  console.log('編輯據點:', store)
}

const handleUpdate = (data) => {
  console.log('更新據點資料:', data)
}
</script>
```

### Props 參數

| 參數          | 類型        | 預設值 | 說明             |
| ------------- | ----------- | ------ | ---------------- |
| `store`       | `StoreData` | -      | 據點資料（必填） |
| `showDetails` | `boolean`   | `true` | 是否顯示詳細按鈕 |
| `showEdit`    | `boolean`   | `true` | 是否顯示編輯按鈕 |

### Events 事件

| 事件名        | 參數               | 說明               |
| ------------- | ------------------ | ------------------ |
| `viewDetails` | `store: StoreData` | 點擊詳細按鈕時觸發 |
| `edit`        | `store: StoreData` | 點擊編輯按鈕時觸發 |
| `update`      | `data: any`        | 更新據點資料時觸發 |

## 🎨 樣式自定義

### CSS 變數

元件使用 SCSS 變數，可通過修改 `variables.scss` 來自定義樣式：

```scss
// 主要顏色
$color-blue-1: #2f80ed; // 容納人數顏色
$color-green-1: #27ae60; // 總班別數顏色
$color-orange-1: #f2994a; // 進行中顏色
$color-success: #27ae60; // 營運中狀態
$color-warning: #f2994a; // 維護中狀態
$color-danger: #eb5757; // 已關閉狀態

// 背景顏色
$color-blue-50: #e3f2fd; // 營業時間背景
$color-yellow-50: #fffbf0; // 備註背景
```

### 狀態樣式

```scss
.status-operating {
  background: $color-success;
  color: $color-white;
}

.status-maintenance {
  background: $color-warning;
  color: $color-white;
}

.status-closed {
  background: $color-danger;
  color: $color-white;
}
```

## 🔧 EditStoreDialog 編輯據點對話框

### 功能特點

- **通用性**：可適用於各種據點編輯場景
- **表單驗證**：支援必填欄位和格式驗證
- **響應式**：支援手機和桌面端
- **動態表單**：支援多種輸入類型

### 使用方法

```vue
<template>
  <EditStoreDialog
    v-model:show="showEditDialog"
    :store-data="storeData"
    @update="handleUpdate"
    @close="handleClose"
  />
</template>

<script setup>
import EditStoreDialog from '@/components/dialogs/EditStoreDialog.vue'

const showEditDialog = ref(false)

const handleUpdate = (data) => {
  console.log('更新據點資料:', data)
  showEditDialog.value = false
}

const handleClose = () => {
  showEditDialog.value = false
}
</script>
```

### 支援的表單欄位

| 欄位             | 類型   | 說明       |
| ---------------- | ------ | ---------- |
| `name`           | text   | 據點名稱   |
| `city`           | select | 城市選擇   |
| `district`       | select | 行政區選擇 |
| `address`        | text   | 完整地址   |
| `contactPerson`  | text   | 負責人     |
| `phone`          | text   | 電話號碼   |
| `capacity`       | number | 容納人數   |
| `email`          | text   | 電子信箱   |
| `operatingHours` | text   | 營業時間   |
| `facilities`     | text   | 提供設施   |
| `remarks`        | text   | 備註       |

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
interface StoreData {
  id: string
  name: string
  address: string
  contactPerson: string
  employeeCount: number
  phone: string
  capacity: number
  totalShifts: number
  inProgress: number
  facilities: string[]
  operatingHours: string
  remarks: string
  establishmentDate: string
  status: 'operating' | 'maintenance' | 'closed'
}
```

### 2. 事件處理

```javascript
// 建議的事件處理方式
const handleViewDetails = (store) => {
  // 記錄用戶行為
  analytics.track('view_store_details', { storeId: store.id })

  // 開啟詳細窗口
  showDetailsDialog.value = true
}

const handleEdit = (store) => {
  // 記錄用戶行為
  analytics.track('edit_store', { storeId: store.id })

  // 開啟編輯窗口
  showEditDialog.value = true
}
```

### 3. 樣式自定義

```scss
// 自定義主題色彩
.store-card {
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
   import StoreCard from '@/components/cards/StoreCard.vue'

   // ✅ 正確
   import StoreCard from '../cards/StoreCard.vue'
   ```

2. **樣式不生效**
   - 確保已導入 SCSS 變數文件
   - 檢查 CSS 類別名稱是否正確

3. **響應式問題**
   - 檢查媒體查詢斷點
   - 確認容器寬度設定

4. **表單驗證問題**
   - 檢查必填欄位是否正確設定
   - 確認數據格式是否符合要求

## 📚 相關文件

- [Vant 4 官方文檔](https://vant-ui.github.io/vant/#/zh-CN/)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api/)
- [SCSS 變數指南](./STYLE_SYSTEM_GUIDE.md)
- [GenericDetailsDialog 使用指南](./STATISTICS_CARD_GUIDE.md#genericdetailsdialog-通用詳細窗口)

## 🚀 未來規劃

- [ ] 支援更多據點狀態類型
- [ ] 增加據點圖片上傳功能
- [ ] 支援據點位置地圖顯示
- [ ] 增加據點評分功能
- [ ] 支援據點標籤系統

## 🎯 使用範例

### 完整範例

```vue
<template>
  <div class="stores-page">
    <h1>據點管理</h1>
    <div class="stores-list">
      <StoreCard
        v-for="store in stores"
        :key="store.id"
        :store="store"
        @view-details="handleViewDetails"
        @edit="handleEdit"
        @update="handleUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StoreCard from '@/components/cards/StoreCard.vue'

const stores = ref([
  {
    id: 'BR001',
    name: '台北信義店',
    address: '台北市信義區信義路五段7號',
    contactPerson: '王經理',
    employeeCount: 25,
    phone: '02-2345-6789',
    capacity: 150,
    totalShifts: 58,
    inProgress: 5,
    facilities: ['百家樂', '輪盤', '21點'],
    operatingHours: '14:00-02:00',
    remarks: '旗艦店,設備最新',
    establishmentDate: '2022-01-15',
    status: 'operating',
  },
  {
    id: 'BR002',
    name: '新北板橋店',
    address: '新北市板橋區中山路一段168號15樓',
    contactPerson: '李店長',
    employeeCount: 18,
    phone: '02-8965-4321',
    capacity: 120,
    totalShifts: 42,
    inProgress: 3,
    facilities: ['百家樂', '21點'],
    operatingHours: '13:00-01:00',
    remarks: '設備維護中,預計下週重新開放',
    establishmentDate: '2023-04-01',
    status: 'maintenance',
  },
])

const handleViewDetails = (store) => {
  console.log('查看據點詳細資料:', store)
}

const handleEdit = (store) => {
  console.log('編輯據點:', store)
}

const handleUpdate = (data) => {
  console.log('更新據點資料:', data)
  // 這裡可以調用 API 更新據點資料
}
</script>

<style scoped>
.stores-page {
  padding: 20px;
}

.stores-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
```
