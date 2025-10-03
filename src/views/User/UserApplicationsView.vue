<script setup lang="ts">
import { ref } from 'vue';
import FilterHeader from '@/components/common/FilterHeader.vue';
import type { FilterConfig } from '@/types/filter';

defineOptions({
	name: 'UserApplicationsView',
});

// 篩選配置
const filterConfig = ref<FilterConfig>({
	fields: [
		{
			type: 'search',
			key: 'search',
			label: '搜尋',
			placeholder: '搜尋商家、職位或應徵編號',
			width: 'full'
		},
		{
			type: 'select',
			key: 'status',
			label: '狀態',
			placeholder: '選擇狀態',
			width: 'half',
			options: [
				{ text: '全部狀態', value: 'all' },
				{ text: '待審核', value: 'pending' },
				{ text: '已錄取', value: 'accepted' },
				{ text: '已拒絕', value: 'rejected' },
				{ text: '已撤回', value: 'withdrawn' }
			]
		},
		{
			type: 'select',
			key: 'employer',
			label: '商家',
			placeholder: '選擇商家',
			width: 'half',
			options: [
				{ text: '全部商家', value: 'all' },
				{ text: '豪華賭場', value: 'casino1' },
				{ text: '星光娛樂城', value: 'casino2' },
				{ text: '金沙會館', value: 'casino3' }
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
			type: 'select',
			key: 'sortBy',
			label: '排序',
			placeholder: '選擇排序方式',
			width: 'half',
			options: [
				{ text: '最新到最舊', value: 'newest' },
				{ text: '最舊到最新', value: 'oldest' },
				{ text: '申請時間早到晚', value: 'applied_early' },
				{ text: '申請時間晚到早', value: 'applied_late' }
			]
		},
		{
			type: 'number',
			key: 'pageSize',
			label: '每頁筆數',
			placeholder: '輸入每頁筆數',
			width: 'half',
			min: 5,
			max: 100,
			step: 5
		},
		{
			type: 'text',
			key: 'position',
			label: '職位',
			placeholder: '輸入職位關鍵字',
			width: 'full'
		}
	],
	values: {
		search: '',
		status: 'all',
		employer: 'all',
		startDate: '',
		endDate: '',
		sortBy: 'newest',
		pageSize: 10,
		position: ''
	}
});

// 處理篩選變更
const handleFilterChange = (key: string, value: string | number) => {
	// 確保響應式更新
	filterConfig.value = {
		...filterConfig.value,
		values: {
			...filterConfig.value.values,
			[key]: value
		}
	};
	// 在這裡處理篩選邏輯
};

// 處理搜尋
const handleSearch = (value: string) => {
	console.log('搜尋:', value);
	filterConfig.value.values.search = value;
	// 在這裡處理搜尋邏輯
};

// 處理篩選切換
const handleToggleFilter = () => {
	console.log('切換篩選選單');
};

// 處理重置
const handleReset = () => {
	console.log('重置篩選');
	filterConfig.value.values = {
		search: '',
		status: 'all',
		employer: 'all',
		startDate: '',
		endDate: '',
		sortBy: 'newest',
		pageSize: 10,
		position: ''
	};
};
</script>

<template>
	<div class="user-applications">
		<!-- 重複用 頂部篩選用元件 props 值 sticky top-0-->
		<FilterHeader title="應徵記錄" :filter-config="filterConfig" :sticky="true" @update-filter="handleFilterChange"
			@search="handleSearch" @toggle-filter="handleToggleFilter" @reset="handleReset" />

		<!-- 內容區域 -->
		<div class="user-applications__content">
			<!-- 這裡可以放置應徵記錄列表或其他內容 -->
			<div class="user-applications__placeholder">
				<p>應徵記錄內容將在此顯示</p>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.user-applications {
	min-height: 100vh;
	background: $color-bg-gray;

	&__content {
		padding: $spacing-16;
	}

	&__placeholder {
		background: $color-white;
		border-radius: $border-radius-lg;
		padding: $spacing-16;
		text-align: center;
		box-shadow: $shadow-base;
		border: 1px solid $color-gray-2;

		p {
			font-size: $font-size-base;
			color: $color-text-secondary;
			margin: 0;
		}
	}
}

// 響應式設計
@media (min-width: 768px) {
	.user-applications {
		&__content {
			padding: $spacing-20;
		}
	}
}
</style>