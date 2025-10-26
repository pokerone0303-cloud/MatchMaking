<script setup lang="ts">
/**
 * LineChart - 折線圖元件
 * 
 * @description
 * 使用 vue-chartjs 和 Chart.js 封裝的折線圖元件
 * 適用於顯示趨勢變化數據
 * 
 * @example
 * ```vue
 * <LineChart
 *   :labels="['週一', '週二', '週三', '週四', '週五']"
 *   :datasets="[
 *     {
 *       label: '平均工時',
 *       data: [8.5, 9.2, 8.8, 9.5, 9.0],
 *       borderColor: 'rgba(127, 95, 223, 1)',
 *       backgroundColor: 'rgba(127, 95, 223, 0.1)',
 *       fill: true,
 *       tension: 0.4,
 *       borderWidth: 3
 *     }
 *   ]"
 *   title="工時變化趨勢"
 *   :height="300"
 * />
 * ```
 * 
 * @props
 * - labels: 圖表的 X 軸標籤
 * - datasets: 圖表數據集，通常包含 label、data、borderColor、backgroundColor 等
 * - title: 圖表標題（選填）
 * - height: 圖表高度，單位 px（預設 250）
 * 
 * @note
 * 1. 支持多條折線同時顯示
 * 2. 使用 fill: true 可以填充區域
 * 3. tension 控制曲線平滑度（0-1）
 * 4. 建議使用透明背景色以提升視覺效果
 */

import { computed, onMounted, ref } from 'vue';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'vue-chartjs';

// 註冊 Chart.js 元件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
	/** 圖表的 X 軸標籤陣列 */
	labels?: string[];
	/** 圖表數據集陣列，包含 label、data、borderColor、backgroundColor 等 */
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
	console.log('LineChart mounted');
});
</script>

<template>
	<div class="chart-container" :style="{ height: `${height}px` }">
		<Line ref="chartRef" :data="chartData" :options="chartOptions" />
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
