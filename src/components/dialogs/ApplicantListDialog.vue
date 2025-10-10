<script setup lang="ts">
import { computed } from 'vue';
import type { Shift } from '@/types/shift';

// 應徵者介面定義
interface Applicant {
	id: string;
	name: string;
	email: string;
	phone: string;
	experience: number;
	rating: number;
	skills: string[];
	applicationTime: string;
	status: 'pending' | 'accepted' | 'rejected';
}

// Props 定義
interface Props {
	visible: boolean;
	shift: Shift | null;
}

const props = withDefaults(defineProps<Props>(), {
	shift: null
});

// Emits 定義
const emit = defineEmits<{
	(e: 'update:visible', value: boolean): void;
	(e: 'close'): void;
	(e: 'accept', applicantId: string): void;
	(e: 'reject', applicantId: string): void;
}>();

// 模擬應徵者資料
const applicants = computed<Applicant[]>(() => {
	if (!props.shift) return [];

	return [
		{
			id: '1',
			name: '張小明',
			email: 'ming@example.com',
			phone: '0912-345-678',
			experience: 3,
			rating: 4.8,
			skills: ['百家樂', '21點'],
			applicationTime: '2024-09-10 15:30',
			status: 'pending'
		},
		{
			id: '2',
			name: '李美華',
			email: 'hua@example.com',
			phone: '0987-654-321',
			experience: 5,
			rating: 4.9,
			skills: ['百家樂', '德州撲克'],
			applicationTime: '2024-09-10 16:45',
			status: 'accepted'
		},
		{
			id: '3',
			name: '王大偉',
			email: 'david@example.com',
			phone: '0923-456-789',
			experience: 2,
			rating: 4.5,
			skills: ['21點', '輪盤'],
			applicationTime: '2024-09-11 09:20',
			status: 'pending'
		}
	];
});

// 計算屬性
const formattedDate = computed(() => {
	if (!props.shift) return '';
	const date = new Date(props.shift.date);
	return date.toLocaleDateString('zh-TW', {
		month: 'numeric',
		day: 'numeric'
	});
});

const formattedTime = computed(() => {
	if (!props.shift) return '';
	return `${props.shift.startTime}-${props.shift.endTime}`;
});

const applicantCount = computed(() => {
	return `${applicants.value.length}/10`;
});

// 狀態配置
const statusConfig = computed(() => ({
	pending: { text: '待審核', class: 'status-pending' },
	accepted: { text: '已錄取', class: 'status-accepted' },
	rejected: { text: '已拒絕', class: 'status-rejected' }
}));

// 事件處理
const handleClose = () => {
	emit('update:visible', false);
	emit('close');
};

const handleOverlayClick = () => {
	handleClose();
};

const handleAccept = (applicantId: string) => {
	emit('accept', applicantId);
};

const handleReject = (applicantId: string) => {
	emit('reject', applicantId);
};

const formatApplicationTime = (time: string) => {
	return time.replace(' ', ' ');
};
</script>

<template>
	<van-popup :show="visible" position="center" :style="{ width: '90dvw', height: '90dvh', maxWidth: '768px' }" round
		closeable :close-icon-position="'top-right'" @close="handleClose" @click-overlay="handleOverlayClick">
		<div class="applicant-list-dialog">
			<!-- Sticky 標題區塊 -->
			<div class="applicant-list-dialog__header">
				<h2 class="applicant-list-dialog__title">應徵名單</h2>
				<!-- 關閉按鈕 icon:x -->
				<div class="close-button" @click="handleClose">
					<van-icon name="close" size="16" color="black" />
				</div>
			</div>

			<!-- Sticky 頂部說明區塊 -->
			<div class="applicant-list-dialog__info">
				<div class="applicant-list-dialog__info-content">
					<div class="applicant-list-dialog__date-time">{{ formattedDate }} · {{ formattedTime }}</div>
					<div class="applicant-list-dialog__position">{{ shift?.title }} · {{ shift?.location }}</div>
					<div class="applicant-list-dialog__count">應徵人數 : {{ applicantCount }}</div>
				</div>
			</div>

			<!-- Scroll Content 內容卡片區塊 -->
			<div class="applicant-list-dialog__content">
				<div v-for="applicant in applicants" :key="applicant.id" class="applicant-list-dialog__card">
					<!-- 應徵者資訊 -->
					<div class="applicant-list-dialog__card-header">
						<h3 class="applicant-list-dialog__applicant-name">{{ applicant.name }}</h3>
						<span class="applicant-list-dialog__status-tag" :class="statusConfig[applicant.status].class">
							{{ statusConfig[applicant.status].text }}
						</span>
					</div>

					<div class="applicant-list-dialog__card-content">
						<div class="applicant-list-dialog__detail-item">
							<span class="applicant-list-dialog__detail-label">Email:</span>
							<span class="applicant-list-dialog__detail-value">{{ applicant.email }}</span>
						</div>
						<div class="applicant-list-dialog__detail-item">
							<span class="applicant-list-dialog__detail-label">電話 :</span>
							<span class="applicant-list-dialog__detail-value">{{ applicant.phone }}</span>
						</div>
						<div class="applicant-list-dialog__detail-item">
							<span class="applicant-list-dialog__detail-label">經驗 :</span>
							<span class="applicant-list-dialog__detail-value">{{ applicant.experience }}年</span>
						</div>
						<div class="applicant-list-dialog__detail-item">
							<span class="applicant-list-dialog__detail-label">評分 :</span>
							<span class="applicant-list-dialog__detail-value">★ {{ applicant.rating }}</span>
						</div>
						<div class="applicant-list-dialog__detail-item">
							<span class="applicant-list-dialog__detail-label">技能 :</span>
							<span class="applicant-list-dialog__detail-value">{{ applicant.skills.join(', ') }}</span>
						</div>
						<div class="applicant-list-dialog__detail-item">
							<span class="applicant-list-dialog__detail-label">應徵時間 :</span>
							<span class="applicant-list-dialog__detail-value">{{ formatApplicationTime(applicant.applicationTime)
							}}</span>
						</div>
					</div>

					<!-- 操作按鈕 (僅待審核狀態顯示) -->
					<div v-if="applicant.status === 'pending'" class="applicant-list-dialog__actions">
						<button class="applicant-list-dialog__btn applicant-list-dialog__btn--accept"
							@click="handleAccept(applicant.id)">
							錄取
						</button>
						<button class="applicant-list-dialog__btn applicant-list-dialog__btn--reject"
							@click="handleReject(applicant.id)">
							拒絕
						</button>
					</div>
				</div>
			</div>
		</div>
	</van-popup>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
@use 'sass:color';

.applicant-list-dialog {
	height: 100%;
	display: flex;
	flex-direction: column;
	background: $color-white;

	// Sticky 標題區塊
	&__header {
		padding: $spacing-8 0;
		border-bottom: 1px solid $color-gray-2;
		position: sticky;
		top: 0;
		background: $color-white;
		z-index: 2;
	}

	&__title {
		font-size: $font-size-md;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin: 0;
		text-align: center;
	}

	// Sticky 頂部說明區塊
	&__info {
		background: $color-gray-100;
		border-bottom: 1px solid $color-gray-2;
		position: sticky;
		top: 0; // 標題高度
		z-index: 1;
	}

	&__info-content {
		padding: $spacing-4 $spacing-16;
	}

	&__date-time {
		font-size: $font-size-xs;
		color: $color-text-primary;
	}

	&__position {
		font-size: $font-size-xs;
		color: $color-text-primary;
		margin-bottom: $spacing-4;
	}

	&__count {
		font-size: $font-size-xs;
		color: $color-text-primary;
	}

	// Scroll Content 內容卡片區塊
	&__content {
		flex: 1;
		padding: $spacing-12 $spacing-16 $spacing-16;
		overflow-y: auto;
	}

	&__card {
		background: $color-white;
		border-radius: $border-radius-md;
		padding: $spacing-12;
		margin-bottom: $spacing-12;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border: 1px solid $color-gray-200;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: $spacing-8;
	}

	&__applicant-name {
		font-size: $font-size-base;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin: 0;
	}

	&__status-tag {
		padding: $spacing-4 $spacing-8;
		border-radius: $border-radius-sm;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		white-space: nowrap;

		&.status-pending {
			background: $color-warning;
			color: $color-white;
		}

		&.status-accepted {
			background: $color-success;
			color: $color-white;
		}

		&.status-rejected {
			background: $color-danger;
			color: $color-white;
		}
	}

	&__card-content {
		margin-bottom: $spacing-12;
	}

	&__detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: $spacing-4 0;
		border-bottom: 1px solid $color-gray-100;

		&:last-child {
			border-bottom: none;
		}
	}

	&__detail-label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		flex-shrink: 0;
	}

	&__detail-value {
		font-size: $font-size-xs;
		color: $color-text-primary;
		text-align: right;
		flex: 1;
		margin-left: $spacing-8;
	}

	// 操作按鈕
	&__actions {
		display: flex;
		gap: $spacing-8;
	}

	&__btn {
		flex: 1;
		padding: $spacing-8;
		border-radius: $border-radius-sm;
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		line-height: 1;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;

		&--accept {
			background: $color-success;
			color: $color-white;
		}

		&--reject {
			background: $color-white;
			color: $color-text-secondary;
			border: 1px solid $color-gray-300;
		}
	}
}

// 響應式設計
@media (min-width: 768px) {
	.applicant-list-dialog {
		&__content {
			padding: $spacing-20;
		}

		&__card {
			padding: $spacing-20;
		}
	}
}
</style>
