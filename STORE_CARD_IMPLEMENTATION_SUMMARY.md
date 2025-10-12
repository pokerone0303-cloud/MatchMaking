# StoreCard 據點卡片元件實作總結

## 📋 概述

已成功仿照 `StatisticsCard.vue` 製作了一個據點內容卡片元件 `StoreCard.vue`，並創建了對應的編輯對話框 `EditStoreDialog.vue`。該元件完全按照設計稿要求進行分區塊設計。

## 🔄 已完成的元件

### 1. StoreCard.vue

- **位置**: `src/components/cards/StoreCard.vue`
- **功能**: 據點內容卡片顯示
- **特點**: 分區塊設計，響應式佈局，支援詳細和編輯功能

### 2. EditStoreDialog.vue

- **位置**: `src/components/dialogs/EditStoreDialog.vue`
- **功能**: 據點編輯對話框
- **特點**: 參照 `EditShiftDialog.vue` 製作，支援多種表單欄位

### 3. 使用指南

- **位置**: `STORE_CARD_GUIDE.md`
- **功能**: 詳細的使用說明和最佳實踐

## 🎯 主要功能特點

### 1. 分區塊設計

#### 頂部標題區域

- ✅ 垂直排列：據點名稱、ID
- ✅ 右側狀態標籤（絕對位置）
- ✅ 支援營運中、維護中、已關閉狀態

#### 聯絡資訊區塊

- ✅ 地址（位置圖標）
- ✅ 負責人和員工數
- ✅ 電話號碼

#### 重要統計區域

- ✅ 容納人數（藍色）
- ✅ 總班別數（綠色）
- ✅ 進行中（橘色）

#### 其他區域

- ✅ 提供設施標籤
- ✅ 營業時間（淺藍色背景）
- ✅ 備註（淺黃色背景）
- ✅ 分隔線
- ✅ 成立時間和操作按鈕

### 2. 響應式設計

- ✅ 手機端：單列佈局，緊湊間距
- ✅ 桌面端：多列佈局，增加間距
- ✅ 觸控友好的按鈕大小

### 3. 功能整合

- ✅ 使用 `GenericDetailsDialog` 顯示詳細資料
- ✅ 使用 `EditStoreDialog` 進行編輯
- ✅ 支援多種事件處理

## 🎨 樣式設計

### 狀態標籤樣式

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

### 統計數字顏色

```scss
.stat-number--blue {
  color: $color-blue-1; // 容納人數
}

.stat-number--green {
  color: $color-green-1; // 總班別數
}

.stat-number--orange {
  color: $color-orange-1; // 進行中
}
```

### 背景顏色

```scss
// 營業時間背景
&__hours {
  background: $color-blue-50;
}

// 備註背景
&__remarks {
  background: $color-yellow-50;
}
```

## 🔧 EditStoreDialog 功能

### 支援的表單欄位

- ✅ 據點名稱（文字輸入）
- ✅ 城市選擇（下拉選單）
- ✅ 行政區選擇（下拉選單）
- ✅ 地址（文字輸入）
- ✅ 負責人（文字輸入）
- ✅ 電話（文字輸入）
- ✅ 容納人數（數字輸入）
- ✅ 信箱（文字輸入）
- ✅ 營業時間（文字輸入）
- ✅ 提供設施（文字輸入）
- ✅ 備註（文字輸入）

### 表單驗證

- ✅ 必填欄位標記
- ✅ 數字範圍限制
- ✅ 輸入格式檢查

## 📱 響應式特性

### 手機端（< 768px）

- 單列表單佈局
- 緊湊間距
- 觸控友好的按鈕

### 桌面端（≥ 768px）

- 多列表單佈局
- 增加間距
- 更好的視覺層次

## 🚀 使用範例

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

## 📊 技術規格

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

## 🔍 測試建議

### 1. 功能測試

- [ ] 確認卡片能正常顯示所有資料
- [ ] 確認狀態標籤正確顯示
- [ ] 確認統計數字顏色正確
- [ ] 確認詳細對話框正常開啟
- [ ] 確認編輯對話框正常開啟

### 2. 響應式測試

- [ ] 手機端顯示正常
- [ ] 桌面端顯示正常
- [ ] 表單佈局響應式正常

### 3. 整合測試

- [ ] 與其他元件整合正常
- [ ] 事件處理正常
- [ ] 數據傳遞正常

## 📚 相關文檔

- [StoreCard 使用指南](./STORE_CARD_GUIDE.md)
- [GenericDetailsDialog 配置指南](./DIALOG_CONFIG_GUIDE.md)
- [StatisticsCard 使用指南](./STATISTICS_CARD_GUIDE.md)

## ⚠️ 注意事項

1. **數據結構**：確保 `store` 物件包含所有必要欄位
2. **狀態管理**：支援 'operating'、'maintenance'、'closed' 三種狀態
3. **表單驗證**：編輯對話框包含基本的表單驗證
4. **響應式**：元件完全支援響應式設計

## 🎯 未來規劃

- [ ] 支援據點圖片上傳
- [ ] 增加據點位置地圖顯示
- [ ] 支援據點評分功能
- [ ] 增加據點標籤系統
- [ ] 支援據點歷史記錄

## ✅ 完成狀態

- [x] 創建 `StoreCard.vue` 元件
- [x] 創建 `EditStoreDialog.vue` 元件
- [x] 實現分區塊設計
- [x] 實現響應式佈局
- [x] 整合 `GenericDetailsDialog`
- [x] 實現編輯功能
- [x] 創建使用指南
- [x] 測試功能正常
- [x] 確認無 linting 錯誤

所有功能已完成，`StoreCard` 元件現在可以正常使用，完全符合設計稿要求。
