<script setup lang="ts">
import { ref, computed } from 'vue';
import FilterHeader from '@/components/common/FilterHeader.vue';
import StatsBlock from '@/components/common/StatsBlock.vue';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import type { FilterConfig, FilterField } from '@/types/filter';

defineOptions({
	name: 'AdminReportsView',
});

// 篩選值狀態
const filterValues = ref({
	dateRange: 'thisMonth' as 'today' | 'thisWeek' | 'thisMonth' | 'custom',
	sortBy: 'newest',
	startDate: '',
	endDate: ''
});

// 日期計算函數
const getTodayDate = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const getWeekStartAndEnd = () => {
	const today = new Date();
	const dayOfWeek = today.getDay(); // 0 = 週日, 1 = 週一, ..., 6 = 週六

	// 計算週一開始日期
	// 如果是週日（0），則往前推6天到上一個週一
	// 如果是週一到週六（1-6），則往前推 (dayOfWeek - 1) 天到本週一
	const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
	const startDate = new Date(today);
	startDate.setDate(today.getDate() - daysToMonday);
	const endDate = new Date(today);

	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	return {
		start: formatDate(startDate),
		end: formatDate(endDate)
	};
};

const getMonthStartAndEnd = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();

	const startDate = new Date(year, month, 1);
	const endDate = new Date(year, month + 1, 0);

	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	return {
		start: formatDate(startDate),
		end: formatDate(endDate)
	};
};

// 自動計算日期範圍
const autoCalculateDates = () => {
	switch (filterValues.value.dateRange) {
		case 'today':
			const today = getTodayDate();
			filterValues.value.startDate = today;
			filterValues.value.endDate = today;
			break;
		case 'thisWeek':
			const weekDates = getWeekStartAndEnd();
			filterValues.value.startDate = weekDates.start;
			filterValues.value.endDate = weekDates.end;
			break;
		case 'thisMonth':
			const monthDates = getMonthStartAndEnd();
			filterValues.value.startDate = monthDates.start;
			filterValues.value.endDate = monthDates.end;
			break;
		case 'custom':
			// 自訂範圍不自動計算，使用用戶選擇的值
			break;
	}
};

// 初始化日期
autoCalculateDates();

// 動態生成篩選配置
const filterConfig = computed<FilterConfig>(() => {
	const isCustomRange = filterValues.value.dateRange === 'custom';

	const fields: FilterField[] = [
		// 1. 固定日期範圍選擇
		{
			type: 'select',
			key: 'dateRange',
			label: '日期範圍',
			placeholder: '選擇日期範圍',
			width: 'half',
			options: [
				{ text: '今日', value: 'today' },
				{ text: '本周', value: 'thisWeek' },
				{ text: '本月', value: 'thisMonth' },
				{ text: '自訂範圍', value: 'custom' }
			]
		},
		// 2. 排序
		{
			type: 'select',
			key: 'sortBy',
			label: '排序',
			placeholder: '選擇排序方式',
			width: 'half',
			options: [
				{ text: '由最新到最舊', value: 'newest' },
				{ text: '由最舊到最新', value: 'oldest' }
			]
		},
		// 3. 開始日期（固定範圍時禁用）
		{
			type: 'date',
			key: 'startDate',
			label: '開始日期',
			placeholder: '開始日期',
			width: 'half',
			disabled: !isCustomRange
		},
		// 4. 結束日期（固定範圍時禁用）
		{
			type: 'date',
			key: 'endDate',
			label: '結束日期',
			placeholder: '結束日期',
			width: 'half',
			disabled: !isCustomRange
		}
	];

	return {
		fields,
		values: filterValues.value
	};
});

// 統計資料
const statsData = ref([
	{
		id: 'total-users',
		value: 156,
		label: '總用戶數',
		color: 'blue' as const
	},
	{
		id: 'total-employers',
		value: 23,
		label: '總商家數',
		color: 'green' as const
	},
	{
		id: 'total-shifts',
		value: 342,
		label: '總班別數',
		color: 'orange' as const
	},
	{
		id: 'accumulated-hours',
		value: 8420,
		label: '累積工時',
		color: 'purple' as const
	}
]);

// FilterHeader 事件處理
const handleFilterChange = (key: string, value: string | number) => {
	// 更新篩選值
	if (key === 'dateRange') {
		filterValues.value.dateRange = value as 'today' | 'thisWeek' | 'thisMonth' | 'custom';
		// 當選擇日期範圍變更時，自動計算日期
		autoCalculateDates();
	} else {
		(filterValues.value as Record<string, string | number>)[key] = value;
	}

	console.log('篩選變更:', key, value);
};

const handleSearch = (value: string) => {
	console.log('搜尋:', value);
};

const handleToggleFilter = () => {
	console.log('切換篩選選單');
};

const handleReset = () => {
	console.log('重置篩選');
	filterValues.value = {
		dateRange: 'thisMonth',
		sortBy: 'newest',
		startDate: '',
		endDate: ''
	};
	// 重新計算日期
	autoCalculateDates();
};

// TAB 切換狀態
const activeTab = ref('overview');

// 處理 TAB 切換
const handleTabChange = (name: string | number) => {
	activeTab.value = name as string;
	console.log('切換到 TAB:', name);
};

// 處理統計項目點擊
const handleStatClick = (item: { id: string; value: number; label: string; color?: string }) => {
	console.log('點擊統計項目:', item);
	// 可以根據點擊的統計項目跳轉到詳細頁面或進行篩選
};

// 圖表資料 - 用戶註冊趨勢
const userRegistrationData = computed(() => ({
	labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
	datasets: [
		{
			label: '註冊用戶數',
			data: [45, 52, 38, 67, 89, 156],
			backgroundColor: 'rgba(47, 128, 237, 0.8)',
			borderColor: 'rgba(47, 128, 237, 1)',
			borderWidth: 2
		}
	]
}));

// 圖表資料 - 商家營運分析
const employerAnalysisData = computed(() => ({
	labels: ['開業', '營運中', '暫停', '審核中'],
	datasets: [
		{
			label: '商家狀態分布',
			data: [12, 8, 2, 1],
			backgroundColor: [
				'rgba(39, 174, 96, 0.8)',
				'rgba(47, 128, 237, 0.8)',
				'rgba(245, 153, 74, 0.8)',
				'rgba(155, 155, 155, 0.8)'
			],
			borderColor: [
				'rgba(39, 174, 96, 1)',
				'rgba(47, 128, 237, 1)',
				'rgba(245, 153, 74, 1)',
				'rgba(155, 155, 155, 1)'
			],
			borderWidth: 2
		}
	]
}));

// 圖表資料 - 工時變化趨勢
const workingHoursTrendData = computed(() => ({
	labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
	datasets: [
		{
			label: '平均工時',
			data: [8.5, 9.2, 8.8, 9.5, 9.0, 10.2, 9.8],
			borderColor: 'rgba(127, 95, 223, 1)',
			backgroundColor: 'rgba(127, 95, 223, 0.1)',
			fill: true,
			tension: 0.4,
			borderWidth: 3
		}
	]
}));

// 圖表資料 - 班別類型分布
const shiftTypeData = computed(() => ({
	labels: ['發牌員', '荷官', '輪盤', '21點', '百家樂'],
	datasets: [
		{
			label: '班別數量',
			data: [124, 89, 67, 45, 17],
			backgroundColor: [
				'rgba(47, 128, 237, 0.8)',
				'rgba(39, 174, 96, 0.8)',
				'rgba(245, 153, 74, 0.8)',
				'rgba(235, 87, 87, 0.8)',
				'rgba(127, 95, 223, 0.8)'
			],
			borderColor: [
				'rgba(47, 128, 237, 1)',
				'rgba(39, 174, 96, 1)',
				'rgba(245, 153, 74, 1)',
				'rgba(235, 87, 87, 1)',
				'rgba(127, 95, 223, 1)'
			],
			borderWidth: 2
		}
	]
}));
</script>
<template>
	<div class="admin-reports">
		<!-- 使用 FilterHeader 組件 -->
		<FilterHeader title="報表統計" :filter-config="filterConfig" :sticky="true" :show-title="false"
			@update-filter="handleFilterChange" @search="handleSearch" @toggle-filter="handleToggleFilter"
			@reset="handleReset" />

		<!-- TAB 切換:總覽 和 明細 -->
		<van-tabs v-model:active="activeTab" @change="handleTabChange" class="admin-reports__tabs">
			<van-tab title="總覽" name="overview">
				<!-- 統計卡片元件區塊 -->
				<div class="admin-reports__stats-section">
					<StatsBlock :data="statsData" @item-click="handleStatClick" />
				</div>

				<!-- chart 各類圖表元件-->
				<div class="admin-reports__charts-section">
					<!-- 用戶註冊趨勢 - 柱狀圖 -->
					<BarChart :labels="userRegistrationData.labels" :datasets="userRegistrationData.datasets" title="用戶註冊趨勢"
						:height="280" class="admin-reports__chart-item" />

					<!-- 商家狀態分布 - 餅圖 -->
					<PieChart :labels="employerAnalysisData.labels" :datasets="employerAnalysisData.datasets" title="商家狀態分布"
						:height="300" class="admin-reports__chart-item" />

					<!-- 工時變化趨勢 - 折線圖 -->
					<LineChart :labels="workingHoursTrendData.labels" :datasets="workingHoursTrendData.datasets" title="平均工時變化趨勢"
						:height="280" class="admin-reports__chart-item" />

					<!-- 班別類型分布 - 柱狀圖 -->
					<BarChart :labels="shiftTypeData.labels" :datasets="shiftTypeData.datasets" title="班別類型分布" :height="280"
						class="admin-reports__chart-item" />
				</div>
			</van-tab>
			<van-tab title="明細" name="detail">
				<!-- 明細內容區塊 -->
				<div class="admin-reports__detail-section">
					<!-- 明細內容將在這裡顯示 -->
					<p>明細內容</p>
				</div>
			</van-tab>
		</van-tabs>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.admin-reports {
	width: 100%;
	min-height: 100vh;
	background: $color-bg-gray;

	&__tabs {
		background: $color-white;
		border-bottom: 1px solid $color-gray-2;

		:deep(.van-tabs__nav) {
			background: $color-white;
		}

		:deep(.van-tabs__line) {
			background: $color-primary;
			height: 3px;
		}

		:deep(.van-tab) {
			color: $color-text-secondary;
			font-size: $font-size-base;
			font-weight: $font-weight-medium;
		}

		:deep(.van-tab--active) {
			color: $color-primary;
		}

		:deep(.van-tabs__content) {
			background: $color-bg-gray;
		}
	}

	&__stats-section {
		padding: $spacing-16 $spacing-8;
		background: transparent;
	}

	&__charts-section {
		padding: 0 $spacing-8 $spacing-16;
		background: $color-bg-gray;
	}

	&__chart-item {
		margin-bottom: $spacing-16;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__detail-section {
		padding: $spacing-16 $spacing-8;
		background: $color-bg-gray;
		min-height: 200px;
	}
}
</style>