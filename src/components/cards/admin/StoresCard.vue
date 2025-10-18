<template>
	<div class="store-card">
		<!-- 右上角狀態標籤 -->
		<div class="store-card__status-tag" :class="statusConfig[store.status].class">
			{{ statusConfig[store.status].text }}
		</div>

		<!-- 頂部: 商家圖標 | 基本資料 -->
		<div class="store-card__header">
			<!-- 商家圖標 -->
			<div class="store-card__logo">
				<div class="store-card__logo-placeholder">
					{{ store.name.charAt(0) }}
				</div>
			</div>

			<!-- 基本資料 -->
			<div class="store-card__basic-info">
				<h3 class="store-card__name">{{ store.name }}</h3>
				<p class="store-card__id">ID: {{ store.id }}</p>
				<div class="store-card__position-info">
					<span class="store-card__position">{{ store.code }}</span>
					<span class="store-card__separator">•</span>
					<span class="store-card__manager">{{ store.manager }}</span>
				</div>
				<div class="store-card__contact-summary">
					<span class="store-card__email">{{ store.email }}</span>
					<span class="store-card__separator">•</span>
					<span class="store-card__phone">{{ store.phone }}</span>
				</div>
			</div>
		</div>

		<!-- 公司地址 -->
		<div class="store-card__address-section">
			<div class="store-card__address-title">公司地址</div>
			<div class="store-card__address-value">{{ store.address }}</div>
		</div>

		<!-- 營運與據點資訊 -->
		<div class="store-card__operation-info">
			<div class="store-card__tax-section">
				<div class="store-card__tax-title">統編</div>
				<div class="store-card__tax-value">{{ store.taxId }}</div>
			</div>
			<div class="store-card__location-count">
				據點數：{{ store.locationCount }}
			</div>
		</div>

		<!-- 營業據點 -->
		<div class="store-card__locations-section">
			<div class="store-card__locations-title">營業據點</div>
			<div class="store-card__locations-list">
				<span v-for="location in store.locations" :key="location" class="store-card__location-tag">
					<span class="store-card__location-icon">🏢</span>
					{{ location }}
				</span>
			</div>
		</div>

		<!-- 統計區塊 -->
		<div class="store-card__statistics">
			<div class="store-card__statistics-item">
				<span class="store-card__statistics-value store-card__statistics-value--blue">{{ store.publishedShifts }}</span>
				<span class="store-card__statistics-label">發布班別</span>
			</div>
			<div class="store-card__statistics-item">
				<span class="store-card__statistics-value store-card__statistics-value--green">{{ store.successfulHires
				}}</span>
				<span class="store-card__statistics-label">成功錄取</span>
			</div>
			<div class="store-card__statistics-item">
				<span class="store-card__statistics-value store-card__statistics-value--orange">{{
					formatJoinDate(store.joinDate) }}</span>
				<span class="store-card__statistics-label">加入日期</span>
			</div>
		</div>

		<!-- 操作按鈕 -->
		<div class="store-card__actions">
			<button class="store-card__btn store-card__btn--edit" @click="handleEdit">
				<span class="store-card__btn-icon">✏</span>
				編輯
			</button>
			<button class="store-card__btn store-card__btn--toggle-status"
				:class="store.status === 'active' ? 'store-card__btn--disable' : 'store-card__btn--enable'"
				@click="handleToggleStatus">
				<span class="store-card__btn-icon">{{ store.status === 'active' ? '⏸' : '▶' }}</span>
				{{ store.status === 'active' ? '停用' : '啟用' }}
			</button>
			<button class="store-card__btn store-card__btn--suspend" @click="handleSuspend">
				<span class="store-card__btn-icon">⚠</span>
				停權
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { showConfirmDialog } from 'vant';
import type { Store } from '@/types/store';

// Props 定義
const props = defineProps<{
	store: Store;
}>();

// Emits 定義
const emit = defineEmits<{
	edit: [id: string];
	toggleStatus: [id: string];
	suspend: [id: string];
}>();

// 狀態配置
const statusConfig = {
	active: {
		text: '啟用',
		class: 'store-card__status-tag--active'
	},
	inactive: {
		text: '停用',
		class: 'store-card__status-tag--inactive'
	},
	suspended: {
		text: '停權',
		class: 'store-card__status-tag--suspended'
	}
};

// 方法
const formatJoinDate = (date: string) => {
	return new Date(date).toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});
};

const handleEdit = () => {
	emit('edit', props.store.id);
};

const handleToggleStatus = async () => {
	const isActive = props.store.status === 'active';
	const action = isActive ? '停用' : '啟用';

	try {
		await showConfirmDialog({
			title: `確認${action}`,
			message: `確定要${action} ${props.store.name} 的帳號嗎？`,
			confirmButtonText: `確認${action}`,
			cancelButtonText: '取消',
			confirmButtonColor: isActive ? '#F2994A' : '#27AE60'
		});

		// 用戶確認後才觸發事件
		emit('toggleStatus', props.store.id);
	} catch {
		// 用戶取消，不執行任何操作
	}
};

const handleSuspend = async () => {
	try {
		await showConfirmDialog({
			title: '確認停權',
			message: `確定要停權 ${props.store.name} 的帳號嗎？`,
			confirmButtonText: '確認停權',
			cancelButtonText: '取消',
			confirmButtonColor: '#EB5757'
		});

		// 用戶確認後才觸發事件
		emit('suspend', props.store.id);
	} catch {
		// 用戶取消，不執行任何操作
	}
};
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/variables.scss' as *;

.store-card {
	position: relative;
	background: $color-white;
	border: 1px solid $color-gray-200;
	border-radius: $border-radius-lg;
	padding: $spacing-8 $spacing-16;
	margin-bottom: $spacing-16;
	box-shadow: $shadow-base;

	&__status-tag {
		position: absolute;
		top: $spacing-8;
		right: $spacing-8;
		padding: $spacing-4 $spacing-8;
		border-radius: $border-radius-base;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		z-index: 1;

		&--active {
			background: $color-green-100;
			color: $color-green-700;
		}

		&--inactive {
			background: $color-gray-100;
			color: $color-gray-600;
		}

		&--suspended {
			background: $color-red-100;
			color: $color-red-700;
		}
	}

	&__header {
		display: flex;
		align-items: flex-start;
		gap: $spacing-12;
		margin-bottom: $spacing-4;
	}

	&__logo {
		flex-shrink: 0;
	}

	&__logo-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: $color-gray-200;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: $font-size-md;
		font-weight: $font-weight-semibold;
		color: $color-gray-600;
	}

	&__basic-info {
		flex: 1;
		min-width: 0;
	}

	&__name {
		font-size: $font-size-md;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		// margin: 0 0 $spacing-xs 0;
		line-height: 1.2;
	}

	&__id {
		font-size: $font-size-xxs;
		line-height: 1.5;
		color: $color-gray-500
	}

	&__position-info {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	&__contact-summary {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	&__separator {
		color: $color-gray-400;
	}

	&__address-section {
		margin-bottom: $spacing-16;
	}

	&__address-title {
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		color: $color-text-secondary;
		margin-bottom: $spacing-xs;
	}

	&__address-value {
		font-size: $font-size-xs;
		color: $color-text-primary;
		line-height: 1.4;
	}

	&__operation-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: $spacing-8;
	}

	&__tax-section {
		flex: 1;
		display: flex;
		gap: $spacing-xs;
	}

	&__tax-title {
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		color: $color-text-secondary;
	}

	&__tax-value {
		font-size: $font-size-xs;
		color: $color-text-primary;
		font-weight: $font-weight-medium;
	}

	&__location-count {
		flex: 1;
		font-size: $font-size-xs;
		color: $color-text-primary;
		font-weight: $font-weight-medium;
	}

	&__locations-section {
		margin-bottom: $spacing-16;
	}

	&__locations-title {
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		color: $color-text-secondary;
		margin-bottom: $spacing-xs;
	}

	&__locations-list {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-8;
	}

	&__location-tag {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		padding: $spacing-2 $spacing-8;
		background: $color-white;
		color: $color-text-primary;
		border: 1px solid $color-gray-200;
		border-radius: $border-radius-base;
		font-size: $font-size-xxs;
		font-weight: $font-weight-medium;
	}

	&__location-icon {
		font-size: $font-size-sm;
	}

	&__statistics {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: $spacing-8 0;
		background: $color-gray-100;
		border-radius: $border-radius-lg;
		margin-bottom: $spacing-12;
		gap: $spacing-8;
	}

	&__statistics-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		text-align: center;
	}

	&__statistics-value {
		font-size: $font-size-sm;
		font-weight: $font-weight-semibold;
		// margin-bottom: $spacing-xs;
		line-height: 1.3;

		&--blue {
			color: $color-primary;
		}

		&--green {
			color: $color-success;
		}

		&--orange {
			color: $color-warning;
		}
	}

	&__statistics-label {
		font-size: $font-size-xxs;
		color: $color-text-secondary;
		line-height: 1;
	}

	&__actions {
		display: flex;
		gap: $spacing-8;
	}

	&__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: $spacing-xs;
		padding: $spacing-8 $spacing-16;
		border: none;
		border-radius: $border-radius-base;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		width: fit-content;
		height: fit-content;
		line-height: 1;
		cursor: pointer;
		transition: all 0.2s ease;

		&--edit {
			flex: 2;
			background: $color-white;
			color: $color-text-primary;
			border: 1px solid $color-gray-300;
		}

		&--toggle-status {
			flex: 1;
			background: $color-white;
			color: $color-text-primary;
			border: 1px solid $color-gray-300;
		}

		&--suspend {
			flex: 1;
			background: $color-white;
			color: $color-danger;
			border: 1px solid $color-danger;
		}

		&--enable {
			background: $color-white;
			color: $color-success;
			border: 1px solid $color-success;
		}

		&--disable {
			background: $color-white;
			color: $color-danger;
			border: 1px solid $color-danger;
		}
	}

	&__btn-icon {
		font-size: $font-size-sm;
		font-weight: $font-weight-bold;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.store-card {
		padding: $spacing-20;

		&__header {
			gap: $spacing-16;
		}

		&__logo-placeholder {
			width: 56px;
			height: 56px;
			font-size: $font-size-xl;
		}

		&__name {
			font-size: $font-size-xl;
		}
	}
}
</style>
