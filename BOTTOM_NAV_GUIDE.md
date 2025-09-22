# 底部導航組件使用指南

## 概述

`BottomNav` 組件是一個基於 Vant4 的響應式底部導航列，支援三種不同角色的導航配置，專為行動裝置設計，同時在桌機上也保持行動裝置的樣式。

## 功能特色

- ✅ 支援三種角色配置（用戶端、商家端、管理端）
- ✅ 響應式設計，桌機也顯示行動裝置樣式
- ✅ 當前頁面高亮顯示
- ✅ 選單按鈕支援側邊欄開啟
- ✅ 使用 Vant4 組件和預設樣式
- ✅ TypeScript 完整支援

## 使用方法

### 基本使用

```vue
<template>
  <div class="page">
    <!-- 頁面內容 -->
    <div class="page-content">
      <!-- 你的頁面內容 -->
    </div>

    <!-- 底部導航 -->
    <BottomNav :role="currentRole" @open-slide-nav="handleOpenSlideNav" />
  </div>
</template>

<script setup lang="ts">
import BottomNav from '@/components/BottomNav/index.vue'

const currentRole = ref<'user' | 'employer' | 'admin'>('user')

const handleOpenSlideNav = () => {
  // 處理側邊欄開啟邏輯
  console.log('開啟側邊欄')
}
</script>
```

### Props

| 屬性 | 類型                            | 預設值 | 說明                             |
| ---- | ------------------------------- | ------ | -------------------------------- |
| role | 'user' \| 'employer' \| 'admin' | 'user' | 當前用戶角色，決定顯示的導航項目 |

### Events

| 事件名         | 說明               | 參數 |
| -------------- | ------------------ | ---- |
| open-slide-nav | 點擊選單按鈕時觸發 | 無   |

## 角色配置

### 用戶端 (user)

- 班表 - 查看班別資訊
- 我的 - 個人資料頁面
- 選單 - 開啟側邊欄

### 商家端 (employer)

- 班別 - 管理班別
- 建立 - 建立新班別
- 名單 - 應徵名單管理
- 個人 - 個人資料頁面
- 選單 - 開啟側邊欄

### 管理端 (admin)

- 審核 - 時數審核
- 用戶 - 用戶管理
- 班別 - 班別管理
- 報表 - 報表查看
- 選單 - 開啟側邊欄

## 樣式自定義

組件使用專案的 SCSS 變數系統，可以通過修改 `variables.scss` 來自定義樣式：

```scss
// 主要色彩
$color-primary: #155dfc;
$color-text-secondary: #909399;

// 間距
$spacing-base: 16px;
$spacing-lg: 24px;

// 圓角
$border-radius-base: 8px;
```

## 響應式設計

### 行動裝置 (< 768px)

- 全寬度顯示
- 優化的觸控體驗
- 適當的間距和字體大小

### 平板 (768px - 1023px)

- 全寬度顯示
- 保持行動裝置體驗

### 桌機 (≥ 1024px)

- 限制最大寬度為 375px（行動裝置尺寸）
- 居中顯示
- 保持行動裝置的視覺效果

## 路由配置

確保在路由配置中包含對應的路由：

```typescript
const routes = [
  // 用戶端路由
  { path: '/u/shifts', component: UserShifts },
  { path: '/u/profile', component: UserProfile },

  // 商家端路由
  { path: '/e/shifts', component: EmployerShifts },
  { path: '/e/create', component: EmployerCreate },
  { path: '/e/applicants', component: EmployerApplicants },
  { path: '/e/profile', component: EmployerProfile },

  // 管理端路由
  { path: '/a/audit', component: AdminAudit },
  { path: '/a/users', component: AdminUsers },
  { path: '/a/shifts', component: AdminShifts },
  { path: '/a/reports', component: AdminReports },
]
```

## 測試頁面

可以訪問 `/test-nav` 路由來測試底部導航組件的功能：

- 角色切換測試
- 導航功能測試
- 響應式設計測試

## 注意事項

1. **頁面內容間距**：確保頁面內容有足夠的底部間距（建議 60px），避免被底部導航遮擋
2. **固定定位**：底部導航使用固定定位，會覆蓋在頁面內容之上
3. **Z-index**：使用 `$z-index-fixed` 確保導航列在最上層
4. **安全區域**：支援 iOS 安全區域，避免被 Home Indicator 遮擋

## 整合側邊欄

要整合側邊欄功能，需要：

1. 創建 `slideNav` 組件
2. 在父組件中管理側邊欄的顯示狀態
3. 監聽 `open-slide-nav` 事件

```vue
<template>
  <div>
    <!-- 頁面內容 -->
    <BottomNav @open-slide-nav="showSlideNav = true" />

    <!-- 側邊欄 -->
    <SlideNav v-model:show="showSlideNav" />
  </div>
</template>
```
