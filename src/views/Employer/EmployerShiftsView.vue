<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ShiftCard from '@/components/cards/ShiftCard.vue';
import ShiftStatusBanner from '@/components/common/ShiftStatusBanner.vue';
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
]);

// 班別狀況狀態
const shiftStatus = ref<'available' | 'unavailable'>('unavailable');
const selectedDate = ref('今天');

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

<template>
	<div class="user-shifts">
		<!-- 使用 FilterHeader 組件 -->
		<FilterHeader title="班別管理" :filter-config="filterConfig" :sticky="true" :show-title="false"
			@update-filter="handleFilterChange" @search="handleSearch" @toggle-filter="handleToggleFilter"
			@reset="handleReset" />

		<div class="content-container">
			<!-- 測試用：切換班別狀況狀態 -->
			<div class="search-update-filter-calendar">
				<div class="test-controls">
					<button @click="shiftStatus = 'available'" :class="{ active: shiftStatus === 'available' }"
						class="test-btn test-btn--available">
						尚有缺額
					</button>
					<button @click="shiftStatus = 'unavailable'" :class="{ active: shiftStatus === 'unavailable' }"
						class="test-btn test-btn--unavailable">
						暫無缺額
					</button>
				</div>
			</div>

			<!-- 班別狀況提示訊息 -->
			<ShiftStatusBanner :status="shiftStatus" :date="selectedDate" />

			<!-- 班表卡片列表 -->
			<div class="shifts-list">
				<ShiftCard v-for="shift in shifts" :key="shift.id" :time-range="shift.timeRange" :position="shift.position"
					:company="shift.company" :address="shift.address" :hourly-wage="shift.hourlyWage"
					:hired-count="shift.hiredCount" :total-count="shift.totalCount" :deadline="shift.deadline"
					:status="shift.status" :application-status="shift.applicationStatus" @apply="handleApply"
					@withdraw="handleWithdraw" @details="handleDetails" />
			</div>
		</div>

	</div>
</template>

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
