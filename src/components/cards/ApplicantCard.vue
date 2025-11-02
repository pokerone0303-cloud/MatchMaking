<template>
	<div class="applicant-card">
		<!-- 右上角狀態標籤 -->
		<div class="applicant-card__status-tag" :class="statusConfig[applicant.status].class">
			{{ statusConfig[applicant.status].text }}
		</div>

		<!-- 頂部: 大頭照 | 基本資料 -->
		<div class="applicant-card__header">
			<!-- 大頭照 -->
			<div class="applicant-card__avatar">
				<div class="applicant-card__avatar-placeholder">
					{{ applicant.name.charAt(0) }}
				</div>
			</div>

			<!-- 基本資料 -->
			<div class="applicant-card__basic-info">
				<h3 class="applicant-card__name">{{ applicant.name }}</h3>
				<div class="applicant-card__position-info">
					<span class="applicant-card__position">{{ applicant.position }}</span>
					<span class="applicant-card__separator">•</span>
					<span class="applicant-card__date-time">{{ formatDateTime(applicant.shiftDate, applicant.startTime,
						applicant.endTime) }}</span>
				</div>
				<div class="applicant-card__experience-rating">
					<span class="applicant-card__experience">經驗: {{ applicant.experience }}年</span>
					<span class="applicant-card__separator">•</span>
					<div class="applicant-card__rating">
						<span class="applicant-card__rating-icon">👤</span>
						<span class="applicant-card__rating-value">{{ applicant.rating }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 技能TAG 標籤 -->
		<div class="applicant-card__skills">
			<span v-for="skill in applicant.skills" :key="skill" class="applicant-card__skill-tag">
				{{ skill }}
			</span>
		</div>

		<!-- 聯絡資訊收合區塊 -->
		<div class="applicant-card__contact-section">
			<button class="applicant-card__contact-toggle" @click="toggleContactInfo">
				<span class="applicant-card__toggle-text">
					{{ showContactInfo ? '隱藏聯絡資訊' : '顯示聯絡資訊' }}
				</span>
			</button>

			<div v-if="showContactInfo" class="applicant-card__contact-info">
				<div class="applicant-card__contact-item">
					<span class="applicant-card__contact-icon">📞</span>
					<span class="applicant-card__contact-value">{{ applicant.phone }}</span>
				</div>
				<div class="applicant-card__contact-item">
					<span class="applicant-card__contact-icon">✉️</span>
					<span class="applicant-card__contact-value">{{ applicant.email }}</span>
				</div>
			</div>
		</div>

		<!-- 分割線 -->
		<div class="applicant-card__divider"></div>

		<!-- 應徵時間 -->
		<div class="applicant-card__application-time">
			應徵時間: {{ formatApplicationTime(applicant.applicationTime) }}
		</div>

		<!-- 按鈕 -->
		<div v-if="applicant.status === 'pending'" class="applicant-card__actions">
			<button class="applicant-card__btn applicant-card__btn--accept" @click="handleAccept">
				<span class="applicant-card__btn-icon">✓</span>
				錄取
			</button>
			<button class="applicant-card__btn applicant-card__btn--reject" @click="handleReject">
				<span class="applicant-card__btn-icon">✕</span>
				拒絕
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showConfirmDialog, showToast } from 'vant';

import type { Applicant } from '@/types/application';

// Props 定義
const props = defineProps<{
	applicant: Applicant;
}>();

// Emits 定義
const emit = defineEmits<{
	accept: [id: string];
	reject: [id: string];
}>();

// 響應式數據
const showContactInfo = ref(false);

// 狀態配置
const statusConfig: Record<string, { text: string; class: string }> = {
	pending: {
		text: '待審',
		class: 'applicant-card__status-tag--pending'
	},
	accepted: {
		text: '已錄取',
		class: 'applicant-card__status-tag--accepted'
	},
	rejected: {
		text: '已拒絕',
		class: 'applicant-card__status-tag--rejected'
	},
	waiting: {
		text: '候補',
		class: 'applicant-card__status-tag--waiting'
	}
} as const;

// 方法
const toggleContactInfo = () => {
	showContactInfo.value = !showContactInfo.value;
};

const formatDateTime = (date: string, startTime: string, endTime: string) => {
	return `${date} ${startTime}-${endTime}`;
};

const formatApplicationTime = (time: string) => {
	return new Date(time).toLocaleString('zh-TW', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	});
};

const handleAccept = async () => {
	try {
		await showConfirmDialog({
			title: '確認錄取',
			message: `確定要錄取 ${props.applicant.name} 嗎？`,
			confirmButtonText: '確認錄取',
			cancelButtonText: '取消',
			confirmButtonColor: '#27AE60'
		});

		// 用戶確認後才觸發事件
		emit('accept', props.applicant.id);
		// showToast({
		// 	message: '錄取成功',
		// 	type: 'success'
		// });
	} catch {
		// 用戶取消，不執行任何操作
	}
};

const handleReject = async () => {
	try {
		await showConfirmDialog({
			title: '確認拒絕',
			message: `確定要拒絕 ${props.applicant.name} 的應徵嗎？`,
			confirmButtonText: '確認拒絕',
			cancelButtonText: '取消',
			confirmButtonColor: '#EB5757'
		});

		// 用戶確認後才觸發事件
		emit('reject', props.applicant.id);
		// showToast({
		// 	message: '已拒絕應徵',
		// 	type: 'success'
		// });
	} catch {
		// 用戶取消，不執行任何操作
	}
};
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/variables.scss' as *;

.applicant-card {
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

		&--pending {
			background: $color-warning-100;
			color: $color-warning-700;
		}

		&--accepted {
			background: $color-green-100;
			color: $color-green-700;
		}

		&--rejected {
			background: $color-red-100;
			color: $color-red-700;
		}

		&--waiting {
			background: $color-blue-100;
			color: $color-blue-700;
		}
	}

	&__header {
		display: flex;
		align-items: flex-start;
		gap: $spacing-12;
		margin-bottom: $spacing-4;
	}

	&__avatar {
		flex-shrink: 0;
	}

	&__avatar-placeholder {
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
		line-height: 1.5;
	}

	&__position-info {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	&__experience-rating {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	&__separator {
		color: $color-gray-400;
	}

	&__rating {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
	}

	&__rating-icon {
		font-size: $font-size-sm;
	}

	&__rating-value {
		font-weight: $font-weight-medium;
	}

	&__skills {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-xs;
		margin-bottom: $spacing-8;
	}

	&__skill-tag {
		padding: $spacing-xs $spacing-8;
		background: $color-gray-100;
		color: $color-gray-600;
		border-radius: $border-radius-full;
		font-size: $font-size-xxs;
		font-weight: $font-weight-medium;
	}

	&__contact-section {
		margin-bottom: $spacing-12;
	}

	&__contact-toggle {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		padding: $spacing-xs $spacing-8;
		background: $color-gray-100;
		border: none;
		border-radius: $border-radius-full;
		color: $color-primary;
		font-size: $font-size-xs;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	&__toggle-icon {
		font-size: $font-size-xs;
	}

	&__toggle-text {
		font-weight: $font-weight-medium;
	}

	&__contact-info {
		margin-top: $spacing-8;
		padding: $spacing-4 $spacing-8;
		background: $color-gray-50;
		border-radius: $border-radius-base;
	}

	&__contact-item {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		font-size: $font-size-xs;
		color: $color-text-primary;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__contact-icon {
		font-size: $font-size-sm;
	}

	&__contact-value {
		font-weight: $font-weight-medium;
	}

	&__divider {
		height: 1px;
		background: $color-gray-200;
		margin: $spacing-12 0;
	}

	&__application-time {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		margin-bottom: $spacing-12;
	}

	&__actions {
		display: flex;
		gap: $spacing-8;
	}

	&__btn {
		flex: 1;
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

		&--accept {
			background: $color-success;
			color: $color-white;
		}

		&--reject {
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
	.applicant-card {
		padding: $spacing-20;

		&__header {
			gap: $spacing-16;
		}

		&__avatar-placeholder {
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
