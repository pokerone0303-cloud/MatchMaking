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
				<p class="applicant-card__id">ID: {{ applicant.id }}</p>
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

		<!-- 可工作地區 -->
		<div class="applicant-card__work-areas">
			<div class="applicant-card__work-areas-title">可工作地區</div>
			<div class="applicant-card__work-areas-tags">
				<span v-for="area in applicant.workAreas" :key="area" class="applicant-card__work-area-tag">
					{{ area }}
				</span>
			</div>
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

		<!-- 統計區塊 : 總工時 加入日期 最後活動日期-->
		<div class="applicant-card__statistics">
			<div class="applicant-card__statistics-item">
				<span class="applicant-card__statistics-value applicant-card__statistics-value--blue">{{ applicant.totalHours
				}}</span>
				<span class="applicant-card__statistics-label">總工時</span>
			</div>
			<div class="applicant-card__statistics-item">
				<span class="applicant-card__statistics-value applicant-card__statistics-value--green">{{
					formatJoinDate(applicant.joinDate) }}</span>
				<span class="applicant-card__statistics-label">加入日期</span>
			</div>
			<div class="applicant-card__statistics-item">
				<span class="applicant-card__statistics-value applicant-card__statistics-value--orange">{{
					formatLastActivity(applicant.lastActivity) }}</span>
				<span class="applicant-card__statistics-label">最後活動</span>
			</div>
		</div>
		<!-- 分割線 -->
		<div class="applicant-card__divider"></div>

		<!-- 應徵時間 -->
		<div class="applicant-card__application-time">
			應徵時間: {{ formatApplicationTime(applicant.applicationTime) }}
		</div>

		<!-- 按鈕 -->
		<div class="applicant-card__actions">
			<button class="applicant-card__btn applicant-card__btn--edit" @click="handleEdit">
				<span class="applicant-card__btn-icon">✏</span>
				編輯
			</button>
			<button class="applicant-card__btn applicant-card__btn--toggle-status"
				:class="applicant.status === 'active' ? 'applicant-card__btn--disable' : 'applicant-card__btn--enable'"
				@click="handleToggleStatus">
				<span class="applicant-card__btn-icon">{{ applicant.status === 'active' ? '⏸' : '▶' }}</span>
				{{ applicant.status === 'active' ? '停用' : '啟用' }}
			</button>
			<button class="applicant-card__btn applicant-card__btn--suspend" @click="handleSuspend">
				<span class="applicant-card__btn-icon">⚠</span>
				停權
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
	edit: [id: string];
	toggleStatus: [id: string];
	suspend: [id: string];
}>();

// 響應式數據
const showContactInfo = ref(false);

// 狀態配置
const statusConfig = {
	active: {
		text: '啟用',
		class: 'applicant-card__status-tag--active'
	},
	inactive: {
		text: '停用',
		class: 'applicant-card__status-tag--inactive'
	},
	suspended: {
		text: '停權',
		class: 'applicant-card__status-tag--suspended'
	}
};

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

const formatJoinDate = (date: string) => {
	return new Date(date).toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});
};

const formatLastActivity = (date: string) => {
	return new Date(date).toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});
};

const handleEdit = () => {
	emit('edit', props.applicant.id);
};

const handleToggleStatus = async () => {
	const isActive = props.applicant.status === 'active';
	const action = isActive ? '停用' : '啟用';

	try {
		await showConfirmDialog({
			title: `確認${action}`,
			message: `確定要${action} ${props.applicant.name} 的帳號嗎？`,
			confirmButtonText: `確認${action}`,
			cancelButtonText: '取消',
			confirmButtonColor: isActive ? '#F2994A' : '#27AE60'
		});

		// 用戶確認後才觸發事件
		emit('toggleStatus', props.applicant.id);
	} catch {
		// 用戶取消，不執行任何操作
	}
};

const handleSuspend = async () => {
	try {
		await showConfirmDialog({
			title: '確認停權',
			message: `確定要停權 ${props.applicant.name} 的帳號嗎？`,
			confirmButtonText: '確認停權',
			cancelButtonText: '取消',
			confirmButtonColor: '#EB5757'
		});

		// 用戶確認後才觸發事件
		emit('suspend', props.applicant.id);
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

	&__work-areas {
		margin-bottom: $spacing-12;
	}

	&__work-areas-title {
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		color: $color-text-secondary;
		margin-bottom: $spacing-xs;
	}

	&__work-areas-tags {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-xs;
	}

	&__work-area-tag {
		padding: $spacing-xs $spacing-8;
		background: $color-white;
		color: $color-text-primary;
		border: 1px solid $color-gray-200;
		border-radius: $border-radius-base;
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
