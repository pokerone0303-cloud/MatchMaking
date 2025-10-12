<script setup lang="ts">
// 定義統計資料介面
interface StatItem {
	id: string;
	value: number;
	label: string;
	color?: 'blue' | 'green' | 'orange' | 'purple';
}

interface Props {
	data: StatItem[];
}

// 定義 props
const props = withDefaults(defineProps<Props>(), {
	data: () => []
});

// 定義 emits
const emit = defineEmits<{
	itemClick: [item: StatItem];
}>();

// 處理項目點擊
const handleItemClick = (item: StatItem) => {
	emit('itemClick', item);
};

// 計算佈局類別
const getLayoutClass = (index: number, total: number) => {
	if (total === 3 && index === 2) {
		return 'stats-block__item--full-width';
	}
	return 'stats-block__item--half-width';
};

// 取得顏色類別
const getColorClass = (color?: string) => {
	if (!color) return 'stats-block__stat-item--blue';
	return `stats-block__stat-item--${color}`;
};
</script>

<template>
	<div class="stats-block">
		<div class="stats-block__grid">
			<div v-for="(item, index) in props.data" :key="item.id" :class="[
				'stats-block__item',
				getLayoutClass(index, data.length),
				getColorClass(item.color)
			]" @click="handleItemClick(item)">
				<div class="stats-block__stat-number">
					{{ item.value }}
				</div>
				<div class="stats-block__stat-label">
					{{ item.label }}
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.stats-block {
	width: 100%;

	&__grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: $spacing-4;
		width: 100%;
	}

	&__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $spacing-8;
		border-radius: $border-radius-md;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
		border: 1px solid $color-gray-2;
		background: $color-white;

		&--half-width {
			// 預設為一半寬度
		}

		&--full-width {
			grid-column: 1 / -1;
		}

		// 顏色變體
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
}

// 響應式設計
@media (min-width: 768px) {
	.stats-block {
		&__grid {
			gap: $spacing-16;
		}

		&__item {
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

// 當只有一個項目時，讓它佔滿全寬
.stats-block__grid:has(.stats-block__item:only-child) {
	grid-template-columns: 1fr;
}

// 當有兩個項目時，平均分配
.stats-block__grid:has(.stats-block__item:nth-child(2):last-child) {
	grid-template-columns: 1fr 1fr;
}

// 當有三個項目時，前兩個各佔一半，第三個佔全寬
.stats-block__grid:has(.stats-block__item:nth-child(3):last-child) {
	grid-template-columns: 1fr 1fr;
}
</style>
