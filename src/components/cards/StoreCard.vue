<script setup lang="ts">
import { computed, ref } from 'vue';
import GenericDetailsDialog from '../dialogs/GenericDetailsDialog.vue';
import EditStoreDialog from '../dialogs/EditLocationDialog.vue';

// 據點資料類型定義
interface StoreData {
	id: string;
	name: string;
	address: string;
	contactPerson: string;
	employeeCount: number;
	phone: string;
	capacity: number;
	totalShifts: number;
	inProgress: number;
	facilities: string[];
	operatingHours: string;
	remarks: string;
	establishmentDate: string;
	status: 'operating' | 'maintenance' | 'closed';
	email?: string;
}

// Props 定義
interface Props {
	store: StoreData;
	showDetails?: boolean;
	showEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	showDetails: true,
	showEdit: true
});

// Emits 定義
const emit = defineEmits<{
	(e: 'viewDetails', store: StoreData): void;
	(e: 'edit', store: StoreData): void;
	(e: 'update', data: Record<string, string | number>): void;
}>();

// 計算屬性
const statusConfig = computed(() => {
	const statusMap = {
		operating: { text: '營運中', class: 'status-operating' },
		maintenance: { text: '維護中', class: 'status-maintenance' },
		closed: { text: '已關閉', class: 'status-closed' }
	};
	return statusMap[props.store.status] || statusMap.operating;
});

const formattedEstablishmentDate = computed(() => {
	const date = new Date(props.store.establishmentDate);
	return date.toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
});

// 對話框數據結構
const dialogSections = computed(() => [
	{
		title: '基本資訊',
		icon: '🏢',
		items: [
			{ label: '據點名稱', value: props.store.name },
			{ label: '據點編號', value: `#${props.store.id}` },
			{ label: '地址', value: props.store.address },
			{ label: '成立日期', value: formattedEstablishmentDate.value }
		]
	},
	{
		title: '聯絡資訊',
		icon: '📞',
		items: [
			{ label: '負責人', value: props.store.contactPerson },
			{ label: '員工數', value: `${props.store.employeeCount}人` },
			{ label: '電話', value: props.store.phone }
		]
	},
	{
		title: '營運統計',
		icon: '📊',
		items: [
			{ label: '容納人數', value: `${props.store.capacity}人`, valueClass: 'info-value--blue' },
			{ label: '總班別數', value: `${props.store.totalShifts}`, valueClass: 'info-value--green' },
			{ label: '進行中', value: `${props.store.inProgress}`, valueClass: 'info-value--orange' }
		]
	},
	{
		title: '設施資訊',
		icon: '🎰',
		items: [
			{ label: '提供設施', value: props.store.facilities.join(', ') },
			{ label: '營業時間', value: props.store.operatingHours }
		]
	},
	{
		title: '備註資訊',
		icon: '📝',
		items: [
			{ label: '備註', value: props.store.remarks }
		]
	}
]);

// 彈跳窗口狀態
const showDetailsDialog = ref(false);
const showEditDialog = ref(false);

// 事件處理
const handleViewDetails = () => {
	showDetailsDialog.value = true;
	emit('viewDetails', props.store);
};

const handleEdit = () => {
	showEditDialog.value = true;
	emit('edit', props.store);
};

const handleCloseDetailsDialog = () => {
	showDetailsDialog.value = false;
};

const handleCloseEditDialog = () => {
	showEditDialog.value = false;
};

const handleUpdate = (data: Record<string, string | number>) => {
	emit('update', data);
	showEditDialog.value = false;
};
</script>

<template>
	<div class="store-card">
		<!-- 頂部標題區域 -->
		<div class="store-card__header">
			<div class="store-card__title-section">
				<div class="store-card__name">{{ store.name }}</div>
				<div class="store-card__id">#{{ store.id }}</div>
			</div>
			<!-- 狀態標籤 -->
			<div class="store-card__status" :class="statusConfig.class">
				{{ statusConfig.text }}
			</div>
		</div>

		<!-- 聯絡資訊區塊 -->
		<div class="store-card__contact">
			<div class="store-card__contact-item">
				<van-icon name="location-o" class="store-card__icon" />
				<span>{{ store.address }}</span>
			</div>
			<div class="store-card__contact-item">
				<van-icon name="contact" class="store-card__icon" />
				<span>負責人:{{ store.contactPerson }}・員工:{{ store.employeeCount }}人</span>
			</div>
			<div class="store-card__contact-item">
				<van-icon name="phone-o" class="store-card__icon" />
				<span>{{ store.phone }}</span>
			</div>
		</div>

		<!-- 重要統計區域 -->
		<div class="store-card__stats">
			<div class="store-card__stat-item">
				<div class="store-card__stat-number store-card__stat-number--blue">{{ store.capacity }}</div>
				<div class="store-card__stat-label">容納人數</div>
			</div>
			<div class="store-card__stat-item">
				<div class="store-card__stat-number store-card__stat-number--green">{{ store.totalShifts }}</div>
				<div class="store-card__stat-label">總班別數</div>
			</div>
			<div class="store-card__stat-item">
				<div class="store-card__stat-number store-card__stat-number--orange">{{ store.inProgress }}</div>
				<div class="store-card__stat-label">進行中</div>
			</div>
		</div>

		<!-- 提供設施區域 -->
		<div class="store-card__facilities">
			<div class="store-card__facilities-title">提供設施:</div>
			<div class="store-card__facilities-tags">
				<span v-for="facility in store.facilities" :key="facility" class="store-card__facility-tag">
					{{ facility }}
				</span>
			</div>
		</div>

		<!-- 營業時間區域 -->
		<div class="store-card__hours">
			<div class="store-card__hours-title">營業時間:</div>
			<div class="store-card__hours-content">{{ store.operatingHours }}</div>
		</div>

		<!-- 備註區域 -->
		<div class="store-card__remarks">
			<div class="store-card__remarks-title">備註:</div>
			<div class="store-card__remarks-content">{{ store.remarks }}</div>
		</div>

		<!-- 分隔線 -->
		<div class="store-card__divider"></div>

		<!-- 底部區域 -->
		<div class="store-card__footer">
			<div class="store-card__establishment-date">成立:{{ formattedEstablishmentDate }}</div>
			<div class="store-card__actions">
				<button v-if="showEdit" class="store-card__edit-btn" @click="handleEdit">
					<van-icon name="edit" class="store-card__btn-icon" />
					編輯
				</button>
				<button v-if="showDetails" class="store-card__details-btn" @click="handleViewDetails">
					<van-icon name="eye-o" class="store-card__btn-icon" />
					詳細
				</button>
			</div>
		</div>
	</div>

	<!-- 詳細內容窗口 -->
	<GenericDetailsDialog v-model:show="showDetailsDialog" title="據點詳細資料" :sections="dialogSections"
		@close="handleCloseDetailsDialog" />

	<!-- 編輯據點窗口 -->
	<EditStoreDialog v-model:show="showEditDialog" mode="edit" :store-data="{
		name: store.name,
		address: store.address,
		contactPerson: store.contactPerson,
		phone: store.phone,
		capacity: store.capacity,
		email: store.email || '',
		operatingHours: store.operatingHours,
		facilities: store.facilities.join(', '),
		remarks: store.remarks,
		status: store.status
	}" @update="handleUpdate" @close="handleCloseEditDialog" />
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.store-card {
	position: relative;
	background: $color-white;
	border-radius: $border-radius-lg;
	padding: $spacing-16;
	margin-bottom: $spacing-16;
	box-shadow: $shadow-base;
	border: 1px solid $color-gray-2;

	// 頂部標題區域
	&__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: $spacing-8;
		position: relative;
	}

	&__title-section {
		flex: 1;
	}

	&__name {
		font-size: $font-size-lg;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		line-height: 1;
	}

	&__id {
		font-size: $font-size-sm;
		color: $color-text-secondary;
	}

	&__status {
		position: absolute;
		right: 0;
		top: 0;
		padding: $spacing-4 $spacing-8;
		border-radius: $border-radius-sm;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		white-space: nowrap;

		&.status-operating {
			background: $color-success;
			color: $color-white;
		}

		&.status-maintenance {
			background: $color-warning;
			color: $color-white;
		}

		&.status-closed {
			background: $color-danger;
			color: $color-white;
		}
	}

	// 聯絡資訊區塊
	&__contact {
		margin-bottom: $spacing-12;
	}

	&__contact-item {
		display: flex;
		align-items: center;
		font-size: $font-size-xs;
		color: $color-text-primary;
		margin-bottom: $spacing-4;
		line-height: 1.5;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__icon {
		margin-right: $spacing-8;
		color: $color-text-secondary;
	}

	// 重要統計區域
	&__stats {
		display: flex;
		justify-content: space-around;
		margin-bottom: $spacing-12;
		padding: $spacing-8 0;
		background: $color-gray-50;
		border-radius: $border-radius-md;
	}

	&__stat-item {
		text-align: center;
	}

	&__stat-number {
		font-size: $font-size-lg;
		line-height: 1;
		margin-bottom: $spacing-4;

		&--blue {
			color: $color-blue-1;
		}

		&--green {
			color: $color-green-1;
		}

		&--orange {
			color: $color-orange-1;
		}
	}

	&__stat-label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	// 提供設施區域
	&__facilities {
		margin-bottom: $spacing-12;
	}

	&__facilities-title {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		margin-bottom: $spacing-8;
		line-height: 1.5;
	}

	&__facilities-tags {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-8;
	}

	&__facility-tag {
		padding: $spacing-4 $spacing-8;
		background: $color-gray-100;
		border-radius: $border-radius-sm;
		font-size: $font-size-xs;
		color: $color-text-primary;
	}

	// 營業時間區域
	&__hours {
		background: $color-blue-50;
		border-radius: $border-radius-sm;
		padding: $spacing-8 $spacing-12;
		margin-bottom: $spacing-12;
	}

	&__hours-title {
		font-size: $font-size-xs;
		line-height: 1.5;
		color: $color-text-secondary;
		margin-bottom: $spacing-4;
	}

	&__hours-content {
		font-size: $font-size-xs;
		color: $color-text-primary;
		line-height: 1.5;
	}

	// 備註區域
	&__remarks {
		background: $color-yellow-50;
		border-radius: $border-radius-sm;
		padding: $spacing-8 $spacing-12;
		margin-bottom: $spacing-12;
	}

	&__remarks-title {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		margin-bottom: $spacing-4;
		line-height: 1.5;
	}

	&__remarks-content {
		font-size: $font-size-xs;
		color: $color-text-primary;
		line-height: 1.5;
	}

	// 分隔線
	&__divider {
		height: 1px;
		background: $color-gray-2;
		margin-bottom: $spacing-12;
	}

	// 底部區域
	&__footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	&__establishment-date {
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	&__actions {
		display: flex;
		gap: $spacing-8;
	}

	&__edit-btn,
	&__details-btn {
		display: flex;
		align-items: center;
		gap: $spacing-4;
		padding: $spacing-6 $spacing-12;
		background: transparent;
		border: 1px solid $color-gray-300;
		border-radius: $border-radius-sm;
		font-size: $font-size-xs;
		color: $color-text-primary;
		cursor: pointer;
		transition: all 0.2s ease;
		width: fit-content;
		height: fit-content;
		line-height: 1.5;

		&:hover {
			background: $color-gray-50;
			border-color: $color-gray-400;
		}
	}

	&__edit-btn {
		background: $color-primary;
		color: $color-white;
		border-color: $color-primary;

		&:hover {
			background: $color-primary-dark;
			border-color: $color-primary-dark;
		}
	}

	&__btn-icon {
		font-size: $font-size-xs;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.store-card {
		padding: $spacing-16;

		&__stats {
			padding: $spacing-16 0;
		}

		&__facilities-tags {
			gap: $spacing-12;
		}
	}
}
</style>
