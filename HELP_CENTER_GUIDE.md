# 📘 幫助中心使用指南

## 概述

幫助中心頁面使用 **Vant4 Collapse** 元件實現常見問題手風琴展開功能，提供完整的 QA 問答以及多種客服聯絡方式。

---

## 📁 檔案位置

```
src/views/Common/HelpCenterView.vue
```

---

## 🌐 路由配置

```typescript
// src/router/index.ts
{
  path: '/help',
  name: 'Help',
  component: () => import('@/views/Common/HelpCenterView.vue'),
}
```

**訪問路徑：** `/#/help`

---

## 🎯 功能特色

### 1. 置頂公告區域

- 藍色漸層背景凸顯重要性
- 提供快速指引訊息
- 使用 `van-icon` 圖示增強視覺效果

### 2. 常見問題手風琴

使用 `van-collapse` 實作分組展開功能，包含六個問題分類：

#### 分類說明

- **登入與帳號相關** - 密碼重設、資料修改、帳號管理
- **班別與應徵** - 應徵流程、取消應徵、結果通知
- **時數上傳與審核** - 時數上傳、薪資發放、退回處理
- **商家端功能** - 班別建立、應徵者管理、營運統計
- **技術與操作** - 系統登入、頁面異常、推播通知
- **權益與保障** - 應徵者保障、爭議處理

### 3. 聯絡客服區塊

提供四種聯絡方式：

- **電話客服** - 點擊撥打電話（需確認）
- **電子信箱** - 開啟郵件應用程式
- **LINE 客服** - 開啟 LINE 連結
- **線上表單** - 未來功能預留

### 4. 其他資訊

- 服務時間說明
- 隱私政策提醒
- 意見回饋邀請

### 5. 版權資訊

- 公司名稱與版權宣告
- 版本號顯示

---

## 💻 技術實作

### 核心元件

```vue
<van-collapse v-model="activeNames" class="help-center__collapse">
  <van-collapse-item name="1" title="分類標題">
    <div class="qa-list">
      <!-- Q&A 內容 -->
    </div>
  </van-collapse-item>
</van-collapse>
```

### 狀態管理

```typescript
// 控制手風琴展開/收起
const activeNames = ref<string[]>([])
```

### 互動功能

```typescript
// 撥打電話
const handleCall = (phone: string) => {
  showConfirmDialog({
    title: '撥打電話',
    message: `確定要撥打 ${phone} 嗎？`,
  }).then(() => {
    window.location.href = `tel:${phone}`
  })
}

// 發送郵件
const handleEmail = () => {
  window.location.href = 'mailto:support@matchmaking.com'
  showToast('已開啟郵件應用程式')
}

// 開啟 LINE
const handleLine = () => {
  window.open('https://lin.ee/xxxxx', '_blank')
  showToast('已開啟 LINE')
}
```

---

## 🎨 樣式設計

### 設計規範

- **BEM 命名**：`help-center__*`
- **色彩系統**：使用 SCSS 變數
- **間距系統**：統一使用 `$spacing-*` 變數
- **圓角系統**：使用 `$border-radius-*` 變數

### 色彩配置

```scss
// 公告區塊
background: linear-gradient(135deg, $color-blue-50 0%, $color-blue-100 100%);

// 展開狀態
:deep(.van-collapse-item__title--expanded) {
  background: $color-blue-50;
}

// 邊框線
border-left: 2px solid $color-primary;
```

### 響應式設計

```scss
.help-center {
  min-height: 100vh;
  background: $color-gray-50;
  padding-bottom: $spacing-base;
}
```

---

## 📝 QA 內容結構

### 問題項目格式

```vue
<div class="help-center__qa-item">
  <div class="help-center__qa-question">Q: 問題標題</div>
  <div class="help-center__qa-answer">
    詳細解答內容
  </div>
</div>
```

### 多行內容

支援使用 `<br>` 標籤進行換行：

```vue
<div class="help-center__qa-answer">
  1. 第一點說明<br>
  2. 第二點說明<br>
  3. 第三點說明
</div>
```

---

## 🔧 自訂修改

### 新增問題分類

```vue
<van-collapse-item name="7" title="新分類標題">
  <div class="help-center__qa-list">
    <div class="help-center__qa-item">
      <div class="help-center__qa-question">Q: 問題</div>
      <div class="help-center__qa-answer">答案</div>
    </div>
  </div>
</van-collapse-item>
```

### 修改聯絡資訊

```typescript
// 電話號碼
const handleCall = (phone: string) => {
  showConfirmDialog({
    title: '撥打電話',
    message: `確定要撥打 ${phone} 嗎？`,
  }).then(() => {
    window.location.href = `tel:${phone}`
  })
}
```

### 添加客服管道

```vue
<div class="help-center__contact-item" @click="handleNewMethod()">
  <van-icon name="custom-icon" class="help-center__contact-icon" />
  <div class="help-center__contact-content">
    <div class="help-center__contact-title">客服方式</div>
    <div class="help-center__contact-text">聯絡資訊</div>
    <div class="help-center__contact-note">備註說明</div>
  </div>
  <van-icon name="arrow" class="help-center__contact-arrow" />
</div>
```

---

## 🎯 使用範例

### 從其他頁面導航

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/help')
```

### 在導覽選單中加入連結

```vue
<van-cell title="幫助中心" icon="question-o" is-link @click="router.push('/help')" />
```

---

## 📱 行動裝置優化

### 觸控優化

- 所有可點擊元素使用 `cursor: pointer`
- 提供 `:active` 狀態視覺回饋
- 確保點擊區域至少 44x44px

### 滾動優化

```scss
.help-center__container {
  padding: $spacing-base;
}
```

---

## 🔍 可訪問性

### 語義化 HTML

- 使用適當的標題層級（h3）
- 提供清晰的內容結構

### 視覺層次

- 使用圖示增強理解
- 明確的問題與答案區分
- 適當的字重與字體大小

---

## 🐛 疑難排解

### 手風琴無法展開

確認 `activeNames` 是否正確初始化：

```typescript
const activeNames = ref<string[]>([])
```

### 聯絡方式無法點擊

確認 `@click` 事件已正確綁定：

```vue
<div class="help-center__contact-item" @click="handleCall('02-1234-5678')"></div>
```

### 樣式顯示異常

確認已引入 SCSS 變數：

```scss
@use '@/styles/variables.scss' as *;
```

---

## 📊 QA 統計

目前包含：

- **6 個問題分類**
- **20+ 個常見問題**
- **4 種聯絡方式**
- **3 個資訊區塊**

---

## 🎨 設計亮點

1. **清晰的視覺層次** - 使用圖示與顏色區分不同區域
2. **友好的互動體驗** - 手風琴展開/收起動畫流暢
3. **完整的功能覆蓋** - 包含常見問題與多種聯絡方式
4. **一致的設計風格** - 遵循專案整體設計規範
5. **詳細的解答內容** - 提供具體的操作步驟與說明

---

## 📝 更新記錄

### Version 2.0.0 (2024-12-xx)

- ✅ 資料結構重構，使用 JSON 檔案管理內容
- ✅ 支援動態渲染所有內容
- ✅ 簡化內容管理流程
- ✅ 易於維護和擴展

### Version 1.0.0 (2024-12-xx)

- ✅ 初始版本發布
- ✅ 實作常見問題手風琴功能
- ✅ 提供四種客服聯絡方式
- ✅ 完整樣式與互動功能

---

## 📁 資料檔案結構

### JSON 檔案位置

```
src/data/help-center.json
```

### 修改內容

所有內容（包括 QA、聯絡方式、其他資訊）現在都可以透過編輯 JSON 檔案來更新，無需修改 Vue 組件。

#### 新增 QA 問題

在對應的分類中新增問題項目：

```json
{
  "question": "Q: 新問題？",
  "answer": "答案內容"
}
```

#### 修改聯絡方式

在 `contactMethods` 陣列中修改或新增項目：

```json
{
  "id": "phone",
  "icon": "phone-o",
  "title": "電話客服",
  "text": "02-1234-5678",
  "note": "週一至週五 09:00-18:00",
  "action": "call"
}
```

#### 新增其他資訊

在 `otherInfo` 陣列中新增項目：

```json
{
  "title": "標題",
  "content": "內容<br>支援HTML標籤"
}
```

### 支援的聯絡方式動作

- `call` - 撥打電話
- `email` - 發送郵件
- `line` - 開啟 LINE（需要 `url` 欄位）
- `website` - 顯示提示訊息

---

## 🔗 相關資源

- [Vant4 Collapse 文件](https://vant-ui.github.io/vant/#/zh-CN/collapse)
- [專案樣式變數](./src/styles/variables.scss)
- [路由配置](./src/router/index.ts)
- [資料檔案](./src/data/help-center.json)

---

## 👥 使用場景

### 適合使用的頁面

- 導覽選單中的「幫助中心」連結
- 登入頁面的「需要幫助？」連結
- 個人頁面的「常見問題」連結
- 錯誤頁面的「聯絡客服」連結

### 使用建議

1. 在主要導航中提供入口
2. 在關鍵操作流程中提供快捷連結
3. 根據用戶角色顯示相關問題
4. 定期更新 QA 內容以反映最新功能

---

## 📄 授權說明

本文件與幫助中心頁面採用與專案相同的授權條款。

---

## 💡 未來優化方向

- [ ] 實作問題搜尋功能
- [ ] 新增問題評分功能（有幫助/無幫助）
- [ ] 根據用戶行為推薦相關問題
- [ ] 實作線上表單功能
- [ ] 新增多語言支援
- [ ] 添加 AI 智慧客服
