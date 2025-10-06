<script setup lang="ts">
import { computed } from 'vue';
import type { TimesheetRecord } from '@/types/timesheet';

// Props 定義
interface Props {
	visible: boolean;
	timesheet: TimesheetRecord | null;
}

const props = defineProps<Props>();

// Emits 定義
const emit = defineEmits<{
	(e: 'update:visible', value: boolean): void;
	(e: 'close'): void;
}>();

// 計算屬性
const statusConfig = computed(() => {
	if (!props.timesheet) return { text: '', class: '' };

	const statusMap = {
		submitted: { text: '待審核', class: 'status-pending' },
		approved: { text: '已核准', class: 'status-approved' },
		adjusted: { text: '已調整', class: 'status-adjusted' }
	};
	return statusMap[props.timesheet.status] || statusMap.submitted;
});

const formattedDate = computed(() => {
	if (!props.timesheet) return '';
	const date = new Date(props.timesheet.date);
	return date.toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
});

const formattedTime = computed(() => {
	if (!props.timesheet) return '';
	return `${props.timesheet.startTime} - ${props.timesheet.endTime}`;
});

const recordTime = computed(() => {
	// 模擬記錄時間
	return '2024/9/14 上午8:20:00';
});

// 基本資訊區塊
const basicInfo = computed(() => [
	{ label: '工時單號', value: `TS${props.timesheet?.id || ''}` },
	{ label: '工作日期', value: formattedDate.value },
	{ label: '工作時間', value: formattedTime.value },
	{ label: '商家', value: '金沙會館' },
	{ label: '地點', value: `${props.timesheet?.location || ''} ${props.timesheet?.address || ''}` },
	{ label: '職位', value: '百家樂荷官' }
]);

// 工時統計區塊
const workHourStats = computed(() => {
	const hours = props.timesheet?.adjustedHours || props.timesheet?.workingHours || 0;
	return [
		{ label: '正常工時', value: `${hours} 小時`, valueClass: 'text-blue' },
		{ label: '加班工時', value: '0 小時', valueClass: 'text-orange' },
		{ label: '總工時', value: `${hours} 小時`, valueClass: 'text-blue' }
	];
});

// 薪資計算區塊
const salaryCalculation = computed(() => {
	const hours = props.timesheet?.adjustedHours || props.timesheet?.workingHours || 0;
	const baseSalary = hours * 600;
	const overtimeSalary = 0;
	const totalSalary = baseSalary + overtimeSalary;

	return [
		{ label: '基本時薪', value: '$600' },
		{ label: '加班時薪', value: '$900' },
		{ label: '基本薪資', value: `$${baseSalary}` },
		{ label: '加班薪資', value: `$${overtimeSalary}` },
		{ label: '總薪資', value: `$${totalSalary}`, valueClass: 'text-green' }
	];
});

// 狀態資訊區塊
const statusInfo = computed(() => [
	{ label: '狀態', value: statusConfig.value.text, valueClass: statusConfig.value.class },
	{ label: '記錄時間', value: recordTime.value }
]);

// 事件處理
const handleClose = () => {
	emit('update:visible', false);
	emit('close');
};

const handleOverlayClick = () => {
	handleClose();
};
</script>

<template>
	<van-popup :show="visible" position="center" :style="{ width: '90dvw', height: '80dvh', maxWidth: '768px' }" round
		closeable :close-icon-position="'top-right'" @close="handleClose" @click-overlay="handleOverlayClick">
		<div class="timesheet-details-dialog">
			<!-- 標題區域 -->
			<div class="timesheet-details-dialog__header">
				<h2 class="timesheet-details-dialog__title">工時詳細資料</h2>
			</div>

			<!-- 內容區域 -->
			<div class="timesheet-details-dialog__content">
				<!-- 基本資訊區塊 -->
				<div class="timesheet-details-dialog__section">
					<h3 class="timesheet-details-dialog__section-title">基本資訊</h3>
					<div class="timesheet-details-dialog__section-content">
						<div v-for="item in basicInfo" :key="item.label" class="timesheet-details-dialog__info-item">
							<span class="timesheet-details-dialog__info-label">{{ item.label }} :</span>
							<span class="timesheet-details-dialog__info-value">{{ item.value }}</span>
						</div>
					</div>
				</div>

				<!-- 工時統計區塊 -->
				<div class="timesheet-details-dialog__section">
					<h3 class="timesheet-details-dialog__section-title">工時統計</h3>
					<div class="timesheet-details-dialog__section-content">
						<div v-for="item in workHourStats" :key="item.label" class="timesheet-details-dialog__info-item">
							<span class="timesheet-details-dialog__info-label">{{ item.label }} :</span>
							<span class="timesheet-details-dialog__info-value" :class="item.valueClass">
								{{ item.value }}
							</span>
						</div>
					</div>
				</div>

				<!-- 薪資計算區塊 -->
				<div class="timesheet-details-dialog__section">
					<h3 class="timesheet-details-dialog__section-title">薪資計算</h3>
					<div class="timesheet-details-dialog__section-content">
						<div v-for="item in salaryCalculation" :key="item.label" class="timesheet-details-dialog__info-item">
							<span class="timesheet-details-dialog__info-label">{{ item.label }} :</span>
							<span class="timesheet-details-dialog__info-value" :class="item.valueClass">
								{{ item.value }}
							</span>
						</div>
					</div>
				</div>

				<!-- 狀態資訊區塊 -->
				<div class="timesheet-details-dialog__section">
					<h3 class="timesheet-details-dialog__section-title">狀態資訊</h3>
					<div class="timesheet-details-dialog__section-content">
						<div v-for="item in statusInfo" :key="item.label" class="timesheet-details-dialog__info-item">
							<span class="timesheet-details-dialog__info-label">{{ item.label }} :</span>
							<span v-if="item.label === '狀態'" class="timesheet-details-dialog__status-tag" :class="item.valueClass">
								{{ item.value }}
							</span>
							<span v-else class="timesheet-details-dialog__info-value">
								{{ item.value }}
							</span>
						</div>
					</div>
				</div>

				<!-- 備註區塊 -->
				<div class="timesheet-details-dialog__section">
					<h3 class="timesheet-details-dialog__section-title">備註</h3>
					<div class="timesheet-details-dialog__remarks">
						<p class="timesheet-details-dialog__remarks-content">深夜班,客流量較大</p>
					</div>
				</div>
			</div>
		</div>
	</van-popup>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.timesheet-details-dialog {
	height: 100%;
	display: flex;
	flex-direction: column;
	background: $color-white;

	&__header {
		padding: $spacing-8 0;
		border-bottom: 1px solid $color-gray-2;
		position: sticky;
		top: 0;
		background: $color-white;
		z-index: 1;
	}

	&__title {
		font-size: $font-size-base;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin: 0;
		text-align: center;
	}

	&__content {
		flex: 1;
		padding: $spacing-8 $spacing-16;
		overflow-y: auto;
	}

	&__section {
		margin-bottom: $spacing-16;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__section-title {
		font-size: $font-size-base;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin: 0 0 $spacing-8 0;
	}

	&__section-content {
		background: $color-gray-100;
		border-radius: $border-radius-sm;
		padding: $spacing-4 $spacing-8;
	}

	&__info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: $spacing-8 0;
		border-bottom: 1px solid $color-gray-200;

		&:last-child {
			border-bottom: none;
		}
	}

	&__info-label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	&__info-value {
		font-size: $font-size-sm;
		color: $color-text-primary;

		&.text-blue {
			color: $color-blue-1;
		}

		&.text-orange {
			color: $color-warning;
		}

		&.text-green {
			color: $color-green-1;
		}
	}

	&__status-tag {
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

	&__remarks {
		background: $color-blue-50;
		border-radius: $border-radius-sm;
		padding: $spacing-12;
	}

	&__remarks-content {
		font-size: $font-size-sm;
		color: $color-blue-1;
		margin: 0;
		line-height: 1.2;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.timesheet-details-dialog {
		&__content {
			padding: $spacing-20;
		}

		&__section-content {}

		&__info-item {}
	}
}
</style>
