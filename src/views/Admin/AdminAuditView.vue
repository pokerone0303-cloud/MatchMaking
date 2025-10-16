<template>
	<div class="employer-applicants">
		<FilterHeader title="應徵名單" :filter-config="filterConfig" :sticky="true" :show-title="false"
			@update-filter="handleFilterChange" @search="handleSearch" @toggle-filter="handleToggleFilter"
			@reset="handleReset" />

		<div class="content-container">
			<div class="status-filter-buttons">
				<button v-for="status in statusOptions" :key="status.value" @click="handleStatusFilter(status.value)" :class="{
					active: selectedStatus === status.value,
					[`status-btn--${status.value}`]: true
				}" class="status-btn">
					{{ status.label }}
					<span v-if="statusCounts[status.value] > 0" class="count-badge">
						({{ statusCounts[status.value] }})
					</span>
				</button>
			</div>

			<div class="applicants-list">
				<AuditTimeCard v-for="timesheet in filteredTimesheets" :key="timesheet.id" :timesheet-data="timesheet"
					@approve="handleApprove" @adjust="handleAdjust" @reject="handleReject" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import AuditTimeCard from '@/components/cards/AuditTimeCard.vue';
import FilterHeader from '@/components/common/FilterHeader.vue';
import { useDialog } from '@/composables/useDialog';
import type { FilterConfig } from '@/types/filter';
import type { AuditTimesheetData } from '@/types/timesheet';

defineOptions({
	name: 'EmployerApplicantsView',
});

const { showConfirm, showSuccess, showDangerConfirm } = useDialog();

const timesheets = ref<AuditTimesheetData[]>([
	{
		id: 'TS001',
		applicantId: 'USER001',
		applicantName: '張小明',
		position: '桌邊荷官',
		location: '豪華賭場',
		date: '2024-09-15',
		startTime: '18:00',
		endTime: '23:00',
		declaredHours: 5,
		dealerNote: '準時上下班,工作表現良好',
		submittedAt: '2024-09-16T09:30:00',
		phone: '0912-345-678',
		email: 'ming@example.com',
		status: 'pending' as const,
	},
	{
		id: 'TS002',
		applicantId: 'USER002',
		applicantName: '李美華',
		position: '桌邊荷官',
		location: '豪華賭場',
		date: '2024-09-15',
		startTime: '18:00',
		endTime: '23:00',
		declaredHours: 5,
		dealerNote: '工作認真負責',
		auditNote: '時數計算正確，工作表現良好',
		submittedAt: '2024-09-16T10:15:00',
		phone: '0987-654-321',
		email: 'hua@example.com',
		status: 'approved' as const,
	},
	{
		id: 'TS003',
		applicantId: 'USER003',
		applicantName: '王大偉',
		position: '發牌員',
		location: '豪華賭場',
		date: '2024-09-16',
		startTime: '14:00',
		endTime: '22:00',
		declaredHours: 8,
		dealerNote: '經驗豐富，表現優異',
		auditNote: '時數有誤，實際工作時間為7小時',
		submittedAt: '2024-09-17T08:20:00',
		phone: '0923-456-789',
		email: 'david@example.com',
		status: 'rejected' as const,
	},
	{
		id: 'TS004',
		applicantId: 'USER004',
		applicantName: '陳小芳',
		position: '百家樂荷官',
		location: '豪華賭場',
		date: '2024-09-15',
		startTime: '20:00',
		endTime: '02:00',
		declaredHours: 6,
		dealerNote: '服務態度良好',
		submittedAt: '2024-09-16T11:45:00',
		phone: '0955-123-456',
		email: 'fang@example.com',
		status: 'pending' as const,
	},
]);

const selectedStatus = ref('all');
const statusOptions = ref([
	{ label: '全部', value: 'all' },
	{ label: '待審', value: 'pending' },
	{ label: '已通過', value: 'approved' },
	{ label: '已駁回', value: 'rejected' },
	{ label: '已調整', value: 'adjusted' }
]);

const statusCounts = ref<Record<string, number>>({
	all: 0,
	pending: 0,
	approved: 0,
	rejected: 0,
	adjusted: 0
});

// 篩選配置
const filterConfig = ref<FilterConfig>({
	fields: [
		{
			type: 'search',
			key: 'search',
			label: '搜尋',
			placeholder: '搜尋職位/商家',
			width: 'full'
		},
		{
			type: 'select',
			key: 'status',
			label: '狀態',
			placeholder: '選擇狀態',
			width: 'half',
			options: [
				{ text: '全部狀態', value: 'all' },
				{ text: '尚有缺額', value: 'available' },
				{ text: '暫無缺額', value: 'unavailable' }
			]
		},
		{
			type: 'select',
			key: 'position',
			label: '職位',
			placeholder: '選擇職位',
			width: 'half',
			options: [
				{ text: '全部職位', value: 'all' },
				{ text: '發牌員', value: 'dealer' },
				{ text: '百家樂荷官', value: 'baccarat' },
				{ text: '桌邊荷官', value: 'table' }
			]
		},
		{
			type: 'date',
			key: 'date',
			label: '工作日期',
			placeholder: '選擇日期',
			width: 'half'
		},
		{
			type: 'select',
			key: 'sortBy',
			label: '排序',
			placeholder: '選擇排序方式',
			width: 'half',
			options: [
				{ text: '最新到最舊', value: 'newest' },
				{ text: '最舊到最新', value: 'oldest' },
				{ text: '時薪高到低', value: 'wage_high' },
				{ text: '時薪低到高', value: 'wage_low' }
			]
		}
	],
	values: {
		search: '',
		status: 'all',
		position: 'all',
		date: '',
		sortBy: 'newest'
	}
});

const calculateStatusCounts = () => {
	const counts = {
		all: timesheets.value.length,
		pending: 0,
		approved: 0,
		rejected: 0,
		adjusted: 0
	};

	timesheets.value.forEach(timesheet => {
		switch (timesheet.status) {
			case 'pending':
				counts.pending++;
				break;
			case 'approved':
				counts.approved++;
				break;
			case 'rejected':
				counts.rejected++;
				break;
			case 'adjusted':
				counts.adjusted++;
				break;
		}
	});

	statusCounts.value = counts;
};

const handleStatusFilter = (status: string) => {
	selectedStatus.value = status;
};

const filteredTimesheets = computed(() => {
	if (selectedStatus.value === 'all') {
		return timesheets.value;
	}
	return timesheets.value.filter(timesheet => timesheet.status === selectedStatus.value);
});

const handleFilterChange = (key: string, value: string | number) => {
	filterConfig.value = {
		...filterConfig.value,
		values: {
			...filterConfig.value.values,
			[key]: value
		}
	};
};

const handleSearch = (value: string) => {
	console.log('搜尋:', value);
};

const handleToggleFilter = () => {
	console.log('切換篩選選單');
};

const handleReset = () => {
	filterConfig.value.values = {
		search: '',
		status: 'all'
	};
	selectedStatus.value = 'all';
};

const handleApprove = async (timesheetId: string, auditNote?: string) => {
	const confirmed = await showConfirm({
		title: '確認通過',
		message: '確定要通過此工時記錄嗎？'
	});

	if (confirmed) {
		const timesheet = timesheets.value.find(t => t.id === timesheetId);
		if (timesheet) {
			timesheet.status = 'approved';
			if (auditNote) {
				timesheet.auditNote = auditNote;
			}
			await showSuccess('工時記錄已通過');
			calculateStatusCounts();
		}
	}
};

const handleAdjust = async (timesheetId: string, adjustedHours: number, auditNote?: string) => {
	const confirmed = await showConfirm({
		title: '確認調整',
		message: `確定要將時數調整為 ${adjustedHours} 小時嗎？`
	});

	if (confirmed) {
		const timesheet = timesheets.value.find(t => t.id === timesheetId);
		if (timesheet) {
			timesheet.status = 'adjusted';
			timesheet.declaredHours = adjustedHours;
			if (auditNote) {
				timesheet.auditNote = auditNote;
			}
			await showSuccess('時數已調整');
			calculateStatusCounts();
		}
	}
};

const handleReject = async (timesheetId: string, auditNote?: string) => {
	const confirmed = await showDangerConfirm(
		'確定要駁回此工時記錄嗎？',
		'確認駁回'
	);

	if (confirmed) {
		const timesheet = timesheets.value.find(t => t.id === timesheetId);
		if (timesheet) {
			timesheet.status = 'rejected';
			if (auditNote) {
				timesheet.auditNote = auditNote;
			}
			await showSuccess('工時記錄已駁回');
			calculateStatusCounts();
		}
	}
};

onMounted(() => {
	calculateStatusCounts();
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.employer-applicants {
	background: $color-bg-primary;
	min-height: 100vh;

	.content-container {
		padding: $spacing-16;
	}

	// 狀態篩選按鈕樣式
	.status-filter-buttons {
		display: flex;
		gap: $spacing-8;
		margin-bottom: $spacing-12;
		overflow-x: auto;

		&::-webkit-scrollbar {
			display: none;
		}

		.status-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: $spacing-4 $spacing-8;
			border-radius: $border-radius-md;
			border: 1px solid $color-gray-300;
			background: $color-white;
			color: $color-gray-700;
			font-size: $font-size-xs;
			font-weight: $font-weight-medium;
			line-height: 1;
			white-space: nowrap;
			cursor: pointer;

			&.active {
				background: $color-primary;
				border-color: $color-primary;
				color: $color-white;

				.count-badge {
					color: $color-white;
				}
			}

			.count-badge {
				color: $color-gray-600;
				padding: $spacing-4;
				border-radius: $border-radius-sm;
				font-size: $font-size-xs;
				font-weight: $font-weight-semibold;
			}

			// 不同狀態的顏色
			&--draft {
				&.active {
					background: $color-gray-600;
					border-color: $color-gray-600;
				}
			}

			&--open {
				&.active {
					background: $color-green-600;
					border-color: $color-green-600;
				}
			}

			&--full {
				&.active {
					background: $color-orange-600;
					border-color: $color-orange-600;
				}
			}

			&--closed {
				&.active {
					background: $color-red-600;
					border-color: $color-red-600;
				}
			}
		}
	}

	.applicants-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-8;
		width: 100%;
	}
}

@media (min-width: 768px) {
	.employer-applicants {
		.content-container {
			padding: $spacing-20;
		}

		.applicants-list {
			gap: $spacing-12;
		}
	}
}
</style>