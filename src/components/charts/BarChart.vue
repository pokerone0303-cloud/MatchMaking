<script setup lang="ts">
/**
 * BarChart - 柱狀圖元件
 * 
 * @description
 * 使用 vue-chartjs 和 Chart.js 封裝的柱狀圖元件
 * 適用於顯示類別數據的比較
 * 
 * @example
 * ```vue
 * <BarChart
 *   :labels="['1月', '2月', '3月', '4月']"
 *   :datasets="[
 *     {
 *       label: '銷售額',
 *       data: [120, 190, 300, 500],
 *       backgroundColor: 'rgba(47, 128, 237, 0.8)',
 *       borderColor: 'rgba(47, 128, 237, 1)',
 *       borderWidth: 2
 *     }
 *   ]"
 *   title="月度銷售額"
 *   :height="300"
 * />
 * ```
 * 
 * @props
 * - labels: 圖表的 X 軸標籤，例如 ['1月', '2月', '3月']
 * - datasets: 圖表數據集，通常包含 label、data、backgroundColor、borderColor 等屬性
 * - title: 圖表標題（選填）
 * - height: 圖表高度，單位 px（預設 250）
 * 
 * @note
 * 1. 請確保 labels 和 datasets 的資料長度一致
 * 2. 使用 rgba 顏色以支持透明度效果
 * 3. backgroundColor 和 borderColor 應該使用相同的顏色
 */

import { computed, onMounted, ref } from 'vue';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'vue-chartjs';

// 註冊 Chart.js 元件
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
	/** 圖表的 X 軸標籤陣列 */
	labels?: string[];
	/** 圖表數據集陣列，包含 label、data、backgroundColor、borderColor 等 */
	datasets?: any[];
	/** 圖表標題（選填） */
	title?: string;
	/** 圖表高度，單位 px（預設 250） */
	height?: number;
}

const props = withDefaults(defineProps<Props>(), {
	labels: () => [],
	datasets: () => [],
	title: '',
	height: 250
});

const chartData = computed(() => ({
	labels: props.labels,
	datasets: props.datasets
}));

const chartOptions = computed(() => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: true,
			position: 'top' as const,
			labels: {
				usePointStyle: true,
				padding: 15,
				font: {
					size: 12
				}
			}
		},
		title: {
			display: !!props.title,
			text: props.title,
			font: {
				size: 16,
				weight: 'bold' as const
			},
			padding: {
				bottom: 20
			}
		},
		tooltip: {
			enabled: true,
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			padding: 12,
			titleFont: {
				size: 14
			},
			bodyFont: {
				size: 13
			}
		}
	},
	scales: {
		x: {
			grid: {
				display: false
			},
			ticks: {
				font: {
					size: 11
				}
			}
		},
		y: {
			grid: {
				color: 'rgba(0, 0, 0, 0.05)'
			},
			ticks: {
				font: {
					size: 11
				}
			}
		}
	}
}));

const chartRef = ref();

onMounted(() => {
	console.log('BarChart mounted');
});
</script>

<template>
	<div class="chart-container" :style="{ height: `${height}px` }">
		<Bar ref="chartRef" :data="chartData" :options="chartOptions" />
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.chart-container {
	width: 100%;
	background: $color-white;
	padding: $spacing-16;
	border-radius: $border-radius-md;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>
