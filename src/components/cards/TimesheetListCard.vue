<script setup lang="ts">
import { ref } from 'vue';
import type { TimesheetRecord } from '@/types/timesheet';

interface Props {
	timesheetRecords: TimesheetRecord[];
	showViewAll?: boolean;
}

// 定義 props
withDefaults(defineProps<Props>(), {
	timesheetRecords: () => [],
	showViewAll: true
});

// 定義 emits
const emit = defineEmits<{
	viewAll: [];
	viewDetails: [record: TimesheetRecord];
}>();

// 展開狀態管理
const expandedCards = ref<string[]>([]);

// 計算屬性：格式化日期
const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).replace(/\//g, '/');
};

// 計算屬性：格式化時間範圍
const formatTimeRange = (startTime: string, endTime: string) => {
	return `${startTime}-${endTime}`;
};

// 計算屬性：格式化休息時間
const formatBreakDuration = (minutes: number) => {
	if (minutes === 0) return '';
	return `(休息 ${minutes}m)`;
};

// 計算屬性：格式化工作時數
const formatWorkingHours = (hours: number) => {
	return `${hours}h`;
};

// 計算屬性：狀態標籤配置
const getStatusConfig = (status: string) => {
	const configs = {
		submitted: {
			text: '已提交',
			class: 'timesheet-card__status--submitted'
		},
		approved: {
			text: '已核准',
			class: 'timesheet-card__status--approved'
		},
		adjusted: {
			text: '已調整',
			class: 'timesheet-card__status--adjusted'
		}
	};
	return configs[status as keyof typeof configs] || configs.submitted;
};

// 方法：檢查卡片是否展開
const isCardExpanded = (recordId: string) => {
	return expandedCards.value.includes(recordId);
};

// 方法：處理查看全部
const handleViewAll = () => {
	emit('viewAll');
	// 可以導航到專門的時數頁面
	// router.push('/user/timesheets');
};

// 方法：處理查看詳情（保留以備將來使用）
// const handleViewDetails = (record: TimesheetRecord) => {
// 	emit('viewDetails', record);
// };
</script>

<template>
	<div class="timesheet-list-card">
		<!-- 區塊標題 -->
		<div class="timesheet-list-card__header">
			<div class="timesheet-list-card__title-section">
				<van-icon name="clock" class="timesheet-list-card__title-icon" />
				<h3 class="timesheet-list-card__title">實際上班時數</h3>
			</div>
			<van-button v-if="showViewAll" type="primary" size="small" class="timesheet-list-card__view-all-btn"
				@click="handleViewAll">
				查看全部
			</van-button>
		</div>

		<!-- 卡片式列表 -->
		<div class="timesheet-list-card__list">
			<div v-for="record in timesheetRecords" :key="record.id" class="timesheet-card">
				<!-- 卡片主要內容 -->
				<div class="timesheet-card__content">
					<!-- 標題行：日期+時間 + 狀態標籤 -->
					<div class="timesheet-card__header">
						<div class="timesheet-card__datetime">
							<span class="timesheet-card__date">{{ formatDate(record.date) }}</span>
							<span class="timesheet-card__separator">·</span>
							<span class="timesheet-card__time">{{ formatTimeRange(record.startTime, record.endTime) }}</span>
							<span v-if="record.breakDuration > 0" class="timesheet-card__break">
								{{ formatBreakDuration(record.breakDuration) }}
							</span>
						</div>
						<van-tag :class="getStatusConfig(record.status).class" class="timesheet-card__status">
							{{ getStatusConfig(record.status).text }}
						</van-tag>
					</div>

					<!-- 副標：地點名稱+地址+班別ID -->
					<div class="timesheet-card__location">
						{{ record.location }} · {{ record.address }} · {{ record.shiftId }}
					</div>

					<!-- 工作時數 -->
					<div class="timesheet-card__hours">
						<van-icon name="clock" class="timesheet-card__hours-icon" />
						<span class="timesheet-card__hours-label">工作時數:</span>
						<span class="timesheet-card__hours-value">{{ formatWorkingHours(record.workingHours) }}</span>

						<!-- 調整後時數顯示 -->
						<div v-if="record.status === 'adjusted' && record.adjustedHours && record.originalHours"
							class="timesheet-card__adjusted-hours">
							<span class="timesheet-card__adjusted-label">調整後:</span>
							<span class="timesheet-card__adjusted-value">
								{{ formatWorkingHours(record.adjustedHours) }}
								(原 {{ formatWorkingHours(record.originalHours) }})
							</span>
						</div>
					</div>
				</div>

				<!-- 手風琴效果：查看詳情按鈕作為標題 -->
				<van-collapse v-model="expandedCards" :name="record.id" class="timesheet-card__collapse">
					<van-collapse-item :name="record.id" class="timesheet-card__collapse-item">
						<template #title>
							<div class="timesheet-card__details-title">
								<van-icon :name="isCardExpanded(record.id) ? 'arrow-up' : 'arrow-down'"
									class="timesheet-card__details-icon" />
								查看詳情
							</div>
						</template>
						<div class="timesheet-card__collapse-content">
							<div class="timesheet-card__audit-section">
								<div class="timesheet-card__audit-title">審核備註</div>
								<div class="timesheet-card__audit-content">
									{{ record.auditNote || '無備註' }}
								</div>
							</div>
						</div>
					</van-collapse-item>
				</van-collapse>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.timesheet-list-card {
	background: $color-white;
	border-radius: $border-radius-lg;
	padding: $spacing-16;
	box-shadow: $shadow-base;
	border: 1px solid $color-gray-2;

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: $spacing-16;
	}

	&__title-section {
		display: flex;
		align-items: center;
		gap: $spacing-8;
	}

	&__title-icon {
		color: $color-primary;
		font-size: $font-size-lg;
	}

	&__title {
		font-size: $font-size-lg;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin: 0;
	}

	&__view-all-btn {
		font-size: $font-size-sm;
		height: 32px;
		padding: 0 $spacing-12;
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: $spacing-12;
	}
}

.timesheet-card {
	background: $color-white;
	border-radius: $border-radius-base;
	border: 1px solid $color-gray-2;
	box-shadow: $shadow-sm;
	overflow: hidden;

	&__content {
		padding: $spacing-16;
	}

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: $spacing-8;
	}

	&__datetime {
		display: flex;
		align-items: center;
		gap: $spacing-4;
		flex: 1;
	}

	&__date {
		font-size: $font-size-base;
		font-weight: $font-weight-medium;
		color: $color-text-primary;
	}

	&__separator {
		color: $color-text-secondary;
		font-size: $font-size-sm;
	}

	&__time {
		font-size: $font-size-base;
		font-weight: $font-weight-medium;
		color: $color-text-primary;
	}

	&__break {
		font-size: $font-size-sm;
		color: $color-text-secondary;
	}

	&__status {
		flex-shrink: 0;
		font-size: $font-size-xs;
		padding: $spacing-4 $spacing-8;
		border-radius: $border-radius-full;

		&--submitted {
			background: $color-blue-2;
			color: $color-blue-1;
			border: 1px solid $color-blue-1;
		}

		&--approved {
			background: $color-green-2;
			color: $color-green-1;
			border: 1px solid $color-green-1;
		}

		&--adjusted {
			background: $color-orange-100;
			color: $color-orange-700;
			border: 1px solid $color-orange-700;
		}
	}

	&__location {
		font-size: $font-size-sm;
		color: $color-text-secondary;
		margin-bottom: $spacing-12;
		line-height: 1.4;
	}

	&__hours {
		display: flex;
		align-items: center;
		gap: $spacing-6;
		margin-bottom: $spacing-12;

		&-icon {
			color: $color-text-secondary;
			font-size: $font-size-sm;
		}

		&-label {
			font-size: $font-size-sm;
			color: $color-text-secondary;
		}

		&-value {
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
			color: $color-text-primary;
		}
	}

	&__adjusted-hours {
		margin-top: $spacing-4;
		padding-left: 22px; // 對齊上面的時數內容
	}

	&__adjusted-label {
		font-size: $font-size-xs;
		color: $color-orange-700;
		font-weight: $font-weight-medium;
	}

	&__adjusted-value {
		font-size: $font-size-xs;
		color: $color-orange-700;
		margin-left: $spacing-4;
	}

	&__details-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: $spacing-4;
		width: 100%;
		padding: $spacing-8 0;
		font-size: $font-size-sm;
		color: $color-primary;
		font-weight: $font-weight-medium;
	}

	&__details-icon {
		font-size: $font-size-sm;
		transition: transform 0.3s ease;
	}

	&__collapse {
		border-top: 1px solid $color-gray-2;
		margin-top: $spacing-8;

		:deep(.van-collapse-item__wrapper) {
			border: none;
		}

		:deep(.van-collapse-item__title) {
			padding: 0;
			background: transparent;
			border: none;
		}

		:deep(.van-collapse-item__content) {
			padding: 0;
		}
	}

	&__collapse-item {
		:deep(.van-collapse-item__title) {
			padding: 0;
			background: transparent;
		}
	}

	&__collapse-content {
		padding: $spacing-16;
		background: $color-gray-3;
	}

	&__audit-section {
		background: $color-white;
		border-radius: $border-radius-base;
		padding: $spacing-16;
		box-shadow: $shadow-sm;
	}

	&__audit-title {
		font-size: $font-size-sm;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin-bottom: $spacing-8;
	}

	&__audit-content {
		font-size: $font-size-sm;
		color: $color-text-secondary;
		line-height: 1.5;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.timesheet-list-card {
		padding: $spacing-20;

		&__title {
			font-size: $font-size-xl;
		}
	}

	.timesheet-card {
		&__content {
			padding: $spacing-20;
		}

		&__date,
		&__time {
			font-size: $font-size-lg;
		}

		&__location {
			font-size: $font-size-base;
		}

		&__hours {

			&-label,
			&-value {
				font-size: $font-size-base;
			}
		}
	}
}
</style>
