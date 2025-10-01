<template>
	<div class="shift-status-banner" :class="statusClass">
		<div class="status-info">
			<div class="status-icon">
				<span class="icon-dot"></span>
			</div>
			<span class="status-text">{{ statusText }}</span>
		</div>
		<div class="status-message">
			<span class="message-text">{{ messageText }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props 定義
interface Props {
	status: 'available' | 'unavailable'; // 班別狀況狀態
	date?: string; // 日期，如 "今天" 或 "8/31"
}

const props = withDefaults(defineProps<Props>(), {
	date: '今天'
});

// 計算屬性
const statusClass = computed(() => {
	return `shift-status-banner--${props.status}`;
});

const statusText = computed(() => {
	return `${props.date} 班別狀況`;
});

const messageText = computed(() => {
	switch (props.status) {
		case 'available':
			return '尚有缺額';
		case 'unavailable':
			return '暫無缺額';
		default:
			return '暫無缺額';
	}
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.shift-status-banner {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: $spacing-8 $spacing-12;
	border-radius: $border-radius-md;
	margin-bottom: $spacing-12;
	width: 100%;
	max-width: 375px;
	margin-left: auto;
	margin-right: auto;

	.status-info {
		display: flex;
		align-items: center;
		gap: $spacing-xs;

		.status-icon {
			display: flex;
			align-items: center;
			justify-content: center;

			.icon-dot {
				width: 8px;
				height: 8px;
				border-radius: 50%;
				display: inline-block;
			}
		}

		.status-text {
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
		}
	}

	.status-message {
		.message-text {
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
		}
	}

	// 綠色狀態 - 尚有缺額
	&--available {
		background: $color-green-50;
		border: 1px solid $color-green-100;

		.status-info {
			.status-text {
				color: $color-green-700;
			}
		}

		.status-message {
			.message-text {
				color: $color-green-700;
			}
		}

		.icon-dot {
			background: $color-green-700;
		}
	}

	// 紅色狀態 - 暫無缺額
	&--unavailable {
		background: $color-red-50;
		border: 1px solid $color-red-100;

		.status-info {
			.status-text {
				color: $color-red-700;
			}
		}

		.status-message {
			.message-text {
				color: $color-red-700;
			}
		}

		.icon-dot {
			background: $color-red-700;
		}
	}
}

// 響應式設計
@media (max-width: 375px) {
	.shift-status-banner {
		padding: $spacing-xs $spacing-8;
		margin-left: $spacing-xs;
		margin-right: $spacing-xs;
		max-width: calc(100% - #{$spacing-sm});

		.status-info {
			.status-text {
				font-size: $font-size-xs;
			}
		}

		.status-message {
			.message-text {
				font-size: $font-size-xs;
			}
		}
	}
}
</style>
