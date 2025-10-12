<template>
	<van-dialog :show="show" @update:show="$emit('update:show', $event)" :show-cancel-button="false"
		:show-confirm-button="false" :close-on-click-overlay="true" :close-on-popstate="true" class="generic-details-dialog"
		:width="'90%'" teleport="#app">
		<div class="dialog-title">
			<van-icon name="notes-o" size="16" color="black" />
			<h3 class="dialog-title-text">
				{{ title }}
			</h3>
			<!-- 關閉按鈕 icon:x -->
			<div class="close-button" @click="$emit('update:show', false)">
				<van-icon name="close" size="16" color="black" />
			</div>
		</div>
		<div class="dialog-content">
			<!-- 動態區塊 -->
			<div v-for="section in sections" :key="section.title" class="info-section">
				<div class="section-header">
					<span class="section-icon">{{ section.icon }}</span>
					<h3 class="section-title">{{ section.title }}</h3>
				</div>
				<div class="info-content">
					<div v-for="item in section.items" :key="item.label" class="info-item">
						<span class="info-label">{{ item.label }}</span>
						<span class="info-value" :class="item.valueClass">{{ item.value }}</span>
					</div>
				</div>
			</div>
		</div>
	</van-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// 定義區塊項目類型
interface SectionItem {
	label: string;
	value: string;
	valueClass?: string;
}

// 定義區塊類型
interface Section {
	title: string;
	icon: string;
	items: SectionItem[];
}

// Props 定義
const props = defineProps<{
	show: boolean;
	title: string;
	sections: Section[];
}>();

// Emits 定義
const emit = defineEmits<{
	(e: 'update:show', value: boolean): void;
	(e: 'close'): void;
}>();
</script>

<style lang="scss">
.generic-details-dialog {
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

			&--purple {
				color: $color-purple-1;
			}

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
	}
}
</style>
