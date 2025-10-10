<template>
	<div class="shift-card">
		<!-- 詳細資料彈窗 -->
		<ShiftDetailsDialog :show="showDetailsDialog" @update:show="showDetailsDialog = $event" :timeRange="timeRange"
			:position="position" :company="company" :hourlyWage="hourlyWage" :hiredCount="hiredCount" :totalCount="totalCount"
			:deadline="deadline" :address="address" :trafficInfo="trafficInfo" :contactPerson="contactPerson"
			:contactPhone="contactPhone" :contactEmail="contactEmail" :jobDescription="jobDescription"
			:requirements="requirements" :benefits="benefits" />

		<!-- 編輯班別對話框 -->
		<EditShiftDialog :show="showEditDialog" :shift-data="shiftData" @update:show="showEditDialog = $event"
			@update="handleShiftUpdate" @cancel="handleEditCancel" />

		<!-- 刪除確認對話框 -->
		<van-dialog v-model:show="showDeleteConfirmDialog" title="確認刪除" message="確定要刪除這個班別嗎?此操作無法復原。" show-cancel-button
			confirm-button-text="確認刪除" cancel-button-text="取消" confirm-button-color="#fb2c36" @confirm="confirmDelete"
			@cancel="cancelDelete" />
		<!-- 時間標題和狀態標籤 -->
		<div class="shift-card__header">
			<div class="shift-card__time-title">
				<span class="time">{{ timeRange }}</span>
				<span class="separator">・</span>
				<span class="position">{{ position }}</span>
			</div>
			<div class="shift-card__status">
				<span class="status-tag" :class="statusClass">
					{{ statusText }}
				</span>
			</div>
		</div>

		<!-- 名稱與位置 -->
		<div class="shift-card__location">
			<span class="company">{{ company }}</span>
			<span class="separator">・</span>
			<span class="address">{{ address }}</span>
		</div>

		<!-- 內容區塊 -->
		<div class="shift-card__content">
			<div class="content-item">
				<div class="content-item__icon">
					<span class="icon-dollar">$</span>
				</div>
				<span class="content-item__text">時薪 ${{ hourlyWage }}</span>
			</div>

			<div class="content-item">
				<div class="content-item__icon">
					<span class="icon-people">👥</span>
				</div>
				<span class="content-item__text">{{ hiredCount }}/{{ totalCount }}人</span>
			</div>
		</div>

		<!-- 截止日期 -->
		<div class="shift-card__deadline">
			<div class="content-item">
				<div class="content-item__icon">
					<span class="icon-clock">🕐</span>
				</div>
				<span class="content-item__text">截止: {{ deadlineText }}</span>
			</div>
		</div>

		<!-- 底部按鈕區塊 -->
		<div class="shift-card__actions">
			<div class="action-buttons">
				<!-- 查看詳情 -->
				<button class="btn btn--view-list" @click="handleDetails">
					<van-icon name="user-o" />
					查看詳情
				</button>
				<!-- View List -->
				<button class="btn btn--view-list" @click="handleViewList">
					<van-icon name="user-o" />
					查看名單
				</button>

				<!-- Edit -->
				<button class="btn btn--edit" @click="handleEdit">
					<van-icon name="edit" />
					編輯
				</button>

				<!-- Delete -->
				<button class="btn btn--delete" @click="handleDelete">
					<van-icon name="delete" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ShiftDetailsDialog from '@/components/dialogs/ShiftDetailsDialog.vue';
import EditShiftDialog from '@/components/dialogs/EditShiftDialog.vue';

// Props 定義
interface Props {
	timeRange: string; // 時間範圍，如 "14:00-22:00"
	position: string; // 職位名稱，如 "發牌員"
	company: string; // 公司名稱，如 "星光娛樂城"
	address: string; // 地址，如 "新北市板橋區"
	hourlyWage: number; // 時薪
	hiredCount: number; // 已錄取人數
	totalCount: number; // 總需求人數
	deadline: string; // 截止時間，如 "今日13:00"
	status: 'open' | 'full' | 'closed' | 'draft'; // 班表狀態
	applicationStatus?: 'applied' | 'not-hired' | 'hired' | null; // 申請狀態
	// 詳細資料彈窗需要的額外屬性
	trafficInfo?: string; // 交通資訊
	contactPerson?: string; // 聯絡人
	contactPhone?: string; // 聯絡電話
	contactEmail?: string; // 聯絡信箱
	jobDescription?: string; // 工作說明
	requirements?: string[]; // 應徵條件
	benefits?: string[]; // 福利待遇
}

const props = withDefaults(defineProps<Props>(), {
	applicationStatus: null,
	trafficInfo: '捷運市政府站2號出口步行5分鐘,或搭乘公車至世貿站下車。',
	contactPerson: '王經理',
	contactPhone: '02-2345-6789',
	contactEmail: 'manager@luxurycasino.com',
	jobDescription: '負責百家樂、21點等桌邊遊戲的發牌與桌面管理,維護遊戲秩序,確保遊戲公平進行。',
	requirements: () => [
		'需具備1年以上荷官經驗',
		'熟悉百家樂、21點等遊戲規則',
		'具備良好的數學計算能力',
		'英語溝通能力佳'
	],
	benefits: () => [
		'提供員工餐點',
		'交通津貼$200/日',
		'績效獎金',
		'免費制服清洗'
	]
});

// Emits 定義
const emit = defineEmits<{
	apply: [id: string];
	withdraw: [id: string];
	details: [id: string];
	viewList: [id: string];
	edit: [id: string, data: Record<string, string | number>];
	delete: [id: string];
}>();

// 計算屬性
const statusClass = computed(() => {
	switch (props.status) {
		case 'open':
			return 'status-tag--open';
		case 'full':
			return 'status-tag--full';
		case 'closed':
			return 'status-tag--closed';
		case 'draft':
			return 'status-tag--draft';
		default:
			return 'status-tag--open';
	}
});

const statusText = computed(() => {
	switch (props.status) {
		case 'open':
			return '開放';
		case 'full':
			return '額滿';
		case 'closed':
			return '已關閉';
		case 'draft':
			return '草稿';
		default:
			return '開放';
	}
});

const deadlineText = computed(() => {
	return props.deadline;
});

// 詳細資料彈窗狀態
const showDetailsDialog = ref(false);

// 編輯對話框狀態
const showEditDialog = ref(false);

// 班別數據（用於編輯）
const shiftData = computed(() => ({
	workDate: '2024/09/15',
	startTime: '18:00',
	endTime: '23:00',
	position: props.position,
	location: props.address,
	hourlyWage: props.hourlyWage,
	requiredStaff: props.totalCount,
	deadline: '2024/09/15 下午05:00'
}));

// 新增事件處理器
const handleViewList = () => {
	// 暫時不做相關功能
	console.log('查看名單功能待實現');
};

const handleEdit = () => {
	showEditDialog.value = true;
};

const handleDelete = () => {
	// 顯示刪除確認對話框
	showDeleteConfirmDialog.value = true;
};

const handleDetails = () => {
	showDetailsDialog.value = true;
};

// 刪除確認對話框狀態
const showDeleteConfirmDialog = ref(false);

const confirmDelete = () => {
	emit('delete', 'shift-id'); // 這裡應該傳入實際的 shift ID
	showDeleteConfirmDialog.value = false;
};

const cancelDelete = () => {
	showDeleteConfirmDialog.value = false;
};

// 編輯相關事件處理器
const handleShiftUpdate = (data: Record<string, string | number>) => {
	console.log('更新班別數據:', data);
	// 這裡可以發送 API 請求更新班別
	if (data && typeof data === 'object') {
		emit('edit', 'shift-id', data);
	}
};

const handleEditCancel = () => {
	console.log('取消編輯');
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
@use '@/styles/animations.scss' as *;

.shift-card {
	background: $color-white;
	border-radius: $border-radius-lg;
	padding: $spacing-12;
	box-shadow: $shadow-sm;
	border: 1px solid $color-gray-200;
	// transition: all $animation-duration-base $animation-easing-ease-out;
	margin-bottom: $spacing-8;
	width: 100%;
	// max-width: 375px;
	margin-left: auto;
	margin-right: auto;

	// &:hover {
	// 	@extend .card-hover;
	// }

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: $spacing-xs;
		gap: $spacing-8;
	}

	&__time-title {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0; // 防止文字溢出

		.time {
			font-size: $font-size-base;
			font-weight: $font-weight-semibold;
			color: $color-gray-900;
			white-space: nowrap;
		}

		.separator {
			margin: 0 $spacing-xs;
			color: $color-gray-500;
			flex-shrink: 0;
		}

		.position {
			font-size: $font-size-base;
			font-weight: $font-weight-semibold;
			color: $color-gray-900;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	&__status {
		flex-shrink: 0;

		.status-tag {
			padding: $spacing-xs $spacing-sm;
			border-radius: $border-radius-md;
			font-size: $font-size-xs;
			font-weight: $font-weight-medium;
			white-space: nowrap;
			display: inline-block;

			&--open {
				background: $color-green-100;
				color: $color-green-700;
			}

			&--full {
				background: $color-orange-100;
				color: $color-orange-700;
			}

			&--closed {
				background: $color-gray-100;
				color: $color-gray-600;
			}

			&--draft {
				background: $color-blue-100;
				color: $color-blue-700;
			}
		}
	}

	&__location {
		margin-bottom: $spacing-8;
		font-size: $font-size-sm;
		color: $color-gray-700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		.separator {
			margin: 0 $spacing-xs;
			color: $color-gray-500;
		}
	}

	&__content {
		display: flex;
		justify-content: space-between;
		margin-bottom: $spacing-sm;
		gap: $spacing-8;
	}

	&__deadline {
		margin-bottom: $spacing-12;
	}

	.content-item {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		flex: 1;
		min-width: 0;

		&__icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 14px;
			height: 14px;
			flex-shrink: 0;

			.icon-dollar {
				font-size: $font-size-xs;
				font-weight: $font-weight-bold;
				color: $color-gray-700;
			}

			.icon-people {
				font-size: $font-size-xs;
			}

			.icon-clock {
				font-size: $font-size-xs;
			}
		}

		&__text {
			font-size: $font-size-sm;
			color: $color-gray-700;
			font-weight: $font-weight-medium;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	&__actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: $spacing-8;
	}

	.action-buttons {
		display: flex;
		gap: $spacing-sm;
		flex: 1;
		min-width: 0;
		height: 30px;
	}

	.btn {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		padding: $spacing-4 $spacing-4;
		border-radius: $border-radius-md;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		border: 1px solid $color-gray-300;
		cursor: pointer;
		white-space: nowrap;
		flex-shrink: 0;
		background: $color-white;
		color: $color-gray-700;

		&--view-list {
			flex: 1;
			justify-content: center;
			border: 1px solid $color-gray-300;
			background: $color-white;
			color: $color-gray-700;

		}

		&--edit {
			flex: 1;
			justify-content: center;
			border: 1px solid $color-gray-300;
			background: $color-white;
			color: $color-gray-700;

		}

		&--delete {
			aspect-ratio: 1/1;
			// width: 100%;
			height: 100%;
			padding: 0;
			justify-content: center;
			border: 1px solid $color-red-300;
			background: $color-white;
			color: $color-red-600;

			.van-icon {
				font-size: $font-size-sm;
			}
		}

		.van-icon {
			font-size: $font-size-xs;
		}
	}

	.action-status {
		flex-shrink: 0;

		.status-badge {
			padding: $spacing-xs $spacing-sm;
			border-radius: $border-radius-md;
			font-size: $font-size-xs;
			font-weight: $font-weight-medium;
			white-space: nowrap;
			display: inline-block;

			&--applied {
				background: $color-blue-100;
				color: $color-blue-700;
			}

			&--not-hired {
				background: $color-red-100;
				color: $color-red-700;
			}

			&--hired {
				background: $color-green-100;
				color: $color-green-700;
			}
		}
	}
}

// 針對 iPhone 8 (375px) 的優化
@media (max-width: 375px) {
	.shift-card {
		padding: $spacing-8;
		margin-left: $spacing-xs;
		margin-right: $spacing-xs;
		max-width: calc(100% - #{$spacing-sm});

		&__header {
			flex-direction: column;
			align-items: flex-start;
			gap: $spacing-xs;
		}

		&__time-title {
			width: 100%;

			.time {
				font-size: $font-size-sm;
			}

			.position {
				font-size: $font-size-sm;
			}
		}

		&__content {
			flex-direction: column;
			gap: $spacing-xs;
		}

		&__actions {
			flex-direction: column;
			align-items: stretch;
			gap: $spacing-sm;
		}

		.action-buttons {
			justify-content: center;
			flex-direction: column;
			gap: $spacing-xs;
		}

		.btn {
			width: 100%;
			justify-content: center;
		}
	}
}
</style>
