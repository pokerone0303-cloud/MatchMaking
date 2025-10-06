<script setup lang="ts">
import { ref } from 'vue';
import type { TimesheetRecord } from '@/types/timesheet';

defineOptions({
	name: 'UserTimesheetsView',
});

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
		status: 'submitted'
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

// 事件處理
const handleViewDetails = (timesheet: TimesheetRecord) => {
	console.log('查看詳細資料:', timesheet);
};
</script>

<template>
	<div class="user-timesheets">
		<van-nav-bar title="工時記錄" fixed />

		<div class="user-timesheets__content">
			<div class="user-timesheets__header">
				<h2 class="user-timesheets__title">我的工時記錄</h2>
				<p class="user-timesheets__subtitle">查看您的工時詳細資料</p>
			</div>

			<div class="user-timesheets__list">
				<SheetCard v-for="timesheet in timesheets" :key="timesheet.id" :timesheet="timesheet" :show-details="true"
					@view-details="handleViewDetails" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.user-timesheets {
	min-height: 100vh;
	background: $color-gray-50;

	&__content {
		padding: $spacing-16;
		padding-top: calc(46px + $spacing-16); // 導航欄高度 + 間距
	}

	&__header {
		margin-bottom: $spacing-24;
		text-align: center;
	}

	&__title {
		font-size: $font-size-2xl;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin: 0 0 $spacing-8 0;
	}

	&__subtitle {
		font-size: $font-size-sm;
		color: $color-text-secondary;
		margin: 0;
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: $spacing-16;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.user-timesheets {
		&__content {
			max-width: 600px;
			margin: 0 auto;
			padding: $spacing-24;
			padding-top: calc(46px + $spacing-24);
		}

		&__list {
			gap: $spacing-20;
		}
	}
}
</style>