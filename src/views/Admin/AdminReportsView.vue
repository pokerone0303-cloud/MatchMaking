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

// 明細資料
const detailData = ref([
	{ date: '2025-10-20', users: 12, employers: 3, shifts: 28, hours: 240 },
	{ date: '2025-10-21', users: 15, employers: 4, shifts: 32, hours: 280 },
	{ date: '2025-10-22', users: 18, employers: 5, shifts: 38, hours: 320 },
	{ date: '2025-10-23', users: 22, employers: 6, shifts: 45, hours: 380 },
	{ date: '2025-10-24', users: 19, employers: 5, shifts: 35, hours: 290 },
	{ date: '2025-10-25', users: 25, employers: 7, shifts: 52, hours: 450 },
	{ date: '2025-10-26', users: 28, employers: 8, shifts: 58, hours: 510 },
	{ date: '2025-10-27', users: 32, employers: 9, shifts: 65, hours: 580 },
	{ date: '2025-10-28', users: 35, employers: 10, shifts: 72, hours: 650 },
	{ date: '2025-10-29', users: 40, employers: 11, shifts: 85, hours: 750 },
	{ date: '2025-10-30', users: 38, employers: 10, shifts: 78, hours: 690 },
	{ date: '2025-10-31', users: 45, employers: 12, shifts: 95, hours: 850 },
	{ date: '2025-11-01', users: 52, employers: 13, shifts: 108, hours: 920 },
	{ date: '2025-11-02', users: 48, employers: 12, shifts: 98, hours: 820 },
	{ date: '2025-11-03', users: 55, employers: 14, shifts: 115, hours: 1000 },
	{ date: '2025-11-04', users: 60, employers: 15, shifts: 125, hours: 1100 },
	{ date: '2025-11-05', users: 58, employers: 15, shifts: 120, hours: 1050 },
	{ date: '2025-11-06', users: 65, employers: 16, shifts: 135, hours: 1200 },
	{ date: '2025-11-07', users: 70, employers: 17, shifts: 145, hours: 1300 },
	{ date: '2025-11-08', users: 68, employers: 17, shifts: 140, hours: 1250 },
	{ date: '2025-11-09', users: 75, employers: 18, shifts: 155, hours: 1400 },
	{ date: '2025-11-10', users: 80, employers: 19, shifts: 165, hours: 1500 },
	{ date: '2025-11-11', users: 78, employers: 19, shifts: 160, hours: 1450 },
	{ date: '2025-11-12', users: 85, employers: 20, shifts: 175, hours: 1600 },
	{ date: '2025-11-13', users: 90, employers: 21, shifts: 185, hours: 1700 },
	{ date: '2025-11-14', users: 88, employers: 21, shifts: 180, hours: 1650 },
	{ date: '2025-11-15', users: 95, employers: 22, shifts: 195, hours: 1800 },
	{ date: '2025-11-16', users: 100, employers: 23, shifts: 205, hours: 1900 },
	{ date: '2025-11-17', users: 98, employers: 23, shifts: 200, hours: 1850 },
	{ date: '2025-11-18', users: 105, employers: 24, shifts: 215, hours: 1950 }
]);

// 分頁相關狀態
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [
	{ text: '10/頁', value: 10 },
	{ text: '30/頁', value: 30 },
	{ text: '50/頁', value: 50 }
];
const jumpToPageInput = ref('');

// 計算分頁後的資料
const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value;
	const end = start + pageSize.value;
	return detailData.value.slice(start, end);
});

// 總頁數
const totalPages = computed(() => Math.ceil(detailData.value.length / pageSize.value));

// 處理每頁顯示數量變更
const handlePageSizeChange = (event: Event) => {
	const target = event.target as HTMLSelectElement;
	const size = Number(target.value);
	pageSize.value = size;
	currentPage.value = 1; // 重置到第一頁
	console.log('每頁顯示數量變更為', size);
};

// 處理跳往指定頁面
const handleJumpToPage = () => {
	const page = parseInt(jumpToPageInput.value);
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page;
		jumpToPageInput.value = '';
		console.log('跳往第', page, '頁');
	} else {
		console.log('頁數不在範圍內');
	}
};

// 格式化日期顯示
const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
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
					<!-- 明細表格 -->
					<div class="detail-table">
						<!-- 表頭 -->
						<div class="detail-table__header">
							<div class="detail-table__header-cell detail-table__header-cell--date">日期</div>
							<div class="detail-table__header-cell">用戶數</div>
							<div class="detail-table__header-cell">商家數</div>
							<div class="detail-table__header-cell">班別數</div>
							<div class="detail-table__header-cell">工時</div>
						</div>

						<!-- 表身 -->
						<div class="detail-table__body">
							<div v-for="(row, index) in paginatedData" :key="index" class="detail-table__row">
								<div class="detail-table__cell detail-table__cell--date">{{ formatDate(row.date) }}</div>
								<div class="detail-table__cell">{{ row.users }}</div>
								<div class="detail-table__cell">{{ row.employers }}</div>
								<div class="detail-table__cell">{{ row.shifts }}</div>
								<div class="detail-table__cell">{{ row.hours.toLocaleString() }}</div>
							</div>
						</div>
					</div>

					<!-- 分頁控制器 -->
					<div class="detail-pagination">
						<!-- 控制區域 -->
						<div class="detail-pagination__controls">
							<!-- 每頁顯示數量選擇器 -->
							<div class="detail-pagination__size-selector">
								<span class="detail-pagination__label">每頁顯示：</span>
								<select v-model="pageSize" @change="handlePageSizeChange" class="detail-pagination__select">
									<option v-for="option in pageSizeOptions" :key="option.value" :value="option.value">
										{{ option.text }}
									</option>
								</select>
							</div>

							<!-- 跳往指定頁面 -->
							<div class="detail-pagination__jump">
								<span class="detail-pagination__label">跳往頁數：</span>
								<div class="detail-pagination__jump-input">
									<van-field v-model="jumpToPageInput" type="number" :placeholder="currentPage.toString()"
										class="detail-pagination__input" input-align="center" />
									<van-button type="primary" size="small" @click="handleJumpToPage"
										class="detail-pagination__jump-btn">前往</van-button>
								</div>
								<span class="detail-pagination__total">共 {{ totalPages }} 頁</span>
							</div>

							<!-- 分頁器 -->
							<div class="detail-pagination__pagination">
								<van-pagination v-model="currentPage" :total-items="detailData.length" :items-per-page="pageSize"
									show-prev-next mode="simple" />
							</div>
						</div>
					</div>
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

// 明細表格樣式
.detail-table {
	background: $color-white;
	border-radius: $border-radius-md;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	margin-bottom: $spacing-16;

	&__header {
		display: grid;
		grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr;
		background: $color-primary;
		border-bottom: 2px solid $color-primary;
	}

	&__header-cell {
		padding: $spacing-12 $spacing-8;
		font-size: $font-size-sm;
		font-weight: $font-weight-semibold;
		color: $color-white;
		text-align: center;
		border-right: 1px solid rgba(255, 255, 255, 0.2);

		&:last-child {
			border-right: none;
		}

		&--date {
			font-weight: $font-weight-bold;
		}
	}

	&__body {
		max-height: 500px;
		overflow-y: auto;
	}

	&__row {
		display: grid;
		grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr;
		border-bottom: 1px solid $color-gray-2;
		transition: background-color 0.2s ease;

		&:hover {
			background: $color-gray-3;
		}

		&:last-child {
			border-bottom: none;
		}
	}

	&__cell {
		padding: $spacing-12 $spacing-8;
		font-size: $font-size-sm;
		color: $color-text-primary;
		text-align: center;
		border-right: 1px solid $color-gray-2;

		&:last-child {
			border-right: none;
		}

		&--date {
			font-weight: $font-weight-medium;
			color: $color-text-secondary;
		}
	}
}

// 分頁控制器樣式
.detail-pagination {
	padding: $spacing-16 $spacing-12 $spacing-12;
	background: $color-white;
	border-radius: $border-radius-md;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

	&__controls {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: $spacing-12;
		margin-bottom: $spacing-16;
	}

	&__size-selector {
		display: flex;
		align-items: center;
		gap: $spacing-8;
	}

	&__jump {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: $spacing-8;
	}

	&__jump-input {
		display: flex;
		align-items: center;
		gap: $spacing-8;
	}

	&__input {
		// flex: 0 0 80px;
		background: $color-gray-3;
		border-radius: $border-radius-base;
		padding: $spacing-4 $spacing-8;

		:deep(.van-cell__value) {
			width: 50px;
		}
	}

	&__jump-btn {
		flex-shrink: 0;
	}

	&__total {
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	&__label {
		font-size: $font-size-sm;
		color: $color-text-secondary;
		font-weight: $font-weight-medium;
		white-space: nowrap;
	}

	&__select {
		padding: $spacing-8 $spacing-12;
		background: $color-white;
		border: 1px solid $color-gray-2;
		border-radius: $border-radius-base;
		font-size: $font-size-sm;
		color: $color-text-primary;
		cursor: pointer;
		outline: none;
		transition: all 0.2s ease;

		&:hover {
			border-color: $color-primary;
		}

		&:focus {
			border-color: $color-primary;
			box-shadow: 0 0 0 2px rgba(47, 128, 237, 0.1);
		}

		option {
			padding: $spacing-8;
			background: $color-white;
			color: $color-text-primary;
		}
	}

	&__pagination {
		flex-shrink: 0;

		:deep(.van-pagination) {
			display: flex;
			justify-content: center;
		}

		:deep(.van-pagination__item--prev),
		:deep(.van-pagination__item--next) {
			white-space: nowrap;
			padding: $spacing-4 $spacing-8;
			background: transparent;
			border: 1px solid $color-gray-2;
			border-radius: $border-radius-base;
		}
	}
}
</style>