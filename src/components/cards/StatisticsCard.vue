<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TimesheetRecord } from '@/types/timesheet';
import GenericDetailsDialog from '../dialogs/GenericDetailsDialog.vue';

// Props 定義
interface Props {
	timesheet: TimesheetRecord;
	showDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	showDetails: true
});

// Emits 定義
const emit = defineEmits<{
	(e: 'viewDetails', timesheet: TimesheetRecord): void;
	(e: 'edit', timesheet: TimesheetRecord): void;
}>();

// 計算屬性
const formattedDate = computed(() => {
	const date = new Date(props.timesheet.date);
	return date.toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
});

const totalSalary = computed(() => {
	const hours = props.timesheet.adjustedHours || props.timesheet.workingHours;
	return (hours * 600).toLocaleString(); // 假設時薪 600
});

// 對話框數據結構
const dialogSections = computed(() => [
	{
		title: '基本統計',
		icon: '📊',
		items: [
			{ label: '班別數', value: '12' },
			{ label: '應徵數', value: '45' },
			{ label: '工時', value: '68小時' },
			{ label: '總支出', value: `$${totalSalary.value}` }
		]
	},
	{
		title: '績效指標',
		icon: '📈',
		items: [
			{ label: '完成率', value: '83%' },
			{ label: '錄取率', value: '62%' },
			{ label: '平均時薪', value: '$507' },
			{ label: '主要地點', value: '台北信義店' }
		]
	},
	{
		title: '詳細資訊',
		icon: '📋',
		items: [
			{ label: '統計日期', value: formattedDate.value },
			{ label: '統計時間', value: '2024/9/16 上午9:00:00' },
			{ label: '備註', value: '週日業績良好,深夜班段特別繁忙' }
		]
	}
]);

// 彈跳窗口狀態
const showDetailsDialog = ref(false);

// 事件處理
const handleViewDetails = () => {
	showDetailsDialog.value = true;
	emit('viewDetails', props.timesheet);
};

const handleCloseDialog = () => {
	showDetailsDialog.value = false;
};
</script>

<template>
	<div class="statistics-card">
		<!-- 頂部標題區域 -->
		<div class="statistics-card__header">
			<div class="statistics-card__title-section">
				<div class="statistics-card__id">#{{ timesheet.id }}</div>
				<div class="statistics-card__date">{{ formattedDate }}</div>
			</div>
			<div class="statistics-card__total-expense">
				<div class="statistics-card__expense-amount">${{ totalSalary }}</div>
				<div class="statistics-card__expense-label">總支出</div>
			</div>
		</div>

		<!-- 重要統計區域 -->
		<div class="statistics-card__stats">
			<div class="statistics-card__stat-item">
				<div class="statistics-card__stat-number statistics-card__stat-number--blue">12</div>
				<div class="statistics-card__stat-label">班別數</div>
			</div>
			<div class="statistics-card__stat-item">
				<div class="statistics-card__stat-number statistics-card__stat-number--green">45</div>
				<div class="statistics-card__stat-label">應徵數</div>
			</div>
			<div class="statistics-card__stat-item">
				<div class="statistics-card__stat-number statistics-card__stat-number--orange">68</div>
				<div class="statistics-card__stat-label">工時</div>
			</div>
		</div>

		<!-- 顯示資料區域 -->
		<div class="statistics-card__data">
			<div class="statistics-card__data-row">
				<div class="statistics-card__data-item">
					<span class="statistics-card__data-label">完成率:</span>
					<span class="statistics-card__data-value">83%</span>
				</div>
				<div class="statistics-card__data-item">
					<span class="statistics-card__data-label">錄取率:</span>
					<span class="statistics-card__data-value">62%</span>
				</div>
			</div>
			<div class="statistics-card__data-row">
				<div class="statistics-card__data-item">
					<span class="statistics-card__data-label">平均時薪:</span>
					<span class="statistics-card__data-value statistics-card__data-value--purple">$507</span>
				</div>
				<div class="statistics-card__data-item">
					<span class="statistics-card__data-label">主要地點:</span>
					<span class="statistics-card__data-value">台北信義店</span>
				</div>
			</div>
		</div>

		<!-- 備註欄位 -->
		<div class="statistics-card__remarks">
			<div class="statistics-card__remarks-title">每日備註:</div>
			<div class="statistics-card__remarks-content">週日業績良好,深夜班段特別繁忙</div>
		</div>

		<!-- 分隔線 -->
		<div class="statistics-card__divider"></div>

		<!-- 統計時間和詳細按鈕 -->
		<div class="statistics-card__footer">
			<div class="statistics-card__stat-time">統計時間: 2024/9/16 上午9:00:00</div>
			<button v-if="showDetails" class="statistics-card__details-btn" @click="handleViewDetails">
				<van-icon name="eye-o" class="statistics-card__btn-icon" />
				詳細
			</button>
		</div>
	</div>

	<!-- 詳細內容窗口 -->
	<GenericDetailsDialog v-model:show="showDetailsDialog" :title="'統計詳細資料'" :sections="dialogSections"
		@close="handleCloseDialog" />
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.statistics-card {
	position: relative;
	background: $color-white;
	border-radius: $border-radius-lg;
	padding: $spacing-16;
	margin-bottom: $spacing-16;
	box-shadow: $shadow-base;
	border: 1px solid $color-gray-2;

	// 頂部標題區域
	&__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: $spacing-12;
	}

	&__title-section {
		flex: 1;
	}

	&__date {
		font-size: $font-size-sm;
		color: $color-text-secondary;
	}

	&__id {
		font-size: $font-size-lg;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		line-height: 1;
	}

	&__total-expense {
		text-align: right;
	}

	&__expense-amount {
		font-size: $font-size-sm;
		font-weight: $font-weight-bold;
		color: $color-green-1;
		line-height: 1;
	}

	&__expense-label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	// 重要統計區域
	&__stats {
		display: flex;
		justify-content: space-around;
		margin-bottom: $spacing-16;
		padding: $spacing-8 0;
		background: $color-gray-50;
		border-radius: $border-radius-md;
	}

	&__stat-item {
		text-align: center;
	}

	&__stat-number {
		font-size: $font-size-lg;
		// font-weight: $font-weight-bold;
		line-height: 1;
		margin-bottom: $spacing-4;

		&--blue {
			color: $color-blue-1;
		}

		&--green {
			color: $color-green-1;
		}

		&--orange {
			color: $color-orange-1;
		}
	}

	&__stat-label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	// 顯示資料區域
	&__data {
		margin-bottom: $spacing-16;
	}

	&__data-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: $spacing-8;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__data-item {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 $spacing-8;
	}

	&__data-label {
		font-size: $font-size-sm;
		color: $color-text-secondary;
		line-height: 1.3;
	}

	&__data-value {
		font-size: $font-size-sm;
		color: $color-text-primary;
		font-weight: $font-weight-medium;
		line-height: 1.3;

		&--purple {
			color: $color-purple-1;
		}
	}

	// 備註欄位
	&__remarks {
		background: $color-blue-50;
		border-radius: $border-radius-sm;
		padding: $spacing-8 $spacing-12;
		margin-bottom: $spacing-16;
	}

	&__remarks-title {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		margin-bottom: $spacing-4;
	}

	&__remarks-content {
		font-size: $font-size-sm;
		color: $color-text-primary;
		line-height: 1.2;
	}

	// 分隔線
	&__divider {
		height: 1px;
		background: $color-gray-2;
		margin-bottom: $spacing-12;
	}

	// 底部區域
	&__footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	&__stat-time {
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	&__details-btn {
		display: flex;
		align-items: center;
		gap: $spacing-4;
		padding: $spacing-8 $spacing-12;
		background: transparent;
		border: 1px solid $color-gray-300;
		border-radius: $border-radius-sm;
		font-size: $font-size-sm;
		color: $color-text-primary;
		cursor: pointer;
		transition: all 0.2s ease;
		width: fit-content;
		height: fit-content;
		line-height: 1;

		&:hover {
			background: $color-gray-50;
			border-color: $color-gray-400;
		}
	}

	&__btn-icon {
		font-size: $font-size-sm;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.statistics-card {
		padding: $spacing-20;

		&__stats {
			padding: $spacing-16 0;
		}

		&__data-row {
			justify-content: flex-start;
			gap: $spacing-24;
		}

		&__data-item {
			flex: none;
			min-width: 200px;
		}
	}
}
</style>
