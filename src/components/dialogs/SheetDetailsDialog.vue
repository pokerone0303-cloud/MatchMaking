<script setup lang="ts">
import { computed } from 'vue';
import type { TimesheetRecord } from '@/types/timesheet';
import type { DialogConfig } from '@/types/dialog';
import { STATUS_MAP } from '@/types/dialog';

// Props 定義
interface Props {
	visible: boolean;
	timesheet: TimesheetRecord | null;
	config?: DialogConfig; // 可選的配置，如果不提供則使用預設配置
}

const props = withDefaults(defineProps<Props>(), {
	config: undefined
});

// Emits 定義
const emit = defineEmits<{
	(e: 'update:visible', value: boolean): void;
	(e: 'close'): void;
}>();

// 計算屬性
const statusConfig = computed(() => {
	if (!props.timesheet) return { text: '', class: '' };
	return STATUS_MAP[props.timesheet.status] || STATUS_MAP.submitted;
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

// 預設配置
const defaultConfig = computed((): DialogConfig => {
	const hours = props.timesheet?.adjustedHours || props.timesheet?.workingHours || 0;
	const baseSalary = hours * 600;
	const overtimeSalary = 0;
	const totalSalary = baseSalary + overtimeSalary;

	return {
		title: '工時詳細資料',
		blocks: [
			{
				type: 'section',
				title: '基本資訊',
				items: [
					{ label: '工時單號', value: `TS${props.timesheet?.id || ''}` },
					{ label: '工作日期', value: formattedDate.value },
					{ label: '工作時間', value: formattedTime.value },
					{ label: '商家', value: '金沙會館' },
					{ label: '地點', value: `${props.timesheet?.location || ''} ${props.timesheet?.address || ''}` },
					{ label: '職位', value: '百家樂荷官' }
				]
			},
			{
				type: 'section',
				title: '工時統計',
				items: [
					{ label: '正常工時', value: `${hours} 小時`, valueClass: 'text-blue' },
					{ label: '加班工時', value: '0 小時', valueClass: 'text-orange' },
					{ label: '總工時', value: `${hours} 小時`, valueClass: 'text-blue' }
				]
			},
			{
				type: 'section',
				title: '薪資計算',
				items: [
					{ label: '基本時薪', value: '$600' },
					{ label: '加班時薪', value: '$900' },
					{ label: '基本薪資', value: `$${baseSalary}` },
					{ label: '加班薪資', value: `$${overtimeSalary}` },
					{ label: '總薪資', value: `$${totalSalary}`, valueClass: 'text-green' }
				]
			},
			{
				type: 'section',
				title: '狀態資訊',
				items: [
					{ label: '狀態', value: statusConfig.value.text, valueClass: statusConfig.value.class },
					{ label: '記錄時間', value: recordTime.value }
				]
			},
			{
				type: 'highlight',
				title: '職位要求',
				content: '五年以上經驗',
				contentClass: 'highlight-requirement'
			},
			{
				type: 'remark',
				title: '備註',
				content: '深夜班,客流量較大',
				contentClass: 'remark-content'
			}
		]
	};
});

// 使用傳入的配置或預設配置
const dialogConfig = computed(() => props.config || defaultConfig.value);

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
				<h2 class="timesheet-details-dialog__title">{{ dialogConfig.title }}</h2>
			</div>

			<!-- 內容區域 -->
			<div class="timesheet-details-dialog__content">
				<!-- 動態渲染區塊 -->
				<div v-for="(block, index) in dialogConfig.blocks" :key="index" class="timesheet-details-dialog__section">
					<h3 class="timesheet-details-dialog__section-title">{{ block.title }}</h3>

					<!-- 一般區塊 -->
					<div v-if="block.type === 'section'" class="timesheet-details-dialog__section-content">
						<div v-for="item in block.items" :key="item.label" class="timesheet-details-dialog__info-item">
							<span class="timesheet-details-dialog__info-label">{{ item.label }} :</span>
							<span v-if="item.label === '狀態'" class="timesheet-details-dialog__status-tag" :class="item.valueClass">
								{{ item.value }}
							</span>
							<span v-else class="timesheet-details-dialog__info-value" :class="item.valueClass">
								{{ item.value }}
							</span>
						</div>
					</div>

					<!-- 重點區域 -->
					<div v-else-if="block.type === 'highlight'" class="timesheet-details-dialog__highlight"
						:class="block.contentClass">
						<p class="timesheet-details-dialog__highlight-content">{{ block.content }}</p>
					</div>

					<!-- 備註區塊 -->
					<div v-else-if="block.type === 'remark'" class="timesheet-details-dialog__remarks"
						:class="block.contentClass">
						<p class="timesheet-details-dialog__remarks-content">{{ block.content }}</p>
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

		&.text-red {
			color: $color-red-1;
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

		&.status-accepted {
			background: $color-success;
			color: $color-white;
		}

		&.status-rejected {
			background: $color-danger;
			color: $color-white;
		}

		&.status-withdrawn {
			background: $color-gray-500;
			color: $color-white;
		}
	}

	&__highlight {
		background: $color-blue-50;
		border-radius: $border-radius-sm;
		padding: $spacing-12;
		border: 1px solid $color-blue-200;

		&.highlight-requirement {
			background: $color-warning-50;
			border-color: $color-warning-200;
		}
	}

	&__highlight-content {
		font-size: $font-size-sm;
		color: $color-blue-1;
		margin: 0;
		line-height: 1.2;
	}

	&__remarks {
		background: $color-blue-50;
		border-radius: $border-radius-sm;
		padding: $spacing-12;

		&.remark-content {
			background: $color-gray-50;
			border: 1px solid $color-gray-200;
		}
	}

	&__remarks-content {
		font-size: $font-size-sm;
		color: $color-blue-1;
		margin: 0;
		line-height: 1.2;

		.remark-content & {
			color: $color-text-secondary;
		}
	}
}

// 響應式設計
@media (min-width: 768px) {
	.timesheet-details-dialog {
		&__content {
			padding: $spacing-20;
		}
	}
}
</style>
