<script setup lang="ts">
// 定義營運統計介面
interface EmployerStats {
	totalShifts: number;
	ongoingShifts: number;
	totalApplicants: number;
	successfulHires: number;
}

interface Props {
	employerStats: EmployerStats;
}

// 定義 props
const props = withDefaults(defineProps<Props>(), {
	employerStats: () => ({
		totalShifts: 0,
		ongoingShifts: 0,
		totalApplicants: 0,
		successfulHires: 0
	})
});

// 定義 emits
const emit = defineEmits<{
	viewStats: [];
}>();

// 處理查看完整統計
const handleViewStats = () => {
	emit('viewStats');
};
</script>

<template>
	<div class="employer-stats-card">
		<!-- 標題 -->
		<div class="employer-stats-card__header">
			<van-icon name="bar-chart-o" class="employer-stats-card__icon" />
			<span class="employer-stats-card__title">營運統計</span>
		</div>

		<!-- 統計數據網格 -->
		<div class="employer-stats-card__stats-grid">
			<!-- 總發布班別 -->
			<div class="employer-stats-card__stat-item employer-stats-card__stat-item--blue">
				<div class="employer-stats-card__stat-number">
					{{ employerStats.totalShifts }}
				</div>
				<div class="employer-stats-card__stat-label">
					總發布班別
				</div>
			</div>

			<!-- 進行中班別 -->
			<div class="employer-stats-card__stat-item employer-stats-card__stat-item--green">
				<div class="employer-stats-card__stat-number">
					{{ employerStats.ongoingShifts }}
				</div>
				<div class="employer-stats-card__stat-label">
					進行中班別
				</div>
			</div>

			<!-- 總應徵人次 -->
			<div class="employer-stats-card__stat-item employer-stats-card__stat-item--orange">
				<div class="employer-stats-card__stat-number">
					{{ employerStats.totalApplicants }}
				</div>
				<div class="employer-stats-card__stat-label">
					總應徵人次
				</div>
			</div>

			<!-- 成功錄取 -->
			<div class="employer-stats-card__stat-item employer-stats-card__stat-item--purple">
				<div class="employer-stats-card__stat-number">
					{{ employerStats.successfulHires }}
				</div>
				<div class="employer-stats-card__stat-label">
					成功錄取
				</div>
			</div>
		</div>

		<!-- 跳轉按鈕 -->
		<div class="employer-stats-card__action">
			<van-button type="primary" size="small" block @click="handleViewStats" class="employer-stats-card__jump-button">
				<van-icon name="chart-trending-o" class="employer-stats-card__button-icon" />
				查看完整統計
			</van-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.employer-stats-card {
	background: $color-white;
	border-radius: $border-radius-lg;
	padding: $spacing-16;
	box-shadow: $shadow-base;
	border: 1px solid $color-gray-2;

	&__header {
		display: flex;
		align-items: center;
		gap: $spacing-8;
		margin-bottom: $spacing-8;
		padding-bottom: $spacing-8;
	}

	&__icon {
		color: $color-primary;
		font-size: $font-size-lg;
	}

	&__title {
		font-size: $font-size-base;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
	}

	&__stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: $spacing-12;
		margin-bottom: $spacing-16;
	}

	&__stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $spacing-8;
		border-radius: $border-radius-md;
		text-align: center;

		&--blue {
			background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
		}

		&--green {
			background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
		}

		&--orange {
			background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
		}

		&--purple {
			background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%);
		}
	}

	&__stat-number {
		font-size: $font-size-xl;
		color: $color-text-primary;
		font-weight: $font-weight-semibold;
		line-height: 1.2;
		margin-bottom: $spacing-4;
	}

	&__stat-label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		line-height: 1.3;
		font-weight: $font-weight-medium;
	}

	&__action {
		margin-top: $spacing-8;
	}

	&__jump-button {
		border-radius: $border-radius-md;
		font-weight: $font-weight-medium;
	}

	&__button-icon {
		margin-right: $spacing-4;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.employer-stats-card {
		padding: $spacing-24;

		&__title {
			font-size: $font-size-lg;
		}

		&__stats-grid {
			gap: $spacing-16;
		}

		&__stat-item {
			padding: $spacing-16;
		}

		&__stat-number {
			font-size: 28px;
		}

		&__stat-label {
			font-size: $font-size-sm;
		}
	}
}
</style>
