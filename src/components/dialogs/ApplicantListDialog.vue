<script setup lang="ts">
import { computed } from 'vue';
import type { Shift } from '@/types/shift';
import type { Applicant } from '@/types/application';
import ApplicantCard from '@/components/cards/ApplicantCard.vue';

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
			position: '桌邊荷官',
			shiftDate: '2024-09-15',
			startTime: '18:00',
			endTime: '23:00',
			experience: 3,
			rating: 4.8,
			skills: ['百家樂', '21點', '輪盤'],
			workAreas: ['台北市', '新北市'],
			phone: '0912-345-678',
			email: 'ming@example.com',
			applicationTime: '2024-09-10 15:30',
			totalHours: 120,
			joinDate: '2024-01-01',
			lastActivity: '2024-09-14',
			status: 'pending'
		},
		{
			id: '2',
			name: '李美華',
			position: '桌邊荷官',
			shiftDate: '2024-09-15',
			startTime: '18:00',
			endTime: '23:00',
			experience: 5,
			rating: 4.9,
			skills: ['百家樂', '德州撲克'],
			workAreas: ['台北市'],
			phone: '0987-654-321',
			email: 'hua@example.com',
			applicationTime: '2024-09-10 16:45',
			totalHours: 250,
			joinDate: '2023-06-01',
			lastActivity: '2024-09-15',
			status: 'accepted'
		},
		{
			id: '3',
			name: '王大偉',
			position: '桌邊荷官',
			shiftDate: '2024-09-15',
			startTime: '18:00',
			endTime: '23:00',
			experience: 2,
			rating: 4.5,
			skills: ['21點', '輪盤'],
			workAreas: ['新北市'],
			phone: '0923-456-789',
			email: 'david@example.com',
			applicationTime: '2024-09-11 09:20',
			totalHours: 80,
			joinDate: '2024-03-01',
			lastActivity: '2024-09-13',
			status: 'accepted'
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
				<ApplicantCard v-for="applicant in applicants" :key="applicant.id" :applicant="applicant" @accept="handleAccept"
					@reject="handleReject" />
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

}

// 響應式設計
@media (min-width: 768px) {
	.applicant-list-dialog {
		&__content {
			padding: $spacing-20;
		}
	}
}
</style>
