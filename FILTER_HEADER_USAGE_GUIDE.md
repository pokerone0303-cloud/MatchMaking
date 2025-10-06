# FilterHeader 組件使用指南

## 概述

`FilterHeader` 是一個可重用的篩選頭部組件，提供搜尋、篩選和導航功能。現在支援 `showTitle` 參數來控制是否顯示標題欄位。

## 新增功能

### showTitle 參數

- **類型**: `boolean`
- **預設值**: `true`
- **用途**: 控制是否顯示標題欄位（包含返回按鈕和頁面標題）

## 基本使用

### 1. 完整模式（顯示標題）

```vue
<template>
  <FilterHeader
    title="班別管理"
    :filter-config="filterConfig"
    :sticky="true"
    :show-title="true"
    @update-filter="handleFilterChange"
    @search="handleSearch"
    @toggle-filter="handleToggleFilter"
    @reset="handleReset"
  />
</template>
```

### 2. 簡化模式（不顯示標題）

```vue
<template>
  <FilterHeader
    title="班別管理"
    :filter-config="filterConfig"
    :sticky="true"
    :show-title="false"
    @update-filter="handleFilterChange"
    @search="handleSearch"
    @toggle-filter="handleToggleFilter"
    @reset="handleReset"
  />
</template>
```

## 篩選配置範例

### EmployerShiftsView 配置

```typescript
const filterConfig = ref<FilterConfig>({
  fields: [
    {
      type: 'search',
      key: 'search',
      label: '搜尋',
      placeholder: '搜尋職位/商家',
      width: 'full',
    },
    {
      type: 'select',
      key: 'status',
      label: '狀態',
      placeholder: '選擇狀態',
      width: 'half',
      options: [
        { text: '全部狀態', value: 'all' },
        { text: '尚有缺額', value: 'available' },
        { text: '暫無缺額', value: 'unavailable' },
      ],
    },
    {
      type: 'select',
      key: 'position',
      label: '職位',
      placeholder: '選擇職位',
      width: 'half',
      options: [
        { text: '全部職位', value: 'all' },
        { text: '發牌員', value: 'dealer' },
        { text: '百家樂荷官', value: 'baccarat' },
        { text: '桌邊荷官', value: 'table' },
      ],
    },
    {
      type: 'date',
      key: 'date',
      label: '工作日期',
      placeholder: '選擇日期',
      width: 'half',
    },
    {
      type: 'select',
      key: 'sortBy',
      label: '排序',
      placeholder: '選擇排序方式',
      width: 'half',
      options: [
        { text: '最新到最舊', value: 'newest' },
        { text: '最舊到最新', value: 'oldest' },
        { text: '時薪高到低', value: 'wage_high' },
        { text: '時薪低到高', value: 'wage_low' },
      ],
    },
  ],
  values: {
    search: '',
    status: 'all',
    position: 'all',
    date: '',
    sortBy: 'newest',
  },
})
```

## 事件處理

### 篩選變更處理

```typescript
const handleFilterChange = (key: string, value: string | number) => {
  // 確保響應式更新
  filterConfig.value = {
    ...filterConfig.value,
    values: {
      ...filterConfig.value.values,
      [key]: value,
    },
  }

  // 同步更新原有的狀態
  if (key === 'search') {
    searchQuery.value = value as string
  } else if (key === 'status') {
    shiftStatus.value = value as 'available' | 'unavailable'
  }

  console.log('篩選變更:', key, value)
  // 在這裡處理篩選邏輯
}
```

### 搜尋處理

```typescript
const handleSearch = (value: string) => {
  console.log('搜尋:', value)
  filterConfig.value.values.search = value
  searchQuery.value = value
  // 在這裡處理搜尋邏輯
}
```

### 重置處理

```typescript
const handleReset = () => {
  console.log('重置篩選')
  filterConfig.value.values = {
    search: '',
    status: 'all',
    position: 'all',
    date: '',
    sortBy: 'newest',
  }
  searchQuery.value = ''
  shiftStatus.value = 'unavailable'
}
```

## 使用場景

### 1. 獨立頁面（顯示標題）

適用於需要導航功能的獨立頁面：

```vue
<FilterHeader
  title="班別管理"
  :show-title="true"
  :filter-config="filterConfig"
  @update-filter="handleFilterChange"
/>
```

### 2. 嵌入頁面（不顯示標題）

適用於已經有導航欄的頁面，只需要篩選功能：

```vue
<FilterHeader
  title="班別管理"
  :show-title="false"
  :filter-config="filterConfig"
  @update-filter="handleFilterChange"
/>
```

## 最佳實踐

1. **統一配置**: 在整個應用中使用相同的篩選配置結構
2. **響應式更新**: 確保篩選變更時正確更新配置對象
3. **狀態同步**: 將篩選狀態與頁面狀態保持同步
4. **適當的標題**: 根據頁面結構決定是否顯示標題欄位

## 遷移指南

### 從自訂篩選區塊遷移

1. 創建 `FilterConfig` 配置對象
2. 實現事件處理函數
3. 替換模板中的篩選區塊
4. 移除不再使用的樣式和邏輯

### 範例：EmployerShiftsView 遷移

- ✅ 移除了複雜的日曆和日期選擇邏輯
- ✅ 使用統一的 FilterHeader 組件
- ✅ 簡化了篩選配置
- ✅ 保持了原有的篩選功能

這種設計讓篩選功能更加統一和可維護，同時提供了靈活的配置選項。
