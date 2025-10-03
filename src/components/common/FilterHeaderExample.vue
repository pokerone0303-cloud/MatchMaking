<template>
	<div class="filter-header-example">
		<h2>FilterHeader 元件使用範例</h2>

		<div class="example-section">
			<h3>基本使用</h3>
			<FilterHeader title="範例篩選" :filter-config="basicFilterConfig" @update-filter="handleFilterChange"
				@search="handleSearch" @toggle-filter="handleToggleFilter" @reset="handleReset" />
		</div>

		<div class="example-section">
			<h3>複雜篩選範例</h3>
			<FilterHeader title="複雜篩選" :filter-config="complexFilterConfig" @update-filter="handleFilterChange"
				@search="handleSearch" @toggle-filter="handleToggleFilter" @reset="handleReset" />
		</div>

		<div class="example-section">
			<h3>當前篩選值</h3>
			<pre>{{ JSON.stringify(filterValues, null, 2) }}</pre>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FilterHeader from './FilterHeader.vue';
import type { FilterConfig } from '@/types/filter';

// 基本篩選配置
const basicFilterConfig = ref<FilterConfig>({
	fields: [
		{
			type: 'search',
			key: 'search',
			label: '搜尋',
			placeholder: '搜尋關鍵字',
			width: 'full'
		},
		{
			type: 'select',
			key: 'status',
			label: '狀態',
			placeholder: '選擇狀態',
			width: 'half',
			options: [
				{ text: '全部', value: 'all' },
				{ text: '啟用', value: 'active' },
				{ text: '停用', value: 'inactive' }
			]
		},
		{
			type: 'date',
			key: 'date',
			label: '日期',
			placeholder: '選擇日期',
			width: 'half'
		}
	],
	values: {
		search: '',
		status: 'all',
		date: ''
	}
});

// 複雜篩選配置
const complexFilterConfig = ref<FilterConfig>({
	fields: [
		{
			type: 'search',
			key: 'search',
			label: '搜尋',
			placeholder: '搜尋商家、職位或編號',
			width: 'full'
		},
		{
			type: 'select',
			key: 'category',
			label: '分類',
			placeholder: '選擇分類',
			width: 'half',
			options: [
				{ text: '全部分類', value: 'all' },
				{ text: '餐飲', value: 'food' },
				{ text: '零售', value: 'retail' },
				{ text: '服務', value: 'service' }
			]
		},
		{
			type: 'select',
			key: 'status',
			label: '狀態',
			placeholder: '選擇狀態',
			width: 'half',
			options: [
				{ text: '全部狀態', value: 'all' },
				{ text: '進行中', value: 'active' },
				{ text: '已完成', value: 'completed' },
				{ text: '已取消', value: 'cancelled' }
			]
		},
		{
			type: 'date',
			key: 'startDate',
			label: '開始日期',
			placeholder: '選擇開始日期',
			width: 'half'
		},
		{
			type: 'date',
			key: 'endDate',
			label: '結束日期',
			placeholder: '選擇結束日期',
			width: 'half'
		},
		{
			type: 'number',
			key: 'minPrice',
			label: '最低價格',
			placeholder: '輸入最低價格',
			width: 'half',
			min: 0,
			step: 10
		},
		{
			type: 'number',
			key: 'maxPrice',
			label: '最高價格',
			placeholder: '輸入最高價格',
			width: 'half',
			min: 0,
			step: 10
		},
		{
			type: 'text',
			key: 'location',
			label: '地點',
			placeholder: '輸入地點關鍵字',
			width: 'full'
		}
	],
	values: {
		search: '',
		category: 'all',
		status: 'all',
		startDate: '',
		endDate: '',
		minPrice: 0,
		maxPrice: 1000,
		location: ''
	}
});

// 當前篩選值
const filterValues = ref({});

// 處理篩選變更
const handleFilterChange = (key: string, value: string | number) => {
	console.log('篩選變更:', key, value);
	filterValues.value = { ...filterValues.value, [key]: value };

	// 如果是日期欄位，顯示格式化的日期
	if (key.includes('Date') && typeof value === 'string') {
		console.log('日期選擇:', key, value);
	}
};

// 處理搜尋
const handleSearch = (value: string) => {
	console.log('搜尋:', value);
	filterValues.value = { ...filterValues.value, search: value };
};

// 處理篩選切換
const handleToggleFilter = () => {
	console.log('切換篩選選單');
};

// 處理重置
const handleReset = () => {
	console.log('重置篩選');
	filterValues.value = {};
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.filter-header-example {
	padding: $spacing-20;
	background: $color-bg-gray;
	min-height: 100vh;

	h2 {
		font-size: $font-size-xl;
		font-weight: $font-weight-bold;
		color: $color-text-primary;
		margin-bottom: $spacing-24;
	}

	.example-section {
		background: $color-white;
		border-radius: $border-radius-lg;
		padding: $spacing-20;
		margin-bottom: $spacing-24;
		box-shadow: $shadow-base;

		h3 {
			font-size: $font-size-lg;
			font-weight: $font-weight-semibold;
			color: $color-text-primary;
			margin-bottom: $spacing-16;
		}

		pre {
			background: $color-gray-3;
			padding: $spacing-12;
			border-radius: $border-radius-base;
			font-size: $font-size-sm;
			color: $color-text-secondary;
			overflow-x: auto;
		}
	}
}
</style>
