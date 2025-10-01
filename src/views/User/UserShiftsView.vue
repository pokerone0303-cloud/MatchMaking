<script setup lang="ts">
import { ref } from 'vue';
import ShiftCard from '@/components/cards/ShiftCard.vue';
import ShiftStatusBanner from '@/components/common/ShiftStatusBanner.vue';

defineOptions({
	name: 'UserShiftsView',
});

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

// 事件處理
const handleApply = (shiftId: string) => {
	console.log('應徵班表:', shiftId);
	// 這裡可以添加應徵邏輯
};

const handleWithdraw = (shiftId: string) => {
	console.log('撤回班表:', shiftId);
	// 這裡可以添加撤回邏輯
};

const handleDetails = (shiftId: string) => {
	console.log('查看詳細資料:', shiftId);
	// 這裡可以添加查看詳細資料邏輯
};
</script>

<template>
	<div class="user-shifts">
		<h1>我的班表</h1>

		<!-- 搜尋 更新 篩選 日曆組件 -->
		<div class="search-update-filter-calendar">
			<!-- 測試用：切換班別狀況狀態 -->
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
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.user-shifts {
	padding: $spacing-8;
	background: $color-gray-50;
	min-height: 100vh;
	max-width: 375px;
	margin: 0 auto;

	h1 {
		font-size: $font-size-xl;
		font-weight: $font-weight-bold;
		color: $color-gray-900;
		margin-bottom: $spacing-12;
		text-align: center;
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
