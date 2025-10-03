<script setup lang="ts">
import { computed } from 'vue';

// 定義組件 props 介面
interface UserProfile {
	id: string;
	name: string;
	avatar?: string;
	rating: number;
	phone: string;
	email: string;
}

interface UserStats {
	approvedThisMonth: number;
	pendingHours: number;
	totalHours: number;
}

interface Props {
	userProfile: UserProfile;
	userStats: UserStats;
}

// 定義 props
const props = withDefaults(defineProps<Props>(), {
	userProfile: () => ({
		id: '',
		name: '',
		avatar: '',
		rating: 0,
		phone: '',
		email: ''
	}),
	userStats: () => ({
		approvedThisMonth: 0,
		pendingHours: 0,
		totalHours: 0
	})
});

// 計算屬性：格式化電話號碼（隱藏中間部分）
const maskedPhone = computed(() => {
	if (props.userProfile.phone.length >= 10) {
		const start = props.userProfile.phone.slice(0, 4);
		const end = props.userProfile.phone.slice(-3);
		return `${start}***${end}`;
	}
	return props.userProfile.phone;
});

// 計算屬性：格式化電子郵件（隱藏中間部分）
const maskedEmail = computed(() => {
	const [username, domain] = props.userProfile.email.split('@');
	if (username.length > 2) {
		const start = username.slice(0, 2);
		const end = username.slice(-1);
		return `${start}***@${domain}`;
	}
	return props.userProfile.email;
});
</script>

<template>
	<div class="profile-card">
		<!-- 個人資料區塊 -->
		<div class="profile-card__user-info">
			<!-- 水平排列：頭像 + 個人資料 -->
			<div class="profile-card__user-main">
				<!-- 大頭照 -->
				<div class="profile-card__avatar">
					<div class="profile-card__avatar-placeholder">
						{{ userProfile.name.charAt(0) }}
					</div>
				</div>

				<!-- 個人資料 -->
				<div class="profile-card__user-details">
					<!-- 姓名 -->
					<div class="profile-card__name">
						{{ userProfile.name }}
					</div>

					<!-- 評分 -->
					<div class="profile-card__rating">
						<van-icon name="star" class="profile-card__rating-icon" />
						<span class="profile-card__rating-text">{{ userProfile.rating }}分</span>
					</div>

					<!-- 電話 -->
					<div class="profile-card__contact">
						<van-icon name="phone" class="profile-card__contact-icon" />
						<span class="profile-card__contact-text">{{ maskedPhone }}</span>
					</div>

					<!-- 信箱 -->
					<div class="profile-card__contact">
						<van-icon name="envelop" class="profile-card__contact-icon" />
						<span class="profile-card__contact-text">{{ maskedEmail }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 分割線 -->
		<div class="profile-card__divider"></div>

		<!-- 統計數據區塊 -->
		<div class="profile-card__stats">
			<!-- 本月已核准 -->
			<div class="profile-card__stat-item">
				<div class="profile-card__stat-number profile-card__stat-number--blue">
					{{ userStats.approvedThisMonth }}
				</div>
				<div class="profile-card__stat-label">本月已核准</div>
			</div>

			<!-- 待審核時數 -->
			<div class="profile-card__stat-item">
				<div class="profile-card__stat-number profile-card__stat-number--orange">
					{{ userStats.pendingHours }}
				</div>
				<div class="profile-card__stat-label">待審核時數</div>
			</div>

			<!-- 累積時數 -->
			<div class="profile-card__stat-item">
				<div class="profile-card__stat-number profile-card__stat-number--green">
					{{ userStats.totalHours }}
				</div>
				<div class="profile-card__stat-label">累積時數</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.profile-card {
	background: $color-white;
	border-radius: $border-radius-lg;
	padding: $spacing-16;
	box-shadow: $shadow-base;
	border: 1px solid $color-gray-2;

	&__user-info {}

	&__user-main {
		display: flex;
		align-items: flex-start;
		gap: $spacing-16;
	}

	&__avatar {
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

	&__user-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: $spacing-4;
	}

	&__name {
		font-size: $font-size-base;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		line-height: 1.4;
	}

	&__rating {
		display: flex;
		align-items: center;
		gap: $spacing-4;

		&-icon {
			color: $color-warning;
			font-size: $font-size-sm;
		}

		&-text {
			font-size: $font-size-sm;
			color: $color-text-primary;
			font-weight: $font-weight-medium;
		}
	}

	&__contact {
		display: flex;
		align-items: center;
		gap: $spacing-6;

		&-icon {
			color: $color-text-secondary;
			font-size: $font-size-sm;
		}

		&-text {
			font-size: $font-size-sm;
			color: $color-text-secondary;
		}
	}

	&__divider {
		height: 1px;
		background: $color-gray-2;
		margin: $spacing-16 0;
	}

	&__stats {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	&__stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $spacing-4;
	}

	&__stat-number {
		font-size: $font-size-2xl;
		font-weight: $font-weight-bold;
		line-height: 1.2;

		&--blue {
			color: $color-blue-1;
		}

		&--orange {
			color: $color-warning;
		}

		&--green {
			color: $color-success;
		}
	}

	&__stat-label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		text-align: center;
		line-height: 1.3;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.profile-card {
		padding: $spacing-24;

		&__avatar {
			width: 72px;
			height: 72px;

			&-placeholder {
				font-size: $font-size-2xl;
			}
		}

		&__name {
			font-size: $font-size-xl;
		}

		&__stat-number {
			font-size: 28px;
		}

		&__stat-label {
			font-size: $font-size-sm;
		}
	}
}
</style>
