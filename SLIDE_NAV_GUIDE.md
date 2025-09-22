# 側邊選單組件使用指南

## 概述

`SlideNav` 組件是一個基於 Vant4 的側邊選單，支援從右側滑入動畫，並根據不同角色顯示對應的選單內容。

## 功能特色

- ✅ 從右側滑入動畫效果
- ✅ 支援三種角色配置（用戶端、商家端、管理端）
- ✅ 區塊化選單結構（主要功能、工作管理、支援服務）
- ✅ 登出確認對話框
- ✅ 使用 Vant4 預設樣式
- ✅ 響應式設計
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
    <BottomNav :role="currentRole" @open-slide-nav="showSlideNav = true" />

    <!-- 側邊選單 -->
    <SlideNav v-model:show="showSlideNav" :role="currentRole" @close="handleCloseSlideNav" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomNav from '@/components/BottomNav/index.vue'
import SlideNav from '@/components/slideNav/index.vue'

const currentRole = ref<'user' | 'employer' | 'admin'>('user')
const showSlideNav = ref(false)

const handleCloseSlideNav = () => {
  showSlideNav.value = false
}
</script>
```

### Props

| 屬性 | 類型                            | 預設值 | 說明                             |
| ---- | ------------------------------- | ------ | -------------------------------- |
| show | boolean                         | false  | 控制選單顯示/隱藏                |
| role | 'user' \| 'employer' \| 'admin' | 'user' | 當前用戶角色，決定顯示的選單內容 |

### Events

| 事件名      | 說明                   | 參數    |
| ----------- | ---------------------- | ------- |
| update:show | 選單顯示狀態改變時觸發 | boolean |
| close       | 選單關閉時觸發         | 無      |

## 選單結構

### 用戶端 (user)

#### 主要功能

- **班表管理** - 查看並應徵班別
- **我的資料** - 個人資訊與設定

#### 工作管理

- **工時記錄** - 查看詳細上班時數
- **應徵紀錄** - 查看詳細應徵歷史

### 商家端 (employer)

#### 主要功能

- **班別管理** - 管理已建立的班別
- **建立班別** - 發布新的工作班別
- **應徵名單** - 管理應徵者名單
- **商家資料** - 商家資訊與設定

#### 工作管理

- **工時審核** - 審核員工工時記錄
- **營運報表** - 查看營運統計數據

### 管理端 (admin)

#### 主要功能

- **時數審核** - 審核所有用戶工時
- **用戶管理** - 管理用戶與商家
- **班別管理** - 監控所有班別
- **系統報表** - 查看系統統計

#### 工作管理

- **系統設定** - 系統參數與配置

### 支援服務（所有角色共用）

- **幫助中心** - 使用說明與FAQ
- **關於我們** - 應用程式資訊

## 樣式自定義

組件使用專案的 SCSS 變數系統，可以通過修改 `variables.scss` 來自定義樣式：

```scss
// 主要色彩
$color-primary: #155dfc;
$color-text-primary: #030213;
$color-text-secondary: #909399;

// 間距
$spacing-base: 16px;
$spacing-lg: 24px;

// 圓角
$border-radius-base: 8px;
```

## 響應式設計

### 小螢幕 (≤ 320px)

- 選單寬度：100%
- 全高度顯示
- 優化的觸控體驗

### 一般行動裝置 (321px - 480px)

- 選單寬度：250px
- 全高度顯示
- 保持固定寬度

### 大螢幕 (≥ 481px)

- 選單寬度：250px
- 保持行動裝置的視覺效果
- 統一的最大寬度限制

## 動畫效果

- **滑入動畫**：從右側滑入，使用 Vant4 的 `van-popup` 組件
- **點擊遮罩關閉**：點擊選單外部區域可關閉選單
- **按鈕動畫**：選單項目點擊時有輕微的背景色變化

## 登出功能

選單底部包含登出按鈕，點擊時會：

1. 顯示確認對話框
2. 用戶確認後執行登出邏輯
3. 跳轉到登入頁面
4. 顯示登出成功提示

```javascript
const handleLogout = async () => {
  try {
    await showConfirmDialog({
      title: '確認登出',
      message: '您確定要登出嗎？',
      confirmButtonText: '登出',
      cancelButtonText: '取消',
    })

    // 登出邏輯
    showToast('已登出')
    router.push('/login')
  } catch {
    // 用戶取消登出
  }
}
```

## 路由配置

確保在路由配置中包含對應的路由：

```typescript
const routes = [
  // 用戶端路由
  { path: '/u/shifts', component: UserShifts },
  { path: '/u/profile', component: UserProfile },
  { path: '/u/timesheets', component: UserTimesheets },
  { path: '/u/applications', component: UserApplications },

  // 商家端路由
  { path: '/e/shifts', component: EmployerShifts },
  { path: '/e/create', component: EmployerCreate },
  { path: '/e/applicants', component: EmployerApplicants },
  { path: '/e/profile', component: EmployerProfile },
  { path: '/e/timesheets', component: EmployerTimesheets },
  { path: '/e/reports', component: EmployerReports },

  // 管理端路由
  { path: '/a/audit', component: AdminAudit },
  { path: '/a/users', component: AdminUsers },
  { path: '/a/shifts', component: AdminShifts },
  { path: '/a/reports', component: AdminReports },
  { path: '/a/settings', component: AdminSettings },

  // 共用路由
  { path: '/help', component: HelpCenter },
  { path: '/about', component: AboutUs },
]
```

## 測試頁面

可以訪問 `/test-slide-nav` 路由來測試側邊選單組件的所有功能：

- 角色切換測試
- 選單內容測試
- 動畫效果測試
- 響應式設計測試

## 注意事項

1. **狀態管理**：選單的顯示狀態需要由父組件管理
2. **角色切換**：角色改變時選單內容會自動更新
3. **路由跳轉**：點擊選單項目會自動關閉選單並跳轉到對應頁面
4. **Z-index**：選單使用較高的 z-index 確保顯示在最上層
5. **安全區域**：支援 iOS 安全區域，避免被 Home Indicator 遮擋

## 整合範例

```vue
<template>
  <div class="app">
    <!-- 頁面內容 -->
    <router-view />

    <!-- 底部導航 -->
    <BottomNav :role="userRole" @open-slide-nav="showSlideNav = true" />

    <!-- 側邊選單 -->
    <SlideNav v-model:show="showSlideNav" :role="userRole" @close="showSlideNav = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const showSlideNav = ref(false)

const userRole = computed(() => authStore.user?.role || 'user')
</script>
```
