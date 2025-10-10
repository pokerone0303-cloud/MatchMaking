# 應徵名單對話框使用指南

## 📋 概述

根據設計稿要求，我們成功創建了 `ApplicantListDialog.vue` 元件，實現了應徵名單的中央彈跳窗口功能。

## 🎯 功能特色

### 1. 三層結構設計

- **Sticky 標題區塊**：固定顯示「應徵名單」標題
- **Sticky 頂部說明區塊**：顯示班別基本資訊（日期、時間、職位、應徵人數）
- **Scroll Content 內容卡片區塊**：可滾動的應徵者列表

### 2. 應徵者卡片功能

- 顯示應徵者詳細資訊（姓名、聯絡方式、經驗、評分、技能等）
- 狀態標籤（待審核、已錄取、已拒絕）
- 操作按鈕（錄取/拒絕，僅待審核狀態顯示）

### 3. 響應式設計

- 移動端優先設計
- 桌面端適配
- 使用 Vant 4 元件庫

## 🛠️ 技術實現

### 元件結構

```vue
<ApplicantListDialog
  :visible="showApplicantListDialog"
  :shift="shiftData"
  @update:visible="showApplicantListDialog = $event"
  @close="handleApplicantListClose"
  @accept="handleApplicantAccept"
  @reject="handleApplicantReject"
/>
```

### 主要 Props

- `visible: boolean` - 控制對話框顯示/隱藏
- `shift: Shift | null` - 班別資料

### 主要 Events

- `update:visible` - 更新顯示狀態
- `close` - 關閉對話框
- `accept` - 錄取應徵者
- `reject` - 拒絕應徵者

## 📁 檔案結構

```
src/
├── components/
│   ├── dialogs/
│   │   └── ApplicantListDialog.vue    # 應徵名單對話框
│   └── cards/
│       └── EShiftCard.vue              # 商家班別卡片（已整合）
├── types/
│   └── shift.ts                        # 班別類型定義
```

## 🎨 樣式特色

### 1. Sticky 定位

```scss
&__header {
  position: sticky;
  top: 0;
  z-index: 2;
}

&__info {
  position: sticky;
  top: 60px; // 標題高度
  z-index: 1;
}
```

### 2. 卡片設計

- 白色背景，圓角設計
- 陰影效果增加層次感
- 狀態標籤顏色區分

### 3. 按鈕樣式

- 錄取按鈕：綠色背景
- 拒絕按鈕：白色背景，灰色邊框
- Hover 效果使用現代 SCSS 函數

## 🔧 整合方式

### 在 EShiftCard 中使用

```vue
<template>
  <!-- 查看名單按鈕 -->
  <button class="btn btn--view-list" @click="handleViewList">
    <van-icon name="user-o" />
    查看名單
  </button>
</template>

<script setup>
// 狀態管理
const showApplicantListDialog = ref(false);

// 事件處理
const handleViewList = () => {
  showApplicantListDialog.value = true;
};

const handleApplicantAccept = (applicantId: string) => {
  console.log('錄取應徵者:', applicantId);
  // API 請求邏輯
};

const handleApplicantReject = (applicantId: string) => {
  console.log('拒絕應徵者:', applicantId);
  // API 請求邏輯
};
</script>
```

## 📱 使用流程

1. **開啟對話框**：點擊「查看名單」按鈕
2. **查看資訊**：瀏覽應徵者詳細資料
3. **操作應徵者**：錄取或拒絕待審核的應徵者
4. **關閉對話框**：點擊 X 按鈕或背景區域

## 🎯 設計規範遵循

### 1. 命名規範

- 元件：`PascalCase` (ApplicantListDialog)
- 檔案：`PascalCase.vue`
- CSS 類別：`kebab-case` (applicant-list-dialog)

### 2. 程式碼風格

- 使用 `<script setup lang="ts">`
- 明確的 Props 和 Emits 類型定義
- 統一的錯誤處理

### 3. 樣式規範

- 使用 SCSS 變數 (variables.scss)
- BEM 命名法
- 響應式設計

## 🚀 後續擴展

### 1. API 整合

```typescript
// 錄取應徵者
const handleApplicantAccept = async (applicantId: string) => {
  try {
    await acceptApplicant(applicantId)
    // 更新本地狀態
    // 顯示成功提示
  } catch (error) {
    // 錯誤處理
  }
}
```

### 2. 狀態管理

- 整合 Pinia store
- 即時更新應徵者狀態
- 快取機制

### 3. 功能擴展

- 批量操作
- 篩選和排序
- 搜尋功能
- 匯出功能

## ✅ 完成清單

- [x] 創建 ApplicantListDialog.vue 元件
- [x] 實現 sticky 標題區塊
- [x] 實現 sticky 頂部說明區塊
- [x] 實現 scroll content 內容卡片區塊
- [x] 添加應徵者卡片樣式和狀態標籤
- [x] 實作錄取/拒絕按鈕功能
- [x] 整合到 EShiftCard.vue
- [x] 創建 Shift 類型定義
- [x] 修復 TypeScript 錯誤
- [x] 修復 SCSS 警告
- [x] 通過構建測試

## 🎉 總結

成功實現了符合設計稿要求的應徵名單對話框，具備完整的三層結構、響應式設計、狀態管理和操作功能。元件遵循專案規範，易於維護和擴展。
