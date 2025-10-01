# Dialog 整合方法使用指南

## 概述

本專案已整合 Vant 4 的 Dialog 組件，提供統一的對話框功能。透過 `useDialog` composable，可以輕鬆使用各種類型的對話框。

## 功能特色

- ✅ **提示窗口**：僅有確認按鈕
- ✅ **確認窗口**：具有確認和取消按鈕
- ✅ **預設樣式**：成功、錯誤、警告、危險操作
- ✅ **TypeScript 支援**：完整的型別定義
- ✅ **統一介面**：簡化使用方式

## 安裝與設定

### 1. 引入 Vant Dialog

確保在 `main.ts` 中已正確引入 Vant Dialog：

```typescript
import { showDialog, showConfirmDialog } from 'vant'
```

### 2. 使用 useDialog Composable

```typescript
import { useDialog } from '@/composables/useDialog'

const { showAlert, showConfirm, showSuccess, showError, showWarning, showDangerConfirm } =
  useDialog()
```

## API 參考

### showAlert(options)

顯示僅有確認按鈕的提示窗口。

**參數：**

- `title?: string` - 標題（預設：'提示'）
- `message: string` - 訊息內容
- `confirmButtonText?: string` - 確認按鈕文字（預設：'確認'）
- `confirmButtonColor?: string` - 確認按鈕顏色（預設：'#2F80ED'）

**回傳：** `Promise<void>`

**範例：**

```typescript
await showAlert({
  title: '提示',
  message: '這是一個提示窗口。',
  confirmButtonText: '知道了',
  confirmButtonColor: '#2F80ED',
})
```

### showConfirm(options)

顯示具有確認和取消按鈕的確認窗口。

**參數：**

- `title?: string` - 標題（預設：'確認'）
- `message: string` - 訊息內容
- `confirmButtonText?: string` - 確認按鈕文字（預設：'確認'）
- `cancelButtonText?: string` - 取消按鈕文字（預設：'取消'）
- `confirmButtonColor?: string` - 確認按鈕顏色（預設：'#2F80ED'）
- `cancelButtonColor?: string` - 取消按鈕顏色（預設：'#909399'）

**回傳：** `Promise<boolean>` - true: 確認, false: 取消

**範例：**

```typescript
const confirmed = await showConfirm({
  title: '確認刪除',
  message: '確定要刪除這個項目嗎？',
  confirmButtonText: '刪除',
  cancelButtonText: '取消',
  confirmButtonColor: '#EB5757',
})

if (confirmed) {
  // 執行刪除操作
  console.log('用戶確認刪除')
} else {
  // 取消操作
  console.log('用戶取消刪除')
}
```

### 預設樣式方法

#### showSuccess(message, title?)

顯示成功提示窗口。

**範例：**

```typescript
await showSuccess('操作成功完成！')
await showSuccess('資料已儲存', '儲存成功')
```

#### showError(message, title?)

顯示錯誤提示窗口。

**範例：**

```typescript
await showError('操作失敗，請稍後再試。')
await showError('網路連線異常', '連線錯誤')
```

#### showWarning(message, title?)

顯示警告提示窗口。

**範例：**

```typescript
await showWarning('請注意：此操作將影響您的帳戶設定！')
await showWarning('資料將被覆蓋', '警告')
```

#### showDangerConfirm(message, title?)

顯示危險操作確認窗口。

**範例：**

```typescript
const confirmed = await showDangerConfirm('確定要刪除所有資料嗎？')
if (confirmed) {
  // 執行危險操作
}
```

## 實際應用範例

### 1. 表單提交確認

```typescript
const handleSubmit = async () => {
  const confirmed = await showConfirm({
    title: '提交確認',
    message: '確定要提交表單嗎？',
    confirmButtonText: '提交',
    cancelButtonText: '取消',
  })

  if (confirmed) {
    try {
      await submitForm()
      await showSuccess('表單提交成功！')
    } catch {
      await showError('提交失敗，請稍後再試。')
    }
  }
}
```

### 2. 資料刪除確認

```typescript
const handleDelete = async (id: string) => {
  const confirmed = await showDangerConfirm('確定要刪除這個項目嗎？刪除後無法復原。')

  if (confirmed) {
    try {
      await deleteItem(id)
      await showSuccess('項目已刪除')
      // 更新列表
      await fetchList()
    } catch {
      await showError('刪除失敗，請稍後再試。')
    }
  }
}
```

### 3. 操作結果提示

```typescript
const handleSave = async () => {
  try {
    await saveData()
    await showSuccess('資料已儲存')
  } catch (error) {
    await showError('儲存失敗，請檢查網路連線')
  }
}
```

### 4. 詳細資料顯示

```typescript
const showDetails = async (item: any) => {
  await showAlert({
    title: '詳細資料',
    message: `
      名稱：${item.name}
      類型：${item.type}
      狀態：${item.status}
      建立時間：${item.createdAt}
    `.trim(),
  })
}
```

## 測試功能

在 `UserShiftsView.vue` 中已加入測試按鈕，可以測試各種 Dialog 功能：

1. **提示窗口** - 測試基本提示功能
2. **確認窗口** - 測試確認/取消功能
3. **成功提示** - 測試成功樣式
4. **錯誤提示** - 測試錯誤樣式
5. **警告提示** - 測試警告樣式
6. **危險確認** - 測試危險操作確認

## 最佳實踐

### 1. 錯誤處理

```typescript
try {
  await apiCall()
  await showSuccess('操作成功')
} catch (error) {
  await showError('操作失敗，請稍後再試')
}
```

### 2. 確認操作

```typescript
const confirmed = await showConfirm({
  message: '確定要執行此操作嗎？',
})

if (!confirmed) return

// 執行操作
```

### 3. 連鎖操作

```typescript
const step1 = await showConfirm({ message: '完成第一步？' })
if (!step1) return

const step2 = await showConfirm({ message: '完成第二步？' })
if (!step2) return

await showSuccess('所有步驟已完成！')
```

## 樣式自訂

可以透過傳入 `confirmButtonColor` 和 `cancelButtonColor` 參數來自訂按鈕顏色：

```typescript
await showConfirm({
  message: '自訂樣式確認',
  confirmButtonColor: '#27AE60', // 綠色
  cancelButtonColor: '#909399', // 灰色
})
```

## 注意事項

1. **非同步操作**：所有 Dialog 方法都是非同步的，需要使用 `await` 或 `.then()`
2. **錯誤處理**：建議在 try-catch 中處理 API 調用
3. **用戶體驗**：避免過度使用確認窗口，只在重要操作時使用
4. **訊息內容**：保持訊息簡潔明瞭，避免過長的文字

## 相關文件

- [Vant 4 Dialog 官方文件](https://vant-ui.github.io/vant/#/zh-CN/dialog)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api/)
- [TypeScript 官方文件](https://www.typescriptlang.org/)
