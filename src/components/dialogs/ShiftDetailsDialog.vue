<template>
	<van-dialog :show="show" @update:show="$emit('update:show', $event)" :show-cancel-button="false"
		:show-confirm-button="false" :close-on-click-overlay="true" :close-on-popstate="true" class="shift-details-dialog"
		:width="'90%'" teleport="#app">
		<div class="dialog-title">
			<van-icon name="notes-o" size="16" color="black" />
			<h3 class="dialog-title-text">
				班別詳細資料
			</h3>
			<!-- 關閉按鈕 icon:x -->
			<div class="close-button" @click="$emit('update:show', false)">
				<van-icon name="close" size="16" color="black" />
			</div>
		</div>
		<div class="dialog-content">

			<!-- 基本資訊區塊 -->
			<div class="info-section">
				<div class="section-header">
					<span class="section-icon">🕐</span>
					<h3 class="section-title">基本資訊</h3>
				</div>
				<div class="info-layout">
					<div class="info-item">
						<span class="info-label">時間</span>
						<span class="info-value">{{ timeRange }}</span>
					</div>
					<div class="info-item">
						<span class="info-label">職位</span>
						<span class="info-value">{{ position }}</span>
					</div>
					<div class="info-item">
						<span class="info-label">商家</span>
						<span class="info-value">{{ company }}</span>
					</div>
					<div class="info-item">
						<span class="info-label">時薪</span>
						<span class="info-value info-value--wage">${{ hourlyWage }}</span>
					</div>
					<div class="info-item">
						<span class="info-label">人數</span>
						<span class="info-value">{{ hiredCount }}/{{ totalCount }}人</span>
					</div>
					<div class="info-item">
						<span class="info-label">截止</span>
						<span class="info-value info-value--deadline">{{ deadline }}</span>
					</div>
				</div>
			</div>

			<!-- 地點資訊區塊 -->
			<div class="info-section">
				<div class="section-header">
					<span class="section-icon">📍</span>
					<h3 class="section-title">地點資訊</h3>
				</div>
				<div class="info-content">
					<div class="info-item">
						<span class="info-label">地址</span>
						<span class="info-value">{{ address }}</span>
					</div>
					<div class="info-item">
						<span class="info-label">交通資訊</span>
						<span class="info-value info-value--link">{{ trafficInfo }}</span>
					</div>
				</div>
			</div>

			<!-- 聯絡資訊區塊 -->
			<div class="info-section">
				<div class="section-header">
					<span class="section-icon">📞</span>
					<h3 class="section-title">聯絡資訊</h3>
				</div>
				<div class="info-content">
					<div class="info-item">
						<span class="info-label">聯絡人</span>
						<span class="info-value">{{ contactPerson }}</span>
					</div>
					<div class="info-item">
						<span class="info-label">電話</span>
						<a :href="`tel:${contactPhone}`" class="info-value info-value--link">{{ contactPhone }}</a>
					</div>
					<div class="info-item">
						<span class="info-label">信箱</span>
						<a :href="`mailto:${contactEmail}`" class="info-value info-value--link">{{ contactEmail }}</a>
					</div>
				</div>
			</div>

			<!-- 工作說明區塊 -->
			<div class="info-section">
				<div class="section-header">
					<span class="section-icon">📄</span>
					<h3 class="section-title">工作說明</h3>
				</div>
				<div class="info-content">
					<p class="description-text">{{ jobDescription }}</p>
				</div>
			</div>

			<!-- 應徵條件區塊 -->
			<div class="info-section">
				<div class="section-header">
					<span class="section-icon">📝</span>
					<h3 class="section-title">應徵條件</h3>
				</div>
				<div class="info-content">
					<ul class="requirements-list">
						<li v-for="(req, index) in requirements" :key="index">{{ req }}</li>
					</ul>
				</div>
			</div>

			<!-- 福利待遇區塊 -->
			<div class="info-section">
				<div class="section-header">
					<span class="section-icon">💰</span>
					<h3 class="section-title">福利待遇</h3>
				</div>
				<div class="info-content">
					<ul class="benefits-list">
						<li v-for="(benefit, index) in benefits" :key="index">{{ benefit }}</li>
					</ul>
				</div>
			</div>
		</div>
	</van-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	timeRange: {
		type: String,
		required: true,
	},
	position: {
		type: String,
		required: true,
	},
	company: {
		type: String,
		required: true,
	},
	hourlyWage: {
		type: Number,
		required: true,
	},
	hiredCount: {
		type: Number,
		required: true,
	},
	totalCount: {
		type: Number,
		required: true,
	},
	deadline: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	trafficInfo: {
		type: String,
		required: true,
	},
	contactPerson: {
		type: String,
		required: true,
	},
	contactPhone: {
		type: String,
		required: true,
	},
	contactEmail: {
		type: String,
		required: true,
	},
	jobDescription: {
		type: String,
		required: true,
	},
	requirements: {
		type: Array as () => string[],
		default: () => [],
	},
	benefits: {
		type: Array as () => string[],
		default: () => [],
	},
});

defineEmits(['update:show']);
</script>

<style lang="scss">
.shift-details-dialog {
	max-width: 768px;
	max-height: 90vh;

	&.van-dialog {
		border-radius: $border-radius-lg;

		.van-dialog__content {
			padding: 0;
			max-height: 70vh;
			overflow-y: auto;
		}
	}
}
</style>

<style lang="scss" scoped>
.dialog-content {
	padding: $spacing-16;
	background: $color-white;
	position: relative;
	color: $color-gray-900;
}

.info-section {
	margin-bottom: $spacing-24;

	&:last-child {
		margin-bottom: 0;
	}

	.section-header {
		display: flex;
		align-items: center;
		margin-bottom: $spacing-4;

		.section-icon {
			font-size: $font-size-lg;
			margin-right: $spacing-8;
		}

		.section-title {
			font-size: $font-size-sm;
			color: $color-gray-900;
			margin: 0;
		}
	}

	.info-layout {
		display: flex;
		flex-direction: column;
		gap: $spacing-8;
	}

	.info-content {
		background: $color-gray-50;
		padding: $spacing-8;
		border-radius: $border-radius-md;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		border-bottom: 1px solid $color-gray-100;

		&:last-child {
			border-bottom: none;
		}

		.info-label {
			font-size: $font-size-sm;
			color: $color-gray-600;
			min-width: 80px;
			flex-shrink: 0;
		}

		.info-value {
			font-size: $font-size-xs;
			color: $color-gray-900;
			text-align: right;
			flex: 1;

			&--wage {
				color: $color-green-1;
			}

			&--deadline {
				color: $color-red-1;
			}

			&--link {
				color: $color-blue-1;
			}
		}
	}

	.description-text {
		font-size: $font-size-sm;
		color: $color-gray-700;
		line-height: 1.6;
		margin: 0;
	}

	.requirements-list,
	.benefits-list {
		margin: 0;
		padding-left: $spacing-16;

		li {
			position: relative;
			font-size: $font-size-sm;
			color: $color-gray-700;
			line-height: 1.6;
			margin-bottom: $spacing-4;

			&:last-child {
				margin-bottom: 0;
			}

			&::before {
				content: '';
				position: absolute;
				left: -$spacing-16;
				top: 8px;
				width: 6px;
				height: 6px;
				background-color: $color-gray-500;
				border-radius: 50%;
				transform: translateY(-50%);
			}
		}
	}
}
</style>
