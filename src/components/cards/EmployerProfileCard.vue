<script setup lang="ts">
import { computed } from 'vue';

// 定義商家資料介面
interface EmployerProfile {
	id: string;
	companyName: string;
	logo?: string;
	contactPerson: string;
	membershipDate: string;
	isVerified: boolean;
}

interface Props {
	employerProfile: EmployerProfile;
}

// 定義 props
const props = withDefaults(defineProps<Props>(), {
	employerProfile: () => ({
		id: '',
		companyName: '',
		logo: '',
		contactPerson: '',
		membershipDate: '',
		isVerified: false
	})
});

// 計算屬性：格式化會員日期
const formattedMembershipDate = computed(() => {
	const date = new Date(props.employerProfile.membershipDate);
	return date.toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});
});
</script>

<template>
	<div class="employer-profile-card">
		<!-- 商家資料區塊 -->
		<div class="employer-profile-card__company-info">
			<!-- 水平排列：LOGO + 商家資料 -->
			<div class="employer-profile-card__company-main">
				<!-- 公司 LOGO -->
				<div class="employer-profile-card__logo">
					<div class="employer-profile-card__logo-placeholder">
						{{ employerProfile.companyName.charAt(0) }}
					</div>
				</div>

				<!-- 商家資料 -->
				<div class="employer-profile-card__company-details">
					<!-- 公司名稱 + 驗證狀態 -->
					<div class="employer-profile-card__company-header">
						<div class="employer-profile-card__company-name">
							{{ employerProfile.companyName }}
						</div>
						<van-tag v-if="employerProfile.isVerified" type="success" size="medium"
							class="employer-profile-card__verified-tag">
							已驗證
						</van-tag>
					</div>

					<!-- 聯絡人 -->
					<div class="employer-profile-card__contact-person">
						聯絡人: {{ employerProfile.contactPerson }}
					</div>

					<!-- 會員時間 -->
					<div class="employer-profile-card__membership-date">
						會員時間: {{ formattedMembershipDate }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.employer-profile-card {
	background: $color-white;
	border-radius: $border-radius-lg;
	padding: $spacing-16;
	box-shadow: $shadow-base;
	border: 1px solid $color-gray-2;

	&__company-info {}

	&__company-main {
		display: flex;
		align-items: flex-start;
		gap: $spacing-16;
	}

	&__logo {
		flex-shrink: 0;
		width: 60px;
		height: 60px;

		&-placeholder {
			width: 100%;
			height: 100%;
			border-radius: $border-radius-full;
			background: linear-gradient(135deg, $color-blue-1 0%, $color-primary 100%);
			display: flex;
			align-items: center;
			justify-content: center;
			color: $color-white;
			font-size: $font-size-xl;
			font-weight: $font-weight-semibold;
			box-shadow: $shadow-base;
		}
	}

	&__company-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: $spacing-4;
	}

	&__company-header {
		display: flex;
		align-items: center;
		gap: $spacing-8;
		flex-wrap: wrap;
	}

	&__company-name {
		font-size: $font-size-lg;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		line-height: 1.2;
	}

	&__verified-tag {
		flex-shrink: 0;
		border-radius: $border-radius-sm;
	}

	&__contact-person {
		font-size: $font-size-sm;
		color: $color-text-secondary;
		line-height: 1.2;
	}

	&__membership-date {
		font-size: $font-size-sm;
		color: $color-text-secondary;
		line-height: 1.2;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.employer-profile-card {
		padding: $spacing-24;

		&__logo {
			width: 72px;
			height: 72px;

			&-placeholder {
				font-size: $font-size-2xl;
			}
		}

		&__company-name {
			font-size: $font-size-xl;
		}

		&__contact-person,
		&__membership-date {
			font-size: $font-size-base;
		}
	}
}
</style>
