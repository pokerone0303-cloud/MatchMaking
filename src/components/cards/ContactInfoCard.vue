<script setup lang="ts">
// 定義聯絡資訊介面
interface ContactInfo {
	phone: string;
	email: string;
	address: string;
	unifiedNumber: string;
}

interface Props {
	contactInfo: ContactInfo;
}

// 定義 props
withDefaults(defineProps<Props>(), {
	contactInfo: () => ({
		phone: '',
		email: '',
		address: '',
		unifiedNumber: ''
	})
});
</script>

<template>
	<div class="contact-info-card">
		<!-- 標題 -->
		<div class="contact-info-card__header">
			<van-icon name="description" class="contact-info-card__icon" />
			<span class="contact-info-card__title">聯絡資訊</span>
		</div>

		<!-- 聯絡資訊列表 -->
		<div class="contact-info-card__info-list">
			<!-- 公司電話 -->
			<div class="contact-info-card__info-item">
				<van-icon name="phone" class="contact-info-card__info-icon" />
				<div class="contact-info-card__info-content">
					<div class="contact-info-card__info-value">{{ contactInfo.phone }}</div>
					<div class="contact-info-card__info-label">公司電話</div>
				</div>
			</div>

			<!-- 聯絡信箱 -->
			<div class="contact-info-card__info-item">
				<van-icon name="invitation" class="contact-info-card__info-icon" />
				<div class="contact-info-card__info-content">
					<div class="contact-info-card__info-value">{{ contactInfo.email }}</div>
					<div class="contact-info-card__info-label">聯絡信箱</div>
				</div>
			</div>

			<!-- 公司地址 -->
			<div class="contact-info-card__info-item">
				<van-icon name="location" class="contact-info-card__info-icon" />
				<div class="contact-info-card__info-content">
					<div class="contact-info-card__info-value">{{ contactInfo.address }}</div>
					<div class="contact-info-card__info-label">公司地址</div>
				</div>
			</div>

			<!-- 統一編號 -->
			<div class="contact-info-card__info-item">
				<van-icon name="description" class="contact-info-card__info-icon" />
				<div class="contact-info-card__info-content">
					<div class="contact-info-card__info-value">{{ contactInfo.unifiedNumber }}</div>
					<div class="contact-info-card__info-label">統一編號</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.contact-info-card {
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
		font-size: $font-size-base;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
	}

	&__info-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-12;
	}

	&__info-item {
		display: flex;
		align-items: flex-start;
		gap: $spacing-12;
	}

	&__info-icon {
		color: $color-text-secondary;
		font-size: $font-size-base;
		margin-top: $spacing-2;
		flex-shrink: 0;
	}

	&__info-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: $spacing-2;
	}

	&__info-value {
		font-size: $font-size-sm;
		color: $color-text-primary;
		line-height: 1.4;
		font-weight: $font-weight-medium;
	}

	&__info-label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		line-height: 1;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.contact-info-card {
		padding: $spacing-24;

		&__title {
			font-size: $font-size-lg;
		}

		&__info-list {
			gap: $spacing-16;
		}

		&__info-value {
			font-size: $font-size-base;
		}

		&__info-label {
			font-size: $font-size-sm;
		}
	}
}
</style>
