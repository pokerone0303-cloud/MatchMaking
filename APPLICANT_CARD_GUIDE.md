# ApplicantCard 元件使用指南

## 概述

`ApplicantCard` 是一個可重用的應徵者卡片元件，用於顯示應徵者的詳細資訊，包括基本資料、技能、聯絡資訊和操作按鈕。

## 功能特色

- ✅ 按照設計稿重新設計的 UI
- ✅ 不包含勾選項目
- ✅ 模組化設計，可重複使用
- ✅ 響應式設計
- ✅ 支援多種狀態顯示
- ✅ 可收合的聯絡資訊區塊

## 元件結構

### 頂部區塊

- **大頭照**: 顯示應徵者姓名首字
- **基本資料**: 垂直排列
  - 姓名
  - 應徵職位 (日期 開始時間 結束時間)
  - 經驗 (評分)

### 技能TAG標籤

- 顯示應徵者的技能標籤

### 聯絡資訊收合區塊

- 可切換顯示/隱藏聯絡資訊
- 包含電話和信箱

### 分割線

- 視覺分隔線

### 應徵時間

- 顯示應徵提交時間

### 操作按鈕

- 錄取按鈕 (綠色)
- 拒絕按鈕 (紅色)

### 右上角狀態標籤

- 絕對定位 (top: 16px, right: 16px)
- 支援多種狀態: 待審、已錄取、已拒絕、候補

## 使用方法

### 基本使用

```vue
<template>
  <ApplicantCard :applicant="applicantData" @accept="handleAccept" @reject="handleReject" />
</template>

<script setup>
import ApplicantCard from '@/components/cards/ApplicantCard.vue'

const applicantData = {
  id: '1',
  name: '張小明',
  position: '桌邊荷官',
  shiftDate: '2024-09-15',
  startTime: '18:00',
  endTime: '23:00',
  experience: 3,
  rating: 4.8,
  skills: ['百家樂', '21點', '輪盤'],
  phone: '0912-345-678',
  email: 'ming@example.com',
  applicationTime: '2024-09-10 15:30',
  status: 'pending',
}

const handleAccept = (applicantId) => {
  console.log('錄取應徵者:', applicantId)
}

const handleReject = (applicantId) => {
  console.log('拒絕應徵者:', applicantId)
}
</script>
```

### Props 介面

```typescript
interface Applicant {
  id: string // 應徵者 ID
  name: string // 姓名
  position: string // 應徵職位
  shiftDate: string // 班別日期
  startTime: string // 開始時間
  endTime: string // 結束時間
  experience: number // 經驗年數
  rating: number // 評分
  skills: string[] // 技能列表
  phone: string // 電話
  email: string // 信箱
  applicationTime: string // 應徵時間
  status: 'pending' | 'accepted' | 'rejected' | 'waiting' // 狀態
}
```

### Events

| 事件名稱 | 參數           | 說明               |
| -------- | -------------- | ------------------ |
| `accept` | `(id: string)` | 點擊錄取按鈕時觸發 |
| `reject` | `(id: string)` | 點擊拒絕按鈕時觸發 |

### 狀態配置

| 狀態       | 顯示文字 | 樣式類別 |
| ---------- | -------- | -------- |
| `pending`  | 待審     | 黃色背景 |
| `accepted` | 已錄取   | 綠色背景 |
| `rejected` | 已拒絕   | 紅色背景 |
| `waiting`  | 候補     | 藍色背景 |

## 樣式特色

### 設計系統

- 使用專案統一的 SCSS 變數
- 遵循 BEM 命名規範
- 響應式設計支援

### 顏色系統

- 主要色彩: `$color-primary`
- 成功色彩: `$color-success`
- 危險色彩: `$color-danger`
- 警告色彩: `$color-warning`

### 間距系統

- 使用統一的間距變數
- 支援響應式間距調整

## 在 ApplicantListDialog 中的使用

`ApplicantListDialog` 已經整合了 `ApplicantCard` 元件：

```vue
<template>
  <ApplicantCard
    v-for="applicant in applicants"
    :key="applicant.id"
    :applicant="applicant"
    @accept="handleAccept"
    @reject="handleReject"
  />
</template>
```

## 注意事項

1. **聯絡資訊預設隱藏**: 需要點擊按鈕才會顯示
2. **操作按鈕**: 只有 `pending` 狀態的應徵者才會顯示操作按鈕
3. **響應式設計**: 在桌面版會有更大的間距和字體
4. **無障礙設計**: 支援鍵盤導航和螢幕閱讀器

## 自訂樣式

如果需要自訂樣式，可以透過 CSS 變數或覆寫 SCSS 變數：

```scss
// 自訂顏色
.applicant-card {
  --primary-color: #your-color;
  --success-color: #your-color;
}
```

## 更新日誌

- **v1.0.0**: 初始版本，按照設計稿重新設計
- 移除勾選項目功能
- 新增可收合聯絡資訊區塊
- 優化響應式設計
- 統一狀態標籤樣式
