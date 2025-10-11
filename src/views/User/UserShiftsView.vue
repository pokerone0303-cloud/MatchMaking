<template>
	<div class="user-shifts">
		<!-- 篩選元件 -->
		<div class="filter-section">
			<!-- 搜尋欄位 -->
			<div class="search-bar">
				<van-search v-model="searchQuery" placeholder="搜尋職位/商家" @search="handleSearch" @clear="handleSearch"
					shape="round" background="#f7f8fa" />
				<div class="today-button" @click="handleTodayClick">
					<span>今天 {{ today.getMonth() + 1 }}/{{ today.getDate() }}</span>
				</div>
				<div class="refresh-button" @click="handleRefresh">
					<span>↻</span>
				</div>
			</div>

			<!-- 日期選擇區域 -->
			<div class="date-selection">
				<div class="date-title">日期選擇</div>
				<div class="calendar-toggle" @click="toggleCalendar">
					<span>📅</span>
					<span>{{ isCalendarExpanded ? '收合日曆' : '展開日曆' }}</span>
				</div>
			</div>

			<!-- 一週日期選擇（收合狀態） -->
			<div v-if="!isCalendarExpanded" class="week-dates">
				<div v-for="date in weekDates" :key="formatDate(date)" :class="[
					'date-item',
					`date-item--${getDateStatus(date)}`,
					{ 'date-item--today': isToday(date) }
				]" @click="handleDateSelect(date)">
					<div class="date-day">{{ ['日', '一', '二', '三', '四', '五', '六'][date.getDay()] }}</div>
					<div class="date-number">{{ date.getDate() }}</div>
					<div v-if="getDateStatus(date) !== 'today'" class="date-dot"></div>
				</div>
			</div>

			<!-- 完整日曆（展開狀態） -->
			<div v-if="isCalendarExpanded" class="full-calendar">
				<!-- 月份切換按鈕 -->
				<div class="calendar-month-controls">
					<button class="month-btn month-btn--prev" :disabled="isPrevMonthDisabled" @click="goToPrevMonth">
						<van-icon name="arrow-left" />
					</button>
					<div class="current-month">
						{{ currentMonth.getFullYear() }}年{{ currentMonth.getMonth() + 1 }}月
					</div>
					<button class="month-btn month-btn--next" :disabled="isNextMonthDisabled" @click="goToNextMonth">
						<van-icon name="arrow-left" style="transform: rotate(-180deg);" />
					</button>
				</div>

				<van-calendar ref="calendarRef" switch-mode="month" @confirm="handleDateSelect" :show-confirm="true"
					:poppable="false" :show-mark="false" :show-subtitle="true" :show-title="false"
					:default-date="selectedCalendarDate">
					<!--  {
							"date": "2025-10-01T16:00:00.000Z",
							"type": "selected",
							"text": 2
							} -->
					<template #top-info="day">
						<div
							:class="{ 'available-top-info': getDateStatus(day.date) === 'available', 'unavailable-top-info': getDateStatus(day.date) === 'unavailable', 'today-top-info': formatDate(day.date) === todayString }"
							style="display: inline-block;width: 95%;height: 100%;">
						</div>
					</template>

					<template #text="day">
						<p style="z-index: 9;">{{ day.text }}</p>
					</template>
					<template #bottom-info="day">
						<span :class="getDateStatus(day.date) === 'available' ? 'available' : 'unavailable'"
							style="width: 5px;height: 5px;border-radius: 50%;display: inline-block;"></span>
					</template>
				</van-calendar>
			</div>

			<!-- 狀態圓點說明 -->
			<div class="status-legend">
				<div class="legend-item">
					<div class="legend-dot legend-dot--available"></div>
					<span>有缺額</span>
				</div>
				<div class="legend-item">
					<div class="legend-dot legend-dot--unavailable"></div>
					<span>無缺額</span>
				</div>
				<div class="legend-item">
					<div class="legend-dot legend-dot--today"></div>
					<span>今天</span>
				</div>
			</div>
		</div>

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

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import ShiftCard from '@/components/cards/ShiftCard.vue';
import ShiftStatusBanner from '@/components/common/ShiftStatusBanner.vue';
import { useDialog } from '@/composables/useDialog';

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
	selectedCalendarDate.value = today;
};

// 搜尋和篩選狀態
const searchQuery = ref('');
const isCalendarExpanded = ref(false);
const selectedCalendarDate = ref(new Date());
const calendarRef = ref();

// 日曆月份切換狀態
const currentMonth = ref(new Date());
const isPrevMonthDisabled = ref(false);
const isNextMonthDisabled = ref(false);

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
const todayString = formatDate(today);

// 獲取一週的日期
const getWeekDates = () => {
	const dates = [];
	const dayOfWeek = today.getDay();

	for (let i = 0; i < 7; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() - dayOfWeek + i);
		dates.push(date);
	}
	return dates;
};

const weekDates = computed(() => getWeekDates());

// 獲取日期狀態
const getDateStatus = (date: Date) => {
	const dateString = formatDate(date);
	return dateStatusMap.value[dateString] || '';
};

// 檢查是否為今日
const isToday = (date: Date) => {
	return formatDate(date) === todayString;
};

// 事件處理
const handleSearch = () => {
	console.log('搜尋:', searchQuery.value);
	// 這裡可以添加搜尋邏輯
};

const handleRefresh = () => {
	console.log('刷新資料');
	// 這裡可以添加刷新邏輯
};

// 處理今天按鈕點擊
const handleTodayClick = () => {
	const todayDate = new Date();
	handleDateSelect(todayDate);

	// 更新當前月份為今日月份
	currentMonth.value = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);

	// 更新月份按鈕狀態
	updateMonthButtonStates();

	// 如果日曆已展開，讓日曆跳轉到今日
	if (isCalendarExpanded.value && calendarRef.value) {
		// 使用 nextTick 確保 DOM 更新後再執行
		nextTick(() => {
			calendarRef.value?.scrollToDate?.(todayDate);
		});
	}
};

// 月份切換函數
const goToPrevMonth = () => {
	const newMonth = new Date(currentMonth.value);
	newMonth.setMonth(currentMonth.value.getMonth() - 1);
	currentMonth.value = newMonth;

	// 更新日曆顯示
	if (calendarRef.value) {
		nextTick(() => {
			calendarRef.value?.scrollToDate?.(newMonth);
		});
	}

	// 檢查是否應該禁用按鈕（例如：不能早於當前月份）
	updateMonthButtonStates();
};

const goToNextMonth = () => {
	const newMonth = new Date(currentMonth.value);
	newMonth.setMonth(currentMonth.value.getMonth() + 1);
	currentMonth.value = newMonth;

	// 更新日曆顯示
	if (calendarRef.value) {
		nextTick(() => {
			calendarRef.value?.scrollToDate?.(newMonth);
		});
	}

	// 檢查是否應該禁用按鈕（例如：不能晚於未來6個月）
	updateMonthButtonStates();
};

// 更新月份按鈕狀態
const updateMonthButtonStates = () => {
	const today = new Date();
	const currentDate = currentMonth.value;

	// 設定最小月份（當前月份）
	const minDate = new Date(today.getFullYear(), today.getMonth(), 1);

	// 設定最大月份（未來6個月）
	const maxDate = new Date(today.getFullYear(), today.getMonth() + 6, 1);

	isPrevMonthDisabled.value = currentDate <= minDate;
	isNextMonthDisabled.value = currentDate >= maxDate;
};

const handleDateSelect = (date: Date) => {
	selectedCalendarDate.value = date;
	const dateString = formatDate(date);
	const status = getDateStatus(date);

	if (status === 'available') {
		shiftStatus.value = 'available';
	} else if (status === 'unavailable') {
		shiftStatus.value = 'unavailable';
	}

	selectedDate.value = isToday(date) ? '今天' : `${date.getMonth() + 1}/${date.getDate()}`;
	console.log('選擇日期:', dateString, '狀態:', status);
};

const toggleCalendar = () => {
	isCalendarExpanded.value = !isCalendarExpanded.value;
};

// 組件掛載時初始化
onMounted(() => {
	initializeSelectedDate();
	updateMonthButtonStates();
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

	// 篩選元件樣式
	.filter-section {
		background: $color-white;
		// border-radius: $border-radius-lg;
		padding: $spacing-12;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

		.search-bar {
			display: flex;
			align-items: center;
			gap: $spacing-8;
			margin-bottom: $spacing-12;

			.van-search {
				flex: 1;
				padding: 0;
				border-radius: $border-radius-md;
			}

			.today-button {
				border: 1px solid $color-gray-300;
				border-radius: $border-radius-md;
				padding: $spacing-xs $spacing-8;
				font-size: $font-size-xs;
				color: $color-gray-700;
				cursor: pointer;
				white-space: nowrap;
				transition: background-color 0.2s;
			}

			.refresh-button {
				width: 32px;
				height: 32px;
				border: 1px solid $color-gray-300;
				border-radius: $border-radius-md;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: background-color 0.2s;

				&:hover {
					background: #e8e9ea;
				}

				span {
					font-size: 16px;
					color: $color-gray-600;
				}
			}
		}

		.date-selection {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: $spacing-8;

			.date-title {
				font-size: $font-size-sm;
				font-weight: $font-weight-medium;
				color: $color-gray-900;
			}

			.calendar-toggle {
				display: flex;
				align-items: center;
				gap: $spacing-xs;
				border: 1px solid $color-gray-300;
				border-radius: $border-radius-md;
				padding: $spacing-xs $spacing-8;
				font-size: $font-size-xs;
				color: $color-gray-700;
				cursor: pointer;
				transition: background-color 0.2s;

				span:first-child {
					font-size: 14px;
				}
			}
		}

		.week-dates {
			display: flex;
			gap: $spacing-xs;
			margin-bottom: $spacing-8;

			.date-item {
				flex: 1;
				background: $color-white;
				border-radius: $border-radius-md;
				padding: $spacing-xs;
				text-align: center;
				cursor: pointer;
				transition: all 0.2s;
				border: 1px solid transparent;
				position: relative;

				.date-day {
					font-size: $font-size-xs;
					color: $color-gray-600;
					margin-bottom: $spacing-xs;
				}

				.date-number {
					font-size: $font-size-sm;
					font-weight: $font-weight-medium;
					margin-bottom: $spacing-xs;
				}

				.date-dot {
					width: 6px;
					height: 6px;
					border-radius: 50%;
					margin: 0 auto;
				}

				&--available {
					background: $color-green-2;
					border-color: $color-green-1;

					.date-day,
					.date-number {
						color: $color-green-700;
					}

					.date-dot {
						background: $color-green-1;
					}

				}

				&--unavailable {
					background: #fef2f2;
					border-color: $color-red-1;

					.date-day,
					.date-number {
						color: $color-red-1;
					}

					.date-dot {
						background: $color-red-1;
					}

					&:hover {
						background: #fee2e2;
					}
				}

				&--today {
					background: #3b82f6;
					border-color: #3b82f6;

					.date-day,
					.date-number {
						color: $color-white;
					}

					&:hover {
						background: #2563eb;
					}
				}
			}
		}

		.full-calendar {
			margin-bottom: $spacing-8;

			.calendar-month-controls {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: $spacing-12 $spacing-16;
				background: $color-white;
				border-radius: $border-radius-lg $border-radius-lg 0 0;
				border-bottom: 1px solid $color-gray-200;
				margin-bottom: $spacing-8;

				.month-btn {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 40px;
					height: 40px;
					border: 1px solid $color-gray-300;
					border-radius: $border-radius-md;
					background: $color-white;
					color: $color-gray-700;
					cursor: pointer;
					transition: all 0.2s ease;

					&:hover:not(:disabled) {
						background: $color-gray-50;
						border-color: $color-blue-1;
						color: $color-blue-1;
					}

					&:disabled {
						opacity: 0.4;
						cursor: not-allowed;
						background: $color-gray-100;
						border-color: $color-gray-200;
					}

					&--prev {
						.van-icon {
							transform: rotate(0deg);
						}
					}

					&--next {
						.van-icon {
							transform: rotate(180deg);
						}
					}
				}

				.current-month {
					font-size: $font-size-lg;
					font-weight: $font-weight-bold;
					color: $color-gray-900;
					text-align: center;
				}
			}

			:deep(.van-calendar) {
				background: $color-white;
				border-radius: $border-radius-lg;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				padding: $spacing-12;
			}

			:deep(.van-calendar__header) {
				display: none; // 隱藏標題
			}

			:deep(.van-calendar__month-title) {
				font-size: $font-size-lg;
				font-weight: $font-weight-bold;
				color: $color-gray-900;
				text-align: center;
				margin-bottom: $spacing-12;
			}

			:deep(.van-calendar__weekday) {
				font-size: $font-size-xs;
				color: $color-gray-500;
				padding: $spacing-xs;
			}

			:deep(.van-calendar__day) {
				position: relative;
				height: 40px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-radius: $border-radius-md;
				transition: all 0.2s;
				overflow: hidden;
				color: $color-gray-500;

				&.van-calendar__day--selected {
					border: 1px solid $color-blue-1;

					.van-calendar__selected-day {
						color: $color-gray-500;
						background: none;
					}
				}
			}

			:deep(.van-calendar__top-info) {
				inset: 0;
				width: 100%;
				height: 100%;
				z-index: 0;
			}

			:deep(.van-calendar__bottom-info) {
				bottom: 0;
			}

			:deep(.calendar-day--available) {
				background: #f0f9ff;
				color: #0ea5e9;

				&::after {
					background: #0ea5e9;
				}

				&:hover {
					background: #e0f2fe;
				}
			}

			:deep(.calendar-day--unavailable) {
				background: #fef2f2;
				color: $color-red-1;

				&::after {
					background: $color-red-1;
				}

				&:hover {
					background: #fee2e2;
				}
			}

			:deep(.calendar-day--today) {
				background: #3b82f6;
				color: $color-white;

				&::after {
					display: none; // 今日不顯示圓點
				}

				&:hover {
					background: #2563eb;
				}
			}

			:deep(.van-calendar__month) {
				margin-bottom: $spacing-16;
			}
		}

		.status-legend {
			display: flex;
			justify-content: center;
			gap: $spacing-16;

			.legend-item {
				display: flex;
				align-items: center;
				gap: $spacing-xs;
				font-size: $font-size-xs;
				color: $color-gray-600;

				.legend-dot {
					width: 8px;
					height: 8px;
					border-radius: 50%;

					&--available {
						background: $color-green-1;
					}

					&--unavailable {
						background: $color-red-1;
					}

					&--today {
						background: #3b82f6;
					}
				}
			}
		}
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
