<script setup lang="ts">
/**
 * PieChart - 餅圖元件
 * 
 * @description
 * 使用 vue-chartjs 和 Chart.js 封裝的餅圖元件
 * 適用於顯示比例、分布數據
 * 
 * @example
 * ```vue
 * <PieChart
 *   :labels="['已完成', '進行中', '待處理']"
 *   :datasets="[
 *     {
 *       label: '狀態分布',
 *       data: [60, 25, 15],
 *       backgroundColor: [
 *         'rgba(39, 174, 96, 0.8)',
 *         'rgba(47, 128, 237, 0.8)',
 *         'rgba(245, 153, 74, 0.8)'
 *       ],
 *       borderColor: [
 *         'rgba(39, 174, 96, 1)',
 *         'rgba(47, 128, 237, 1)',
 *         'rgba(245, 153, 74, 1)'
 *       ],
 *       borderWidth: 2
 *     }
 *   ]"
 *   title="任務狀態分布"
 *   :height="300"
 * />
 * ```
 * 
 * @props
 * - labels: 圖表的標籤陣列，對應每個扇形
 * - datasets: 圖表數據集，通常包含 label、data 和顏色設定陣列
 * - title: 圖表標題（選填）
 * - height: 圖表高度，單位 px（預設 250）
 * 
 * @note
 * 1. 圖例會自動顯示在右側，並包含百分比資訊
 * 2. 請確保 labels 與 data 陣列長度一致
 * 3. backgroundColor 和 borderColor 需要使用陣列格式，每個元素對應一個數據點
 * 4. 建議使用專案色系以保持視覺一致性
 */

import { computed, onMounted, ref } from 'vue';
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import { Pie } from 'vue-chartjs';

// 註冊 Chart.js 元件
ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface Props {
	/** 圖表的標籤陣列，對應每個扇形 */
	labels?: string[];
	/** 圖表數據集陣列，包含 label、data 和顏色設定 */
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
			position: 'right' as const,
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
			},
			callbacks: {
				label: (context: any) => {
					const label = context.label || '';
					const value = context.parsed || 0;
					const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
					const percentage = ((value / total) * 100).toFixed(1);
					return `${label}: ${value} (${percentage}%)`;
				}
			}
		}
	}
}));

const chartRef = ref();

onMounted(() => {
	console.log('PieChart mounted');
});
</script>

<template>
	<div class="chart-container" :style="{ height: `${height}px` }">
		<Pie ref="chartRef" :data="chartData" :options="chartOptions" />
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
