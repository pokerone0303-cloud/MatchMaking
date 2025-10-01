<template>
	<div class="shift-card">
		<!-- 時間標題和狀態標籤 -->
		<div class="shift-card__header">
			<div class="shift-card__time-title">
				<span class="time">{{ timeRange }}</span>
				<span class="separator">・</span>
				<span class="position">{{ position }}</span>
			</div>
			<div class="shift-card__status">
				<span class="status-tag" :class="statusClass">
					{{ statusText }}
				</span>
			</div>
		</div>

		<!-- 名稱與位置 -->
		<div class="shift-card__location">
			<span class="company">{{ company }}</span>
			<span class="separator">・</span>
			<span class="address">{{ address }}</span>
		</div>

		<!-- 內容區塊 -->
		<div class="shift-card__content">
			<div class="content-item">
				<div class="content-item__icon">
					<span class="icon-dollar">$</span>
				</div>
				<span class="content-item__text">時薪 ${{ hourlyWage }}</span>
			</div>

			<div class="content-item">
				<div class="content-item__icon">
					<span class="icon-people">👥</span>
				</div>
				<span class="content-item__text">{{ hiredCount }}/{{ totalCount }}人</span>
			</div>
		</div>

		<!-- 截止日期 -->
		<div class="shift-card__deadline">
			<div class="content-item">
				<div class="content-item__icon">
					<span class="icon-clock">🕐</span>
				</div>
				<span class="content-item__text">截止: {{ deadlineText }}</span>
			</div>
		</div>

		<!-- 底部按鈕區塊 -->
		<div class="shift-card__actions">
			<div class="action-buttons">
				<button v-if="showApplyButton" class="btn btn--apply" @click="handleApply">
					應徵
				</button>

				<button v-if="showWithdrawButton" class="btn btn--withdraw" @click="handleWithdraw">
					撤回
				</button>

				<button class="btn btn--details" @click="handleDetails">
					<span class="btn-icon">📄</span>
					詳細資料
				</button>
			</div>

			<div class="action-status">
				<span v-if="applicationStatus" class="status-badge" :class="applicationStatusClass">
					{{ applicationStatusText }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props 定義
interface Props {
	timeRange: string; // 時間範圍，如 "14:00-22:00"
	position: string; // 職位名稱，如 "發牌員"
	company: string; // 公司名稱，如 "星光娛樂城"
	address: string; // 地址，如 "新北市板橋區"
	hourlyWage: number; // 時薪
	hiredCount: number; // 已錄取人數
	totalCount: number; // 總需求人數
	deadline: string; // 截止時間，如 "今日13:00"
	status: 'open' | 'full' | 'closed'; // 班表狀態
	applicationStatus?: 'applied' | 'not-hired' | 'hired' | null; // 申請狀態
}

const props = withDefaults(defineProps<Props>(), {
	applicationStatus: null
});

// Emits 定義
const emit = defineEmits<{
	apply: [id: string];
	withdraw: [id: string];
	details: [id: string];
}>();

// 計算屬性
const statusClass = computed(() => {
	switch (props.status) {
		case 'open':
			return 'status-tag--open';
		case 'full':
			return 'status-tag--full';
		case 'closed':
			return 'status-tag--closed';
		default:
			return 'status-tag--open';
	}
});

const statusText = computed(() => {
	switch (props.status) {
		case 'open':
			return '開放';
		case 'full':
			return '額滿';
		case 'closed':
			return '已關閉';
		default:
			return '開放';
	}
});

const applicationStatusClass = computed(() => {
	switch (props.applicationStatus) {
		case 'applied':
			return 'status-badge--applied';
		case 'not-hired':
			return 'status-badge--not-hired';
		case 'hired':
			return 'status-badge--hired';
		default:
			return '';
	}
});

const applicationStatusText = computed(() => {
	switch (props.applicationStatus) {
		case 'applied':
			return '已投遞';
		case 'not-hired':
			return '未錄取';
		case 'hired':
			return '已錄取';
		default:
			return '';
	}
});

const deadlineText = computed(() => {
	return props.deadline;
});

const showApplyButton = computed(() => {
	return props.status === 'open' && !props.applicationStatus;
});

const showWithdrawButton = computed(() => {
	return props.applicationStatus === 'applied';
});

// 事件處理
const handleApply = () => {
	emit('apply', 'shift-id'); // 這裡應該傳入實際的 shift ID
};

const handleWithdraw = () => {
	emit('withdraw', 'shift-id'); // 這裡應該傳入實際的 shift ID
};

const handleDetails = () => {
	emit('details', 'shift-id'); // 這裡應該傳入實際的 shift ID
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
@use '@/styles/animations.scss' as *;

.shift-card {
	background: $color-white;
	border-radius: $border-radius-lg;
	padding: $spacing-12;
	box-shadow: $shadow-sm;
	border: 1px solid $color-gray-200;
	// transition: all $animation-duration-base $animation-easing-ease-out;
	margin-bottom: $spacing-8;
	width: 100%;
	// max-width: 375px;
	margin-left: auto;
	margin-right: auto;

	// &:hover {
	// 	@extend .card-hover;
	// }

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: $spacing-xs;
		gap: $spacing-8;
	}

	&__time-title {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0; // 防止文字溢出

		.time {
			font-size: $font-size-base;
			font-weight: $font-weight-semibold;
			color: $color-gray-900;
			white-space: nowrap;
		}

		.separator {
			margin: 0 $spacing-xs;
			color: $color-gray-500;
			flex-shrink: 0;
		}

		.position {
			font-size: $font-size-base;
			font-weight: $font-weight-semibold;
			color: $color-gray-900;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	&__status {
		flex-shrink: 0;

		.status-tag {
			padding: $spacing-xs $spacing-sm;
			border-radius: $border-radius-md;
			font-size: $font-size-xs;
			font-weight: $font-weight-medium;
			white-space: nowrap;
			display: inline-block;

			&--open {
				background: $color-green-100;
				color: $color-green-700;
			}

			&--full {
				background: $color-orange-100;
				color: $color-orange-700;
			}

			&--closed {
				background: $color-gray-100;
				color: $color-gray-600;
			}
		}
	}

	&__location {
		margin-bottom: $spacing-8;
		font-size: $font-size-sm;
		color: $color-gray-700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		.separator {
			margin: 0 $spacing-xs;
			color: $color-gray-500;
		}
	}

	&__content {
		display: flex;
		justify-content: space-between;
		margin-bottom: $spacing-sm;
		gap: $spacing-8;
	}

	&__deadline {
		margin-bottom: $spacing-12;
	}

	.content-item {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		flex: 1;
		min-width: 0;

		&__icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 14px;
			height: 14px;
			flex-shrink: 0;

			.icon-dollar {
				font-size: $font-size-xs;
				font-weight: $font-weight-bold;
				color: $color-gray-700;
			}

			.icon-people {
				font-size: $font-size-xs;
			}

			.icon-clock {
				font-size: $font-size-xs;
			}
		}

		&__text {
			font-size: $font-size-sm;
			color: $color-gray-700;
			font-weight: $font-weight-medium;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	&__actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: $spacing-8;
	}

	.action-buttons {
		display: flex;
		gap: $spacing-sm;
		flex: 1;
		min-width: 0;
	}

	.btn {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		padding: $spacing-sm $spacing-8;
		border-radius: $border-radius-md;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		border: none;
		cursor: pointer;
		// transition: all $animation-duration-fast $animation-easing-ease-out;
		// @extend .btn-click;
		white-space: nowrap;
		flex-shrink: 0;

		&--apply {
			background: $color-primary;
			color: $color-white;
			min-width: 60px;
			justify-content: center;

			&:hover {
				background: $color-primary-dark;
			}
		}

		&--withdraw {
			background: $color-white;
			color: $color-red-600;
			border: 1px solid $color-red-300;
			min-width: 60px;
			justify-content: center;

			&:hover {
				background: $color-red-50;
			}
		}

		&--details {
			background: $color-white;
			color: $color-gray-700;
			border: 1px solid $color-gray-300;
			flex: 1;
			justify-content: center;

			&:hover {
				background: $color-gray-50;
			}
		}

		.btn-icon {
			font-size: $font-size-xs;
		}
	}

	.action-status {
		flex-shrink: 0;

		.status-badge {
			padding: $spacing-xs $spacing-sm;
			border-radius: $border-radius-md;
			font-size: $font-size-xs;
			font-weight: $font-weight-medium;
			white-space: nowrap;
			display: inline-block;

			&--applied {
				background: $color-blue-100;
				color: $color-blue-700;
			}

			&--not-hired {
				background: $color-red-100;
				color: $color-red-700;
			}

			&--hired {
				background: $color-green-100;
				color: $color-green-700;
			}
		}
	}
}

// 針對 iPhone 8 (375px) 的優化
@media (max-width: 375px) {
	.shift-card {
		padding: $spacing-8;
		margin-left: $spacing-xs;
		margin-right: $spacing-xs;
		max-width: calc(100% - #{$spacing-sm});

		&__header {
			flex-direction: column;
			align-items: flex-start;
			gap: $spacing-xs;
		}

		&__time-title {
			width: 100%;

			.time {
				font-size: $font-size-sm;
			}

			.position {
				font-size: $font-size-sm;
			}
		}

		&__content {
			flex-direction: column;
			gap: $spacing-xs;
		}

		&__actions {
			flex-direction: column;
			align-items: stretch;
			gap: $spacing-sm;
		}

		.action-buttons {
			justify-content: center;
			flex-direction: column;
			gap: $spacing-xs;
		}

		.btn {
			width: 100%;
			justify-content: center;
		}
	}
}
</style>
