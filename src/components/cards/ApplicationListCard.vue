<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ApplicationRecord, FilterTab } from '@/types/application';
import { useRouter } from 'vue-router';

interface Props {
	applicationRecords: ApplicationRecord[];
	showViewAll?: boolean;
}

const router = useRouter();

// 定義 props
const props = withDefaults(defineProps<Props>(), {
	applicationRecords: () => [],
	showViewAll: true
});

// 定義 emits
const emit = defineEmits<{
	viewAll: [];
	withdrawApplication: [record: ApplicationRecord];
}>();

// 篩選標籤選項
const filterTabs = [
	{ key: 'all', label: '全部' },
	{ key: 'pending', label: '待審' },
	{ key: 'accepted', label: '錄取' },
	{ key: 'rejected', label: '未錄取' },
	{ key: 'withdrawn', label: '撤回' }
] as const;

// 當前選中的篩選標籤
const activeFilter = ref<FilterTab>('all');

// 計算屬性：根據篩選條件過濾記錄
const filteredRecords = computed(() => {
	if (activeFilter.value === 'all') {
		return props.applicationRecords;
	}
	return props.applicationRecords.filter(record => record.status === activeFilter.value);
});

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

// 計算屬性：格式化投遞時間
const formatAppliedTime = (appliedAt: string) => {
	const date = new Date(appliedAt);
	return date.toLocaleString('zh-TW', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	}).replace(/\//g, '/');
};

// 計算屬性：狀態標籤配置
const getStatusConfig = (status: string) => {
	const configs = {
		pending: {
			text: '已投遞',
			class: 'application-card__status--pending'
		},
		accepted: {
			text: '已錄取',
			class: 'application-card__status--accepted'
		},
		rejected: {
			text: '未錄取',
			class: 'application-card__status--rejected'
		},
		withdrawn: {
			text: '已撤回',
			class: 'application-card__status--withdrawn'
		}
	};
	return configs[status as keyof typeof configs] || configs.pending;
};

// 計算屬性：結果提示訊息配置
const getResultMessageConfig = (status: string) => {
	const configs = {
		accepted: {
			message: '恭喜!您已被錄取，請準時到場工作。',
			class: 'application-card__result--success',
			showIcon: true
		},
		rejected: {
			message: '很遺憾，這次未能錄取，請繼續關注其他機會。',
			class: 'application-card__result--error',
			showIcon: false
		},
		pending: {
			message: '',
			class: '',
			showIcon: false
		},
		withdrawn: {
			message: '',
			class: '',
			showIcon: false
		}
	};
	return configs[status as keyof typeof configs] || configs.pending;
};

// 方法：切換篩選標籤
const switchFilter = (filter: FilterTab) => {
	activeFilter.value = filter;
};

// 方法：處理查看全部
const handleViewAll = () => {
	// emit('viewAll');
	router.push('/u/applications');
};

// 方法：處理撤回應徵
const handleWithdraw = (record: ApplicationRecord) => {
	emit('withdrawApplication', record);
};
</script>

<template>
	<div class="application-list-card">
		<!-- 區塊標題 -->
		<div class="application-list-card__header">
			<div class="application-list-card__title-section">
				<van-icon name="description-o" class="application-list-card__title-icon" />
				<h3 class="application-list-card__title">應徵記錄</h3>
			</div>
			<van-button v-if="showViewAll" type="primary" size="small" class="application-list-card__view-all-btn"
				@click="handleViewAll">
				查看全部
			</van-button>
		</div>

		<!-- 篩選TAB列表 -->
		<div class="application-list-card__filter-tabs">
			<div v-for="tab in filterTabs" :key="tab.key" :class="[
				'application-list-card__filter-tab',
				{ 'application-list-card__filter-tab--active': activeFilter === tab.key }
			]" @click="switchFilter(tab.key as FilterTab)">
				{{ tab.label }}
			</div>
		</div>

		<!-- 卡片式列表 -->
		<div class="application-list-card__list">
			<div v-for="record in filteredRecords" :key="record.id" class="application-card">
				<!-- 卡片主要內容 -->
				<div class="application-card__content">
					<!-- 標題行：日期+時間+職位 + 狀態標籤 -->
					<div class="application-card__header">
						<div class="application-card__title">
							<span class="application-card__datetime">
								{{ formatDate(record.date) }} · {{ record.position }} ({{ formatTimeRange(record.startTime,
									record.endTime) }})
							</span>
						</div>
						<van-tag :class="getStatusConfig(record.status).class" class="application-card__status">
							{{ getStatusConfig(record.status).text }}
						</van-tag>
					</div>

					<!-- 副標：地點名稱+地址 -->
					<div class="application-card__location">
						{{ record.location }} · {{ record.address }}
					</div>

					<!-- 投遞時間 -->
					<div class="application-card__applied-time">
						<van-icon name="clock" class="application-card__applied-time-icon" />
						<span class="application-card__applied-time-label">投遞時間:</span>
						<span class="application-card__applied-time-value">{{ formatAppliedTime(record.appliedAt) }}</span>
					</div>

					<!-- 結果提示訊息 -->
					<div v-if="getResultMessageConfig(record.status).message" :class="[
						'application-card__result',
						getResultMessageConfig(record.status).class
					]">
						<van-icon v-if="getResultMessageConfig(record.status).showIcon" name="star"
							class="application-card__result-icon" />
						<span class="application-card__result-text">
							{{ getResultMessageConfig(record.status).message }}
						</span>
					</div>

					<!-- 撤回應徵按鈕（僅待審狀態顯示） -->
					<div v-if="record.status === 'pending'" class="application-card__actions">
						<van-button type="danger" size="small" plain class="application-card__withdraw-btn"
							@click="handleWithdraw(record)">
							撤回應徵
						</van-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.application-list-card {
	border-radius: $border-radius-lg;

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
		font-size: $font-size-base;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin: 0;
	}

	&__view-all-btn {
		font-size: $font-size-xs;
		padding: $spacing-4 $spacing-8;
	}

	&__filter-tabs {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		margin-bottom: $spacing-16;
		padding: $spacing-4 $spacing-8;
		background: $color-gray-2;
		border-radius: $border-radius-full;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	&__filter-tab {
		flex-shrink: 0;
		padding: $spacing-4 $spacing-16;
		border-radius: $border-radius-full;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		color: $color-text-secondary;
		cursor: pointer;
		transition: all 0.2s ease;

		&--active {
			background-color: $color-white;
			color: $color-text-primary;
		}
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: $spacing-8;
	}
}

.application-card {
	background: $color-white;
	border-radius: $border-radius-base;
	border: 1px solid $color-gray-2;
	box-shadow: $shadow-sm;
	overflow: hidden;

	&__content {
		position: relative;
		padding: $spacing-16;
	}

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	&__title {
		flex: 1;
	}

	&__datetime {
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $color-text-primary;
	}

	&__status {
		position: absolute;
		right: $spacing-8;
		font-size: $font-size-xxs;
		padding: $spacing-4 $spacing-8;
		border-radius: $border-radius-full;

		&--pending {
			background: $color-blue-2;
			color: $color-blue-1;
		}

		&--accepted {
			background: $color-green-2;
			color: $color-green-1;
		}

		&--rejected {
			background: $color-red-2;
			color: $color-red-1;
		}

		&--withdrawn {
			background: $color-gray-2;
			color: $color-text-secondary;
		}
	}

	&__location {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		margin-bottom: $spacing-12;
		line-height: 1.4;
	}

	&__applied-time {
		display: flex;
		align-items: center;
		gap: $spacing-6;
		margin-bottom: $spacing-8;

		&-icon {
			color: $color-text-secondary;
			font-size: $font-size-xs;
		}

		&-label {
			font-size: $font-size-xs;
			color: $color-text-secondary;
		}

		&-value {
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
			color: $color-text-primary;
		}
	}

	&__result {
		display: flex;
		align-items: center;
		gap: $spacing-6;
		padding: $spacing-4 $spacing-8;
		border-radius: $border-radius-sm;

		&--success {
			background: $color-green-2;
			border: 1px solid $color-green-1;
		}

		&--error {
			background: $color-red-2;
			border: 1px solid $color-red-1;
		}

		&-icon {
			color: $color-green-1;
			font-size: $font-size-sm;
		}

		&-text {
			font-size: $font-size-xs;
			font-weight: $font-weight-medium;
			line-height: 1.5;

			.application-card__result--success & {
				color: $color-green-1;
			}

			.application-card__result--error & {
				color: $color-red-1;
			}
		}
	}

	&__actions {
		display: flex;
		justify-content: flex-end;
	}

	&__withdraw-btn {
		font-size: $font-size-xs;
		padding: $spacing-4 $spacing-16;
		border-radius: $border-radius-base;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.application-list-card {
		padding: $spacing-20;

		&__title {
			font-size: $font-size-xl;
		}

		&__filter-tabs {
			gap: $spacing-12;
		}

		&__filter-tab {
			padding: $spacing-12 $spacing-16;
			font-size: $font-size-base;
		}
	}

	.application-card {
		&__content {
			padding: $spacing-20;
		}

		&__datetime {
			font-size: $font-size-lg;
		}

		&__location {
			font-size: $font-size-base;
		}

		&__applied-time {

			&-label,
			&-value {
				font-size: $font-size-base;
			}
		}

		&__result {
			&-text {
				font-size: $font-size-base;
			}
		}
	}
}
</style>
