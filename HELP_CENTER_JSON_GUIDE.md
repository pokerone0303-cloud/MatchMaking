# 📘 幫助中心 JSON 資料管理指南

## 概述

幫助中心的所有內容現在都儲存在 `src/data/help-center.json` 檔案中，讓內容管理變得簡單容易。您無需修改任何 Vue 程式碼，只需要編輯 JSON 檔案即可更新所有內容。

---

## 📁 檔案位置

```
src/data/help-center.json
```

---

## 🎯 資料結構

### 完整 JSON 結構

```json
{
  "banner": { ... },           // 置頂公告
  "categories": [ ... ],       // QA 分類與問題
  "contactMethods": [ ... ],  // 聯絡方式
  "otherInfo": [ ... ],        // 其他資訊
  "footer": { ... }            // 版權資訊
}
```

---

## 📝 內容管理說明

### 1. 置頂公告 (banner)

```json
{
  "banner": {
    "icon": "info-o", // Vant 圖示名稱
    "title": "重要公告", // 標題
    "text": "公告內容..." // 內容
  }
}
```

**修改範例：**

```json
{
  "banner": {
    "icon": "info-o",
    "title": "系統維護公告",
    "text": "系統將於本週六凌晨進行維護，預計 2 小時。"
  }
}
```

---

### 2. QA 分類與問題 (categories)

#### 分類結構

```json
{
  "categories": [
    {
      "name": "1",              // 手風琴識別碼（數字字串）
      "title": "登入與帳號相關", // 分類標題
      "icon": "lock",           // 圖示（目前未使用）
      "questions": [ ... ]       // 問題清單
    }
  ]
}
```

#### 問題項目結構

```json
{
  "question": "Q: 問題標題？",
  "answer": "答案內容" // 支援 HTML 標籤（如 <br>）
}
```

#### 完整範例

```json
{
  "name": "1",
  "title": "登入與帳號相關",
  "icon": "lock",
  "questions": [
    {
      "question": "Q: 忘記密碼怎麼辦？",
      "answer": "您可以點擊登入頁面的「忘記密碼」按鈕..."
    },
    {
      "question": "Q: 如何更改個人資料？",
      "answer": "請登入系統後，進入「我的」頁面..."
    }
  ]
}
```

#### 新增問題

在對應分類的 `questions` 陣列中新增項目：

```json
{
  "question": "Q: 新問題？",
  "answer": "答案內容<br>支援換行"
}
```

---

### 3. 聯絡方式 (contactMethods)

#### 聯絡方式結構

```json
{
  "id": "phone", // 唯一識別碼
  "icon": "phone-o", // Vant 圖示名稱
  "title": "電話客服", // 標題
  "text": "02-1234-5678", // 聯絡資訊
  "note": "週一至週五 09:00-18:00", // 備註
  "action": "call" // 動作類型
}
```

#### 支援的動作類型

| action    | 說明         | 備註                          |
| --------- | ------------ | ----------------------------- |
| `call`    | 撥打電話     | 需要 `text` 欄位包含電話號碼  |
| `email`   | 發送郵件     | 需要 `text` 欄位包含信箱地址  |
| `line`    | 開啟 LINE    | 需要 `url` 欄位包含 LINE 連結 |
| `website` | 顯示提示訊息 | 用於尚未實作的功能            |

#### 完整範例

```json
{
  "contactMethods": [
    {
      "id": "phone",
      "icon": "phone-o",
      "title": "電話客服",
      "text": "02-1234-5678",
      "note": "週一至週五 09:00-18:00",
      "action": "call"
    },
    {
      "id": "email",
      "icon": "envelop-o",
      "title": "電子信箱",
      "text": "support@matchmaking.com",
      "note": "24 小時接收，24 小時內回覆",
      "action": "email"
    },
    {
      "id": "line",
      "icon": "chat-o",
      "title": "LINE 客服",
      "text": "@matchmaking",
      "note": "週一至週日 09:00-21:00",
      "action": "line",
      "url": "https://lin.ee/xxxxx"
    }
  ]
}
```

#### 新增聯絡方式

```json
{
  "id": "wechat",
  "icon": "chat-o",
  "title": "微信客服",
  "text": "WeChat_ID",
  "note": "週一至週五 10:00-20:00",
  "action": "website"
}
```

---

### 4. 其他資訊 (otherInfo)

#### 資訊項目結構

```json
{
  "title": "服務時間", // 標題
  "content": "系統 24 小時營運<br>電話客服：..." // 內容（支援 HTML）
}
```

#### 完整範例

```json
{
  "otherInfo": [
    {
      "title": "服務時間",
      "content": "系統 24 小時營運<br>電話客服：週一至週五 09:00-18:00<br>LINE 客服：週一至週日 09:00-21:00"
    },
    {
      "title": "隱私政策",
      "content": "我們重視您的個人資料安全..."
    }
  ]
}
```

#### 新增資訊項目

```json
{
  "title": "使用條款",
  "content": "使用本平台即代表同意以下條款：<br>1. 遵守相關法規<br>2. 保護帳號安全<br>3. 不得從事違法行為"
}
```

---

### 5. 版權資訊 (footer)

```json
{
  "footer": {
    "copyright": "© 2024 MatchMaking 人力媒合平台",
    "version": "Version 1.0.0"
  }
}
```

---

## 🔧 常見修改場景

### 場景 1：新增 QA 問題

在指定分類的 `questions` 陣列中新增：

```json
{
  "question": "Q: 如何聯絡客服？",
  "answer": "您可以透過以下方式聯絡我們：<br>1. 電話：02-1234-5678<br>2. 信箱：support@matchmaking.com<br>3. LINE：@matchmaking"
}
```

### 場景 2：更新電話號碼

修改 `contactMethods` 中的電話項目：

```json
{
  "id": "phone",
  "icon": "phone-o",
  "title": "電話客服",
  "text": "02-9876-5432", // 修改電話號碼
  "note": "週一至週五 09:00-18:00",
  "action": "call"
}
```

### 場景 3：新增 QA 分類

在 `categories` 陣列中新增分類：

```json
{
  "name": "7",
  "title": "新分類標題",
  "icon": "custom-icon",
  "questions": [
    {
      "question": "Q: 第一個問題？",
      "answer": "答案內容"
    }
  ]
}
```

### 場景 4：更新公告內容

修改 `banner` 物件：

```json
{
  "banner": {
    "icon": "warning-o",
    "title": "重要通知",
    "text": "本週五系統將進行升級，預計暫停服務 1 小時"
  }
}
```

---

## ✅ 修改後驗證

### 1. JSON 格式驗證

確保 JSON 格式正確：

- 所有括號要配對
- 字串用雙引號包裹
- 注意逗號的位置

### 2. 測試連結

修改聯絡方式後，測試各個連結是否正常運作：

- 電話是否正確撥打
- 郵件是否開啟正確
- LINE 連結是否有效

### 3. 內容顯示

檢查頁面上顯示的內容：

- 文字是否正確顯示
- HTML 標籤是否正確渲染
- 換行是否正常

---

## 🎨 HTML 標籤支援

在答案內容中可以使用的 HTML 標籤：

- `<br>` - 換行
- `<strong>` - 粗體
- `<em>` - 斜體
- `<code>` - 程式碼
- 其他基本 HTML 標籤

### 使用範例

```json
{
  "question": "Q: 如何格式化內容？",
  "answer": "您可以使用：<br><strong>粗體</strong><br><em>斜體</em><br><code>程式碼</code>"
}
```

---

## 📋 最佳實踐

### 1. 定期備份

修改前先備份 JSON 檔案：

```bash
cp src/data/help-center.json src/data/help-center.json.bak
```

### 2. 小步修改

一次只修改少量內容，修改後立即測試

### 3. 保持結構一致

新增內容時，保持與現有內容的格式一致

### 4. 使用編輯器驗證

使用支援 JSON 語法檢查的編輯器（如 VS Code）

### 5. 中文內容檢查

確保中文字符正確顯示，無編碼問題

---

## 🐛 常見問題

### Q: JSON 格式錯誤怎麼辦？

**A:** 使用 JSON 驗證工具檢查格式：

- VS Code 會自動提示 JSON 錯誤
- 線上工具：https://jsonlint.com/

### Q: 中文顯示亂碼怎麼辦？

**A:** 確保檔案編碼為 UTF-8，不要使用 BOM。

### Q: 新增的分類不顯示？

**A:** 檢查 `name` 欄位是否與其他分類重複。

### Q: HTML 標籤直接顯示？

**A:** 確認使用 `v-html` 渲染（組件已經處理），檢查標籤是否正確。

---

## 📝 更新檢查清單

修改 JSON 後，請確認：

- [ ] JSON 格式正確
- [ ] 中文字符正常顯示
- [ ] HTML 標籤正確渲染
- [ ] 連結功能正常運作
- [ ] 手風琴展開/收起正常
- [ ] 頁面排版正確
- [ ] 所有內容完整顯示

---

## 🔗 相關資源

- [Vant4 Collapse 文件](https://vant-ui.github.io/vant/#/zh-CN/collapse)
- [JSON 格式指南](https://www.json.org/json-zh.html)
- [專案樣式變數](./src/styles/variables.scss)
- [幫助中心頁面](./src/views/Common/HelpCenterView.vue)

---

## 💡 進階技巧

### 1. 使用註解

雖然標準 JSON 不支援註解，但可以在註解說明文件中記錄：

```json
{
  "categories": [
    // 登入相關問題
    {
      "name": "1",
      "title": "登入與帳號相關",
      "questions": [...]
    }
  ]
}
```

### 2. 重用聯絡資訊

可以將常用聯絡資訊定義在頂部，但需要在組件層處理。

### 3. 本地化支援

可以為不同語言建立不同的 JSON 檔案：

- `help-center-zh-TW.json`
- `help-center-en-US.json`

---

## 📄 授權說明

本指南與幫助中心頁面採用與專案相同的授權條款。
