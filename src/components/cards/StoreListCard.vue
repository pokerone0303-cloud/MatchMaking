<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 定義據點資訊介面
interface StoreInfo {
	id: string;
	name: string;
	address: string;
	status: 'operating' | 'paused' | 'closed';
}

interface Props {
	storeList: StoreInfo[];
}

// 定義 props
const props = withDefaults(defineProps<Props>(), {
	storeList: () => []
});

// 定義 emits
const emit = defineEmits<{
	viewAllStores: [];
}>();

// 處理查看完整據點清單
const handleViewAllStores = () => {
	router.push('/e/stores');
	emit('viewAllStores');
};

// 計算屬性：最多顯示三筆據點
const displayedStores = computed(() => {
	return props.storeList.slice(0, 3);
});

// 計算屬性：狀態標籤配置
const getStatusConfig = (status: string) => {
	switch (status) {
		case 'operating':
			return {
				type: 'success' as const,
				text: '營運中'
			};
		case 'paused':
			return {
				type: 'warning' as const,
				text: '暫停'
			};
		case 'closed':
			return {
				type: 'danger' as const,
				text: '關閉'
			};
		default:
			return {
				type: 'default' as const,
				text: '未知'
			};
	}
};
</script>

<template>
	<div class="store-list-card">
		<!-- 標題 -->
		<div class="store-list-card__header">
			<van-icon name="location-o" class="store-list-card__icon" />
			<span class="store-list-card__title">據點清單</span>
		</div>

		<!-- 據點列表 -->
		<div class="store-list-card__store-list">
			<div v-for="(store, index) in displayedStores" :key="store.id" class="store-list-card__store-item"
				:class="{ 'store-list-card__store-item--last': index === displayedStores.length - 1 }">
				<!-- 據點名稱和狀態 -->
				<div class="store-list-card__store-header">
					<div class="store-list-card__store-name">{{ store.name }}</div>
					<van-tag :type="getStatusConfig(store.status).type" class="store-list-card__status-tag">
						{{ getStatusConfig(store.status).text }}
					</van-tag>
				</div>

				<!-- 據點地址 -->
				<div class="store-list-card__store-address">{{ store.address }}</div>
			</div>
		</div>

		<!-- 跳轉按鈕 -->
		<div class="store-list-card__action">
			<van-button type="default" size="small" block @click="handleViewAllStores" class="store-list-card__jump-button">
				<van-icon name="description" class="store-list-card__button-icon" />
				查看完整據點清單
			</van-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.store-list-card {
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
		border-bottom: 1px solid $color-gray-2;
	}

	&__icon {
		color: $color-primary;
		font-size: $font-size-lg;
	}

	&__title {
		flex: 1;
		font-size: $font-size-base;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
	}

	&__arrow {
		color: $color-text-secondary;
		font-size: $font-size-sm;
	}

	&__store-list {
		display: flex;
		flex-direction: column;
	}

	&__store-item {
		padding: $spacing-12 0;
		border-bottom: 1px solid $color-gray-2;

		&--last {
			border-bottom: none;
		}
	}

	&__store-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: $spacing-4;
		gap: $spacing-8;
	}

	&__store-name {
		font-size: $font-size-sm;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		line-height: 1.4;
		flex: 1;
	}

	&__status-tag {
		flex-shrink: 0;
	}

	&__store-address {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		line-height: 1;
	}

	&__action {
		margin-top: $spacing-12;
	}

	&__jump-button {
		border-radius: $border-radius-md;
		font-weight: $font-weight-medium;
		color: $color-text-primary;
		border-color: $color-gray-3;
	}

	&__button-icon {
		margin-right: $spacing-4;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.store-list-card {
		padding: $spacing-24;

		&__title {
			font-size: $font-size-lg;
		}

		&__store-item {
			padding: $spacing-16 0;
		}

		&__store-name {
			font-size: $font-size-base;
		}

		&__store-address {
			font-size: $font-size-sm;
		}
	}
}
</style>
