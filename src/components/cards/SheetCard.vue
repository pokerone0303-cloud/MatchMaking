<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TimesheetRecord } from '@/types/timesheet';
import SheetDetailsDialog from '@/components/dialogs/SheetDetailsDialog.vue';

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
const statusConfig = computed(() => {
	const statusMap = {
		submitted: { text: '待審核', class: 'status-pending' },
		approved: { text: '已核准', class: 'status-approved' },
		adjusted: { text: '已調整', class: 'status-adjusted' }
	};
	return statusMap[props.timesheet.status] || statusMap.submitted;
});

const formattedDate = computed(() => {
	const date = new Date(props.timesheet.date);
	return date.toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
});

const formattedTime = computed(() => {
	return `${props.timesheet.startTime} - ${props.timesheet.endTime}`;
});

const totalSalary = computed(() => {
	const hours = props.timesheet.adjustedHours || props.timesheet.workingHours;
	return hours * 600; // 假設時薪 600
});

const workDetails = computed(() => [
	{
		label: '工作時數',
		value: `${props.timesheet.workingHours}小時`,
		valueClass: 'text-blue'
	},
	{
		label: '加班時數',
		value: '0小時',
		valueClass: 'text-red'
	},
	{
		label: '時薪',
		value: '$600',
		valueClass: 'text-normal'
	},
	{
		label: '總薪資',
		value: `$${totalSalary.value}`,
		valueClass: 'text-green'
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
	<div class="timesheet-card">
		<!-- 標題區域 -->
		<div class="timesheet-card__header">
			<div class="timesheet-card__title-section">
				<div class="timesheet-card__id">#{{ timesheet.id }}</div>
				<div class="timesheet-card__date">{{ formattedDate }}</div>
			</div>
			<!-- 狀態標籤 -->
			<div class="timesheet-card__status" :class="statusConfig.class">
				{{ statusConfig.text }}
			</div>
		</div>

		<!-- 地點和時間資訊 -->
		<div class="timesheet-card__info">
			<div class="timesheet-card__title">
				<van-icon name="location-o" class="timesheet-card__icon" />
				<span>{{ timesheet.location }}・{{ timesheet.address }}</span>
			</div>
			<div class="timesheet-card__title">
				<van-icon name="clock-o" class="timesheet-card__icon" />
				<span>{{ formattedTime }}・百家樂荷官</span>
			</div>
		</div>

		<!-- 工作詳情區域 -->
		<div class="timesheet-card__details">
			<div v-for="detail in workDetails" :key="detail.label" class="timesheet-card__detail-item">
				<div class="timesheet-card__detail-label">{{ detail.label }} :</div>
				<div class="timesheet-card__detail-value" :class="detail.valueClass">
					{{ detail.value }}
				</div>
			</div>
		</div>

		<!-- 備註區域 -->
		<div class="timesheet-card__remarks">
			<h3 class="timesheet-card__remarks-title">備註:</h3>
			<p class="timesheet-card__remarks-content">深夜班,客流量較大</p>
		</div>

		<!-- 分隔線 -->
		<div class="timesheet-card__divider"></div>

		<!-- 底部操作區域 -->
		<div class="timesheet-card__footer">
			<div class="timesheet-card__record-time">
				記錄時間 : 2024/9/14 上午8:20:00
			</div>
			<button v-if="showDetails" class="timesheet-card__details-btn" @click="handleViewDetails">
				<van-icon name="eye-o" class="timesheet-card__btn-icon" />
				詳細
			</button>
		</div>
	</div>

	<!-- 工時詳細資料彈跳窗口 -->
	<SheetDetailsDialog v-model:visible="showDetailsDialog" :timesheet="timesheet" @close="handleCloseDialog" />
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.timesheet-card {
	position: relative;
	background: $color-white;
	border-radius: $border-radius-lg;
	padding: $spacing-16;
	margin-bottom: $spacing-16;
	box-shadow: $shadow-base;
	border: 1px solid $color-gray-2;

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: $spacing-12;
	}

	&__title-section {
		flex: 1;
	}

	&__id {
		font-size: $font-size-lg;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		line-height: 1;
	}

	&__date {
		font-size: $font-size-sm;
		color: $color-text-secondary;
	}

	&__status {
		position: absolute;
		right: $spacing-16;
		padding: $spacing-4 $spacing-8;
		border-radius: $border-radius-sm;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		white-space: nowrap;

		&.status-pending {
			background: $color-warning;
			color: $color-white;
		}

		&.status-approved {
			background: $color-success;
			color: $color-white;
		}

		&.status-adjusted {
			background: $color-info;
			color: $color-white;
		}
	}

	&__info {
		margin-bottom: $spacing-8;
	}

	&__title {
		display: flex;
		align-items: center;
		font-size: $font-size-sm;
		color: $color-text-primary;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__icon {
		margin-right: $spacing-8;
		color: $color-text-secondary;
	}

	&__details {
		background: $color-gray-100;
		border-radius: $border-radius-sm;
		padding: $spacing-8 $spacing-12;
		margin-bottom: $spacing-16;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: $spacing-8;
	}

	&__detail-item {
		display: flex;
		gap: $spacing-4;
	}

	&__detail-label {
		font-size: $font-size-sm;
		color: $color-text-secondary;
	}

	&__detail-value {
		font-size: $font-size-sm;

		&.text-blue {
			color: $color-blue-1;
		}

		&.text-red {
			color: $color-red-1;
		}

		&.text-green {
			color: $color-green-1;
		}

		&.text-normal {
			color: $color-text-primary;
		}
	}

	&__remarks {
		background-color: $color-blue-50;
		border-radius: $border-radius-sm;
		padding: $spacing-8 $spacing-12;
		margin-bottom: $spacing-16;
	}

	&__remarks-title {
		font-size: $font-size-xs;
		color: $color-gray-600;
	}

	&__remarks-content {
		font-size: $font-size-sm;
		color: $color-gray-900;
		margin: 0;
		line-height: 1.2;
	}

	&__divider {
		height: 1px;
		background: $color-gray-2;
		margin-bottom: $spacing-12;
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	&__record-time {
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	&__details-btn {
		display: flex;
		align-items: center;
		gap: $spacing-4;
		padding: $spacing-4 $spacing-8;
		background: transparent;
		border: 1px solid $color-gray-300;
		border-radius: $border-radius-sm;
		font-size: $font-size-xs;
		color: $color-text-primary;
		cursor: pointer;
	}

	&__btn-icon {
		font-size: $font-size-sm;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.timesheet-card {
		padding: $spacing-20;

		&__details {
			grid-template-columns: repeat(4, 1fr);
			gap: $spacing-16;
		}
	}
}
</style>
