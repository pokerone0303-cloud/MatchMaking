<script setup lang="ts">
import { ref } from 'vue';
import FilterHeader from '@/components/common/FilterHeader.vue';
import StatsBlock from '@/components/common/StatsBlock.vue';
import StoreCard from '@/components/cards/StoreCard.vue';
import EditStoreDialog from '@/components/dialogs/EditLocationDialog.vue';
import type { FilterConfig } from '@/types/filter';
import type { TimesheetRecord } from '@/types/timesheet';

defineOptions({
	name: 'UserTimesheetsView',
});

// 篩選配置
const filterConfig = ref<FilterConfig>({
	fields: [
		{
			type: 'search',
			key: 'search',
			label: '搜尋',
			placeholder: '搜尋商家、職位或時數編號',
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
				{ text: '已確認', value: 'approved' },
				{ text: '已調整', value: 'adjusted' }
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
				{ text: '工作日期早到晚', value: 'date_early' },
				{ text: '工作日期晚到早', value: 'date_late' }
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

// 統計資料
const statsData = ref([
	{
		id: 'total-shifts',
		value: 5,
		label: '總振點數',
		color: 'blue' as const
	},
	{
		id: 'operating',
		value: 3,
		label: '營運中',
		color: 'green' as const
	},
	{
		id: 'operating',
		value: 10,
		label: '成功錄取',
		color: 'green' as const
	}
]);

// 處理統計項目點擊
const handleStatClick = (item: { id: string; value: number; label: string; color?: string }) => {
	console.log('點擊統計項目:', item);
	// 可以在這裡處理點擊邏輯，例如跳轉到詳細頁面
};

// 模擬時數記錄資料
const timesheets = ref<TimesheetRecord[]>([
	{
		id: 'TS20240913',
		date: '2024-09-13',
		startTime: '20:00',
		endTime: '02:00',
		breakDuration: 0,
		location: '台北中山店',
		address: '台北市中山區',
		shiftId: 'SH001',
		workingHours: 6,
		status: 'pending'
	},
	{
		id: 'TS20240912',
		date: '2024-09-12',
		startTime: '14:00',
		endTime: '22:00',
		breakDuration: 60,
		location: '台北信義店',
		address: '台北市信義區',
		shiftId: 'SH002',
		workingHours: 7,
		status: 'approved'
	},
	{
		id: 'TS20240911',
		date: '2024-09-11',
		startTime: '10:00',
		endTime: '18:00',
		breakDuration: 60,
		location: '台北西門店',
		address: '台北市萬華區',
		shiftId: 'SH003',
		workingHours: 7,
		status: 'adjusted',
		adjustedHours: 6.5
	}
]);

// 處理查看詳細
const handleViewDetails = (store: {
	id: string;
	name: string;
	address: string;
	contactPerson: string;
	employeeCount: number;
	phone: string;
	capacity: number;
	totalShifts: number;
	inProgress: number;
	facilities: string[];
	operatingHours: string;
	remarks: string;
	establishmentDate: string;
	status: 'operating' | 'maintenance' | 'closed';
	email?: string;
}) => {
	console.log('查看詳細:', store);
	// 這裡可以開啟詳細彈窗
};

// 處理編輯
const handleEdit = (store: {
	id: string;
	name: string;
	address: string;
	contactPerson: string;
	employeeCount: number;
	phone: string;
	capacity: number;
	totalShifts: number;
	inProgress: number;
	facilities: string[];
	operatingHours: string;
	remarks: string;
	establishmentDate: string;
	status: 'operating' | 'maintenance' | 'closed';
	email?: string;
}) => {
	console.log('編輯:', store);
	// 這裡可以開啟編輯表單
};

// 處理更新
const handleUpdate = (data: Record<string, string | number>) => {
	console.log('更新據點資料:', data);
	// 這裡可以調用 API 更新據點資料
};

// 將 TimesheetRecord 轉換為 StoreData 格式
const convertToStoreData = (timesheet: TimesheetRecord) => {
	return {
		id: timesheet.id,
		name: `${timesheet.location}店`,
		address: timesheet.address,
		contactPerson: '店長',
		employeeCount: 15,
		phone: '02-1234-5678',
		capacity: 100,
		totalShifts: 25,
		inProgress: 3,
		facilities: ['百家樂', '輪盤'],
		operatingHours: '14:00-02:00',
		remarks: '正常營運中',
		establishmentDate: '2023-01-01',
		status: 'operating' as const,
		email: 'store@example.com'
	};
};

// 處理新增據點
const showAddDialog = ref(false);

const handleAddStore = () => {
	console.log('新增據點');
	showAddDialog.value = true;
};

const handleAddStoreUpdate = (data: Record<string, string | number>) => {
	console.log('新增據點資料:', data);
	// 這裡可以調用 API 新增據點資料
	showAddDialog.value = false;
};

const handleAddStoreClose = () => {
	showAddDialog.value = false;
};
</script>

<template>
	<div class="user-timesheets">
		<!-- 重複用 頂部篩選用元件 props 值 sticky top-0-->
		<FilterHeader title="實際上班時數" :filter-config="filterConfig" :sticky="true" @update-filter="handleFilterChange"
			@search="handleSearch" @toggle-filter="handleToggleFilter" @reset="handleReset" :show-add-button="true"
			add-button-text="新增據點" @add="handleAddStore" />

		<!-- 統計卡片元件區塊 -->
		<div class="employer-statistics__stats-section">
			<StatsBlock :data="statsData" @item-click="handleStatClick" />
		</div>

		<!-- 內容區域 -->
		<div class="user-timesheets__content">
			<!-- 時數記錄列表 -->
			<div v-if="timesheets.length > 0" class="user-timesheets__list">
				<StoreCard v-for="timesheet in timesheets" :key="timesheet.id" :store="convertToStoreData(timesheet)"
					@view-details="handleViewDetails" @edit="handleEdit" @update="handleUpdate" />
			</div>

			<!-- 空狀態 -->
			<div v-else class="user-timesheets__empty">
				<van-empty description="暫無時數記錄" />
			</div>
		</div>

		<!-- 新增據點對話框 -->
		<EditStoreDialog v-model:show="showAddDialog" mode="add" @update="handleAddStoreUpdate"
			@close="handleAddStoreClose" />
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.user-timesheets {
	min-height: 100vh;
	background: $color-bg-gray;

	&__content {
		padding: $spacing-8 $spacing-8;
	}

	&__empty {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 200px;
	}
}

.employer-statistics {
	&__stats-section {
		padding: $spacing-8 $spacing-8;
		background: transparent;
	}
}

// 新增據點按鈕樣式
.add-store-btn {
	position: fixed;
	top: $spacing-8;
	right: $spacing-8;
	z-index: $z-index-fixed;
	display: flex;
	align-items: center;
	gap: $spacing-4;
	padding: $spacing-8 $spacing-12;
	background: $color-primary;
	color: $color-white;
	border: none;
	border-radius: $border-radius-base;
	font-size: $font-size-sm;
	font-weight: $font-weight-medium;
	line-height: 1;
	box-shadow: $shadow-lg;
	cursor: pointer;
	transition: all 0.3s ease;
	width: fit-content;
	height: fit-content;

	&:active {
		transform: translateY(0);
	}

	&__icon {
		font-size: $font-size-sm;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.user-timesheets {
		&__content {
			padding: $spacing-20;
		}
	}
}
</style>