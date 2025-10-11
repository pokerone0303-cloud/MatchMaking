<template>
	<div class="user-shifts">
		<!-- 使用 FilterHeader 組件 -->
		<FilterHeader title="班別管理" :filter-config="filterConfig" :sticky="true" :show-title="false"
			@update-filter="handleFilterChange" @search="handleSearch" @toggle-filter="handleToggleFilter"
			@reset="handleReset" />

		<div class="content-container">
			<!-- 快捷狀態篩選按鈕 -->
			<div class="status-filter-buttons">
				<button v-for="status in statusOptions" :key="status.value" @click="handleStatusFilter(status.value)" :class="{
					active: selectedStatus === status.value,
					[`status-btn--${status.value}`]: true
				}" class="status-btn">
					{{ status.label }}
					<span v-if="statusCounts[status.value] > 0" class="count-badge">
						({{ statusCounts[status.value] }})
					</span>
				</button>
			</div>

			<!-- 班表卡片列表 -->
			<div class="shifts-list">
				<EShiftCard v-for="shift in filteredShifts" :key="shift.id" :time-range="shift.timeRange"
					:position="shift.position" :company="shift.company" :address="shift.address" :hourly-wage="shift.hourlyWage"
					:hired-count="shift.hiredCount" :total-count="shift.totalCount" :deadline="shift.deadline"
					:status="shift.status" :application-status="shift.applicationStatus" @apply="handleApply"
					@withdraw="handleWithdraw" @details="handleDetails" @edit="handleEdit" @delete="handleDelete" />
			</div>
		</div>

	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import EShiftCard from '@/components/cards/EShiftCard.vue';
import FilterHeader from '@/components/common/FilterHeader.vue';
import { useDialog } from '@/composables/useDialog';
import type { FilterConfig } from '@/types/filter';

defineOptions({
	name: 'UserShiftsView',
});

// 使用 Dialog 方法
const { showAlert, showConfirm, showSuccess, showError, showDangerConfirm } = useDialog();

// 模擬班表數據
const shifts = ref([
	{
		id: '1',
		timeRange: '14:00-22:00',
		position: '發牌員',
		company: '星光娛樂城',
		address: '新北市板橋區',
		hourlyWage: 450,
		hiredCount: 5,
		totalCount: 6,
		deadline: '今日13:00',
		status: 'open' as const,
		applicationStatus: 'applied' as const,
	},
	{
		id: '2',
		timeRange: '20:00-02:00',
		position: '百家樂荷官',
		company: '金沙會館',
		address: '台北市中山區',
		hourlyWage: 600,
		hiredCount: 12,
		totalCount: 12,
		deadline: '',
		status: 'full' as const,
		applicationStatus: 'not-hired' as const,
	},
	{
		id: '3',
		timeRange: '18:00-23:00',
		position: '桌邊荷官',
		company: '豪華賭場',
		address: '台北市信義區',
		hourlyWage: 500,
		hiredCount: 8,
		totalCount: 10,
		deadline: '今日17:00',
		status: 'open' as const,
		applicationStatus: null,
	},
	{
		id: '4',
		timeRange: '10:00-18:00',
		position: '輪盤荷官',
		company: '皇家賭場',
		address: '台北市松山區',
		hourlyWage: 550,
		hiredCount: 0,
		totalCount: 4,
		deadline: '明日09:00',
		status: 'draft' as const,
		applicationStatus: null,
	},
	{
		id: '5',
		timeRange: '16:00-24:00',
		position: '21點荷官',
		company: '鑽石娛樂',
		address: '台北市大安區',
		hourlyWage: 480,
		hiredCount: 6,
		totalCount: 6,
		deadline: '已截止',
		status: 'closed' as const,
		applicationStatus: null,
	},
]);

// 班別狀況狀態
const shiftStatus = ref<'available' | 'unavailable'>('unavailable');
const selectedDate = ref('今天');

// 狀態篩選相關
const selectedStatus = ref('all');
const statusOptions = ref([
	{ label: '全部', value: 'all' },
	{ label: '草稿', value: 'draft' },
	{ label: '開放', value: 'open' },
	{ label: '額滿', value: 'full' },
	{ label: '截止', value: 'closed' }
]);

// 狀態計數
const statusCounts = ref<Record<string, number>>({
	all: 0,
	draft: 0,
	open: 0,
	full: 0,
	closed: 0
});

// 初始化選中的日期為今日
const initializeSelectedDate = () => {
	const status = getDateStatus(today);

	if (status === 'available') {
		shiftStatus.value = 'available';
	} else if (status === 'unavailable') {
		shiftStatus.value = 'unavailable';
	}

	selectedDate.value = '今天';
};

// 篩選配置
const filterConfig = ref<FilterConfig>({
	fields: [
		{
			type: 'search',
			key: 'search',
			label: '搜尋',
			placeholder: '搜尋職位/商家',
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
				{ text: '尚有缺額', value: 'available' },
				{ text: '暫無缺額', value: 'unavailable' }
			]
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
				{ text: '桌邊荷官', value: 'table' }
			]
		},
		{
			type: 'date',
			key: 'date',
			label: '工作日期',
			placeholder: '選擇日期',
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
				{ text: '時薪高到低', value: 'wage_high' },
				{ text: '時薪低到高', value: 'wage_low' }
			]
		}
	],
	values: {
		search: '',
		status: 'all',
		position: 'all',
		date: '',
		sortBy: 'newest'
	}
});

// 搜尋和篩選狀態
const searchQuery = ref('');

// 模擬日期狀態數據（藍色：有缺額，紅色：無缺額，藍色：今日）
const dateStatusMap = ref<Record<string, 'available' | 'unavailable' | 'today'>>({
	'2025-08-31': 'unavailable',
	'2025-09-01': 'unavailable',
	'2025-09-02': 'unavailable',
	'2025-09-03': 'unavailable',
	'2025-09-04': 'available',
	'2025-09-05': 'available',
	'2025-09-06': 'available',
	'2025-09-07': 'unavailable',
	'2025-09-08': 'unavailable',
	'2025-09-09': 'available',
	'2025-09-10': 'available',
	'2025-09-11': 'available',
	'2025-09-12': 'today', // 今日
	'2025-09-13': 'available',
	'2025-09-14': 'unavailable',
	'2025-09-15': 'available',
	'2025-09-16': 'available',
	'2025-09-17': 'unavailable',
	'2025-09-18': 'available',
	'2025-09-19': 'available',
	'2025-09-20': 'available',
	'2025-09-21': 'unavailable',
	'2025-09-22': 'available',
	'2025-09-23': 'available',
	'2025-09-24': 'available',
	'2025-09-25': 'available',
	'2025-09-26': 'available',
	'2025-09-27': 'available',
	'2025-09-28': 'available',
	'2025-09-29': 'available',
	'2025-09-30': 'unavailable',
	'2025-10-01': 'available',
	'2025-10-02': 'unavailable',
	'2025-10-03': 'available',
	'2025-10-04': 'available',
	'2025-10-05': 'available',
});

// 格式化日期為 YYYY-MM-DD（使用本地時間）
const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

// 計算今日日期（使用本地時間）
const today = new Date();


// 獲取日期狀態
const getDateStatus = (date: Date) => {
	const dateString = formatDate(date);
	return dateStatusMap.value[dateString] || '';
};

// 計算狀態計數
const calculateStatusCounts = () => {
	const counts = {
		all: shifts.value.length,
		draft: 0,
		open: 0,
		full: 0,
		closed: 0
	};

	shifts.value.forEach(shift => {
		switch (shift.status) {
			case 'draft':
				counts.draft++;
				break;
			case 'open':
				counts.open++;
				break;
			case 'full':
				counts.full++;
				break;
			case 'closed':
				counts.closed++;
				break;
		}
	});

	statusCounts.value = counts;
};

// 狀態篩選處理
const handleStatusFilter = (status: string) => {
	selectedStatus.value = status;
	// 這裡可以添加篩選邏輯
	console.log('篩選狀態:', status);
};

// 獲取篩選後的班表列表
const filteredShifts = computed(() => {
	if (selectedStatus.value === 'all') {
		return shifts.value;
	}
	return shifts.value.filter(shift => shift.status === selectedStatus.value);
});


// FilterHeader 事件處理
const handleFilterChange = (key: string, value: string | number) => {
	// 確保響應式更新
	filterConfig.value = {
		...filterConfig.value,
		values: {
			...filterConfig.value.values,
			[key]: value
		}
	};

	// 同步更新原有的狀態
	if (key === 'search') {
		searchQuery.value = value as string;
	} else if (key === 'status') {
		shiftStatus.value = value as 'available' | 'unavailable';
	}

	console.log('篩選變更:', key, value);
	// 在這裡處理篩選邏輯
};

const handleSearch = (value: string) => {
	console.log('搜尋:', value);
	filterConfig.value.values.search = value;
	searchQuery.value = value;
	// 在這裡處理搜尋邏輯
};

const handleToggleFilter = () => {
	console.log('切換篩選選單');
};

const handleReset = () => {
	console.log('重置篩選');
	filterConfig.value.values = {
		search: '',
		status: 'all',
		position: 'all',
		date: '',
		sortBy: 'newest'
	};
	searchQuery.value = '';
	shiftStatus.value = 'unavailable';
};


// 組件掛載時初始化
onMounted(() => {
	initializeSelectedDate();
	calculateStatusCounts();
});


const handleApply = async (shiftId: string) => {
	console.log('應徵班表:', shiftId);

	// 使用確認窗口進行應徵確認
	const confirmed = await showConfirm({
		title: '應徵確認',
		message: '確定要應徵這個班表嗎？',
		confirmButtonText: '確認應徵',
		cancelButtonText: '取消',
	});

	if (confirmed) {
		try {
			// 這裡可以添加應徵 API 調用
			// await applyShift(shiftId);

			// 顯示成功提示
			await showSuccess('應徵成功！請等待商家審核結果。');

			// 更新班表狀態
			const shift = shifts.value.find(s => s.id === shiftId);
			if (shift) {
				shift.applicationStatus = 'applied';
			}
		} catch {
			// 顯示錯誤提示
			await showError('應徵失敗，請稍後再試。');
		}
	}
};

const handleWithdraw = async (shiftId: string) => {
	console.log('撤回班表:', shiftId);

	// 使用危險操作確認窗口
	const confirmed = await showDangerConfirm('確定要撤回這個班表的應徵嗎？');

	if (confirmed) {
		try {
			// 這裡可以添加撤回 API 調用
			// await withdrawShift(shiftId);

			// 顯示成功提示
			await showSuccess('已成功撤回應徵。');

			// 更新班表狀態
			const shift = shifts.value.find(s => s.id === shiftId);
			if (shift) {
				shift.applicationStatus = null;
			}
		} catch {
			// 顯示錯誤提示
			await showError('撤回失敗，請稍後再試。');
		}
	}
};

// 處理編輯班別
const handleEdit = async (shiftId: string, data: Record<string, string | number>) => {
	console.log('編輯班別:', shiftId, data);

	try {
		// 這裡可以添加編輯 API 調用
		// await updateShift(shiftId, data);

		// 顯示成功提示
		await showSuccess('班別已成功更新。');

		// 更新本地數據
		const shift = shifts.value.find(s => s.id === shiftId);
		if (shift) {
			// 更新班別數據
			shift.position = data.position as string;
			shift.hourlyWage = data.hourlyWage as number;
			shift.totalCount = data.requiredStaff as number;
			// 其他欄位更新...
		}
	} catch {
		// 顯示錯誤提示
		await showError('更新失敗，請稍後再試。');
	}
};

// 處理刪除班別
const handleDelete = async (shiftId: string) => {
	console.log('刪除班別:', shiftId);

	try {
		// 這裡可以添加刪除 API 調用
		// await deleteShift(shiftId);

		// 顯示成功提示
		await showSuccess('班別已成功刪除。');

		// 從列表中移除
		const index = shifts.value.findIndex(s => s.id === shiftId);
		if (index > -1) {
			shifts.value.splice(index, 1);
		}
	} catch {
		// 顯示錯誤提示
		await showError('刪除失敗，請稍後再試。');
	}
};

const handleDetails = async (shiftId: string) => {
	console.log('查看詳細資料:', shiftId);

	// 使用提示窗口顯示詳細資料
	const shift = shifts.value.find(s => s.id === shiftId);
	if (shift) {
		await showAlert({
			title: '班表詳細資料',
			message: `
			職位：${shift.position}
			公司：${shift.company}
			地址：${shift.address}
			時段：${shift.timeRange}
			時薪：$${shift.hourlyWage}
			已錄取：${shift.hiredCount}/${shift.totalCount} 人
			截止時間：${shift.deadline || '無'}
		`.trim(),
		});
	}
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.available {
	background: $color-green-1;
}

.available-top-info {
	background: $color-green-2;
}

.unavailable {
	background: $color-red-1;
}

.unavailable-top-info {
	background: $color-red-2;
}

.today-top-info {
	background: $color-blue-2;
}

.user-shifts {
	height: 100%;
	width: 100%;
	margin: 0 auto;

	h1 {
		font-size: $font-size-xl;
		font-weight: $font-weight-bold;
		color: $color-gray-900;
		margin-bottom: $spacing-12;
		text-align: center;
	}


	.content-container {
		padding: $spacing-8;
	}

	// 狀態篩選按鈕樣式
	.status-filter-buttons {
		display: flex;
		gap: $spacing-8;
		margin-bottom: $spacing-12;
		overflow-x: auto;

		&::-webkit-scrollbar {
			display: none;
		}

		.status-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: $spacing-4 $spacing-8;
			border-radius: $border-radius-md;
			border: 1px solid $color-gray-300;
			background: $color-white;
			color: $color-gray-700;
			font-size: $font-size-xs;
			font-weight: $font-weight-medium;
			line-height: 1;
			white-space: nowrap;
			cursor: pointer;

			&.active {
				background: $color-primary;
				border-color: $color-primary;
				color: $color-white;

				.count-badge {
					color: $color-white;
				}
			}

			.count-badge {
				color: $color-gray-600;
				padding: $spacing-4;
				border-radius: $border-radius-sm;
				font-size: $font-size-xs;
				font-weight: $font-weight-semibold;
			}

			// 不同狀態的顏色
			&--draft {
				&.active {
					background: $color-gray-600;
					border-color: $color-gray-600;
				}
			}

			&--open {
				&.active {
					background: $color-green-600;
					border-color: $color-green-600;
				}
			}

			&--full {
				&.active {
					background: $color-orange-600;
					border-color: $color-orange-600;
				}
			}

			&--closed {
				&.active {
					background: $color-red-600;
					border-color: $color-red-600;
				}
			}
		}
	}

	.search-update-filter-calendar {
		margin-bottom: $spacing-12;
		// 這裡可以添加搜尋欄位的樣式

		.test-controls {
			display: flex;
			gap: $spacing-8;
			margin-bottom: $spacing-8;
			justify-content: center;

			.test-btn {
				padding: $spacing-xs $spacing-8;
				border-radius: $border-radius-md;
				font-size: $font-size-xs;
				font-weight: $font-weight-medium;
				border: 1px solid;
				cursor: pointer;
				// transition: all $animation-duration-fast $animation-easing-ease-out;

				&--available {
					background: $color-white;
					border-color: $color-green-100;
					color: $color-green-700;

					&.active {
						background: $color-green-100;
						border-color: $color-green-700;
						color: $color-green-700;
					}

					&:hover {
						background: $color-green-50;
					}
				}

				&--unavailable {
					background: $color-white;
					border-color: $color-red-300;
					color: $color-red-600;

					&.active {
						background: $color-red-100;
						border-color: $color-red-700;
						color: $color-red-700;
					}

					&:hover {
						background: $color-red-50;
					}
				}
			}
		}
	}

	.tip-message {
		margin-bottom: $spacing-12;
		// 這裡可以添加提示訊息的樣式
	}

	.shifts-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-8;
		width: 100%;
	}
}

// 針對 iPhone 8 的額外優化
@media (max-width: 375px) {
	.user-shifts {
		padding: $spacing-xs;
		max-width: 100%;

		h1 {
			font-size: $font-size-lg;
			margin-bottom: $spacing-8;
		}

		.shifts-list {
			gap: $spacing-8;
		}
	}
}
</style>
