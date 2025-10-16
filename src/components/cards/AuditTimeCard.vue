<template>
	<div class="audit-time-card">
		<!-- 右上角狀態標籤 -->
		<div class="audit-time-card__status-tag" :class="statusConfig[timesheetData.status].class">
			{{ statusConfig[timesheetData.status].text }}
		</div>

		<!-- 頂部: 申請編號 | 基本資料 -->
		<div class="audit-time-card__header">
			<!-- 申請編號 -->
			<div class="audit-time-card__id">
				<!-- <input type="checkbox" class="audit-time-card__checkbox" /> -->
				<span class="audit-time-card__id-text">#{{ timesheetData.id }}</span>
			</div>

			<!-- 基本資料 -->
			<div class="audit-time-card__basic-info">
				<div class="audit-time-card__info-row">
					<span class="audit-time-card__info-icon">👤</span>
					<span class="audit-time-card__info-text">{{ timesheetData.applicantName }}</span>
				</div>
				<div class="audit-time-card__info-row">
					<span class="audit-time-card__info-icon">🏢</span>
					<span class="audit-time-card__info-text">{{ timesheetData.location }}</span>
				</div>
				<div class="audit-time-card__info-row">
					<span class="audit-time-card__info-icon">📅</span>
					<span class="audit-time-card__info-text">{{ formatDateTime(timesheetData.date, timesheetData.startTime,
						timesheetData.endTime) }}</span>
				</div>
			</div>
		</div>

		<!-- 職位和申報時數區塊 -->
		<div class="audit-time-card__work-details">
			<div class="audit-time-card__work-item">
				<span class="audit-time-card__work-label">職位 :</span>
				<span class="audit-time-card__work-value">{{ timesheetData.position }}</span>
			</div>
			<div class="audit-time-card__work-item">
				<span class="audit-time-card__work-label">申報時數 :</span>
				<span class="audit-time-card__work-value audit-time-card__work-value--highlight">{{ timesheetData.declaredHours
				}} 小時</span>
			</div>
		</div>

		<!-- 審核備註區塊 -->
		<div v-if="timesheetData.auditNote" class="audit-time-card__remark-section">
			<div class="audit-time-card__remark-label">審核備註 :</div>
			<div class="audit-time-card__remark-content">{{ timesheetData.auditNote }}</div>
		</div>

		<!-- 聯絡資訊收合區塊 -->
		<div class="audit-time-card__contact-section">
			<button class="audit-time-card__contact-toggle" @click="toggleContactInfo">
				<span class="audit-time-card__toggle-text">
					{{ showContactInfo ? '隱藏聯絡資訊' : '顯示聯絡資訊' }}
				</span>
			</button>

			<div v-if="showContactInfo" class="audit-time-card__contact-info">
				<div class="audit-time-card__contact-item">
					<span class="audit-time-card__contact-icon">📞</span>
					<span class="audit-time-card__contact-value">{{ timesheetData.phone }}</span>
				</div>
				<div class="audit-time-card__contact-item">
					<span class="audit-time-card__contact-icon">✉️</span>
					<span class="audit-time-card__contact-value">{{ timesheetData.email }}</span>
				</div>
			</div>
		</div>

		<!-- 分割線 -->
		<div class="audit-time-card__divider"></div>

		<!-- 提交時間 -->
		<div class="audit-time-card__submission-time">
			提交時間: {{ formatSubmissionTime(timesheetData.submittedAt) }}
		</div>

		<!-- 按鈕 -->
		<div v-if="timesheetData.status === 'pending'" class="audit-time-card__actions">
			<button class="audit-time-card__btn audit-time-card__btn--approve" @click="showApproveDialog">
				<span class="audit-time-card__btn-icon">✓</span>
				通過
			</button>
			<button class="audit-time-card__btn audit-time-card__btn--adjust" @click="showAdjustDialog">
				<span class="audit-time-card__btn-icon">✏️</span>
				調整
			</button>
			<button class="audit-time-card__btn audit-time-card__btn--reject" @click="showRejectDialog">
				<span class="audit-time-card__btn-icon">✕</span>
				駁回
			</button>
		</div>
	</div>

	<!-- 通過審核對話框 -->
	<van-dialog v-model:show="showApproveNoteDialog" title="通過審核" show-cancel-button confirm-button-text="確認通過"
		cancel-button-text="取消" confirm-button-color="#27AE60" @confirm="confirmApproveWithNote"
		@cancel="cancelApproveNote">
		<div class="audit-dialog-content">
			<van-field v-model="auditNote" type="textarea" placeholder="請輸入審核備註 (選填)" rows="3" autosize />
		</div>
	</van-dialog>

	<!-- 調整時數對話框 -->
	<van-dialog v-model:show="showAdjustDetailDialog" title="調整時數" show-cancel-button confirm-button-text="確認調整"
		cancel-button-text="取消" confirm-button-color="#2F80ED" @confirm="confirmAdjustWithDetails"
		@cancel="cancelAdjustDetail">
		<div class="audit-dialog-content">
			<van-field v-model="adjustedHours" type="digit" label="審核時數" placeholder="請輸入調整後的時數" />
			<van-field v-model="auditNote" type="textarea" label="審核備註" placeholder="請輸入審核備註 (選填)" rows="3" autosize />
		</div>
	</van-dialog>

	<!-- 駁回申請對話框 -->
	<van-dialog v-model:show="showRejectNoteDialog" title="駁回申請" show-cancel-button confirm-button-text="確認駁回"
		cancel-button-text="取消" confirm-button-color="#EB5757" @confirm="confirmRejectWithNote" @cancel="cancelRejectNote">
		<div class="audit-dialog-content">
			<van-field v-model="auditNote" type="textarea" placeholder="請輸入審核備註 (選填)" rows="3" autosize />
		</div>
	</van-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';
import type { TimesheetRecord } from '@/types/timesheet';

// Props 定義
const props = defineProps<{
	timesheetData: TimesheetRecord;
}>();

// Emits 定義
const emit = defineEmits<{
	approve: [id: string, auditNote?: string];
	adjust: [id: string, adjustedHours: number, auditNote?: string];
	reject: [id: string, auditNote?: string];
}>();

// 響應式數據
const showContactInfo = ref(false);

// 對話框顯示狀態
const showApproveNoteDialog = ref(false);
const showAdjustDetailDialog = ref(false);
const showRejectNoteDialog = ref(false);

// 表單數據
const auditNote = ref('');
const adjustedHours = ref('');

// 狀態配置
const statusConfig = {
	pending: {
		text: '待審',
		class: 'audit-time-card__status-tag--pending'
	},
	approved: {
		text: '已通過',
		class: 'audit-time-card__status-tag--approved'
	},
	rejected: {
		text: '已駁回',
		class: 'audit-time-card__status-tag--rejected'
	},
	adjusted: {
		text: '已調整',
		class: 'audit-time-card__status-tag--adjusted'
	}
};

// 方法
const toggleContactInfo = () => {
	showContactInfo.value = !showContactInfo.value;
};

const formatDateTime = (date: string, startTime: string, endTime: string) => {
	return `${date} ${startTime}-${endTime}`;
};

const formatSubmissionTime = (time: string) => {
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

// 通過審核相關方法
const showApproveDialog = () => {
	showApproveNoteDialog.value = true;
};

const confirmApproveWithNote = () => {
	emit('approve', props.timesheetData.id, auditNote.value);
	showToast({
		message: '審核通過',
		type: 'success'
	});
	showApproveNoteDialog.value = false;
	auditNote.value = '';
};

const cancelApproveNote = () => {
	showApproveNoteDialog.value = false;
	auditNote.value = '';
};

// 調整時數相關方法
const showAdjustDialog = () => {
	adjustedHours.value = props.timesheetData.declaredHours.toString();
	showAdjustDetailDialog.value = true;
};

const confirmAdjustWithDetails = () => {
	const hours = parseFloat(adjustedHours.value) || 0;
	emit('adjust', props.timesheetData.id, hours, auditNote.value);
	showToast({
		message: '時數已調整',
		type: 'success'
	});
	showAdjustDetailDialog.value = false;
	auditNote.value = '';
	adjustedHours.value = '';
};

const cancelAdjustDetail = () => {
	showAdjustDetailDialog.value = false;
	auditNote.value = '';
	adjustedHours.value = '';
};

// 駁回申請相關方法
const showRejectDialog = () => {
	showRejectNoteDialog.value = true;
};

const confirmRejectWithNote = () => {
	emit('reject', props.timesheetData.id, auditNote.value);
	showToast({
		message: '申請已駁回',
		type: 'success'
	});
	showRejectNoteDialog.value = false;
	auditNote.value = '';
};

const cancelRejectNote = () => {
	showRejectNoteDialog.value = false;
	auditNote.value = '';
};
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/variables.scss' as *;

.audit-time-card {
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

		&--approved {
			background: $color-green-100;
			color: $color-green-700;
		}

		&--rejected {
			background: $color-red-100;
			color: $color-red-700;
		}

		&--adjusted {
			background: $color-blue-100;
			color: $color-blue-700;
		}
	}

	&__header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: $spacing-8;
	}

	&__id {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		flex-shrink: 0;
	}

	&__checkbox {
		width: 16px;
		height: 16px;
		border: 1px solid $color-gray-400;
		border-radius: $border-radius-md;
	}

	&__id-text {
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $color-text-primary;
	}

	&__basic-info {
		flex: 1;
		min-width: 0;
	}

	&__info-row {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		margin-bottom: $spacing-xs;
		font-size: $font-size-xs;
		color: $color-text-secondary;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__info-icon {
		font-size: $font-size-sm;
		flex-shrink: 0;
	}

	&__info-text {
		font-weight: $font-weight-medium;
	}

	&__work-details {
		background: $color-gray-50;
		border-radius: $border-radius-base;
		padding: $spacing-8;
		margin-bottom: $spacing-8;
	}

	&__work-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: $spacing-xs;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__work-label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		font-weight: $font-weight-medium;
	}

	&__work-value {
		font-size: $font-size-xs;
		color: $color-text-primary;
		font-weight: $font-weight-semibold;

		&--highlight {
			color: $color-primary;
		}
	}

	&__remark-section {
		margin-bottom: $spacing-8;
		padding: $spacing-8;
		background: $color-gray-50;
		border-radius: $border-radius-base;
	}

	&__remark-label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		font-weight: $font-weight-medium;
		margin-bottom: $spacing-xs;
	}

	&__remark-content {
		font-size: $font-size-xs;
		color: $color-text-primary;
		line-height: 1.5;
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
		margin-bottom: $spacing-xs;

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

	&__submission-time {
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
		padding: $spacing-8 $spacing-12;
		border: none;
		border-radius: $border-radius-base;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		cursor: pointer;

		&--approve {
			background: $color-success;
			color: $color-white;
		}

		&--adjust {
			background: $color-white;
			color: $color-text-primary;
			border: 1px solid $color-gray-300;
		}

		&--reject {
			background: $color-danger;
			color: $color-white;
		}
	}

	&__btn-icon {
		font-size: $font-size-sm;
		font-weight: $font-weight-bold;
	}
}

// 對話框內容樣式
.audit-dialog-content {
	padding: $spacing-16;
}

// 響應式設計
@media (min-width: 768px) {
	.audit-time-card {
		padding: $spacing-20;

		&__header {
			gap: $spacing-16;
		}

		&__work-details {
			padding: $spacing-12;
		}

		&__remark-section {
			padding: $spacing-12;
		}
	}
}
</style>
