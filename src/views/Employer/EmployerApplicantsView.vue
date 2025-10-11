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
				<ApplicantCard v-for="applicant in filteredApplicants" :key="applicant.id" :applicant="applicant"
					@accept="handleAccept" @reject="handleReject" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ApplicantCard from '@/components/cards/ApplicantCard.vue';
import FilterHeader from '@/components/common/FilterHeader.vue';
import { useDialog } from '@/composables/useDialog';
import type { FilterConfig } from '@/types/filter';
import type { Applicant } from '@/types/application';

defineOptions({
	name: 'EmployerApplicantsView',
});

const { showAlert, showConfirm, showSuccess, showError, showDangerConfirm } = useDialog();

const applicants = ref<Applicant[]>([
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
		phone: '0912-345-678',
		email: 'ming@example.com',
		applicationTime: '2024-09-10 15:30',
		status: 'pending' as const,
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
		phone: '0987-654-321',
		email: 'hua@example.com',
		applicationTime: '2024-09-10 16:45',
		status: 'accepted' as const,
	},
	{
		id: '3',
		name: '王大偉',
		position: '發牌員',
		shiftDate: '2024-09-16',
		startTime: '14:00',
		endTime: '22:00',
		experience: 2,
		rating: 4.5,
		skills: ['21點', '輪盤'],
		phone: '0923-456-789',
		email: 'david@example.com',
		applicationTime: '2024-09-11 09:20',
		status: 'rejected' as const,
	},
	{
		id: '4',
		name: '陳小芳',
		position: '百家樂荷官',
		shiftDate: '2024-09-15',
		startTime: '20:00',
		endTime: '02:00',
		experience: 4,
		rating: 4.7,
		skills: ['百家樂', '輪盤'],
		phone: '0955-123-456',
		email: 'fang@example.com',
		applicationTime: '2024-09-09 14:15',
		status: 'pending' as const,
	},
]);

const selectedStatus = ref('all');
const statusOptions = ref([
	{ label: '全部', value: 'all' },
	{ label: '待審', value: 'pending' },
	{ label: '已錄取', value: 'accepted' },
	{ label: '已拒絕', value: 'rejected' }
]);

const statusCounts = ref<Record<string, number>>({
	all: 0,
	pending: 0,
	accepted: 0,
	rejected: 0
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
		all: applicants.value.length,
		pending: 0,
		accepted: 0,
		rejected: 0
	};

	applicants.value.forEach(applicant => {
		switch (applicant.status) {
			case 'pending':
				counts.pending++;
				break;
			case 'accepted':
				counts.accepted++;
				break;
			case 'rejected':
				counts.rejected++;
				break;
		}
	});

	statusCounts.value = counts;
};

const handleStatusFilter = (status: string) => {
	selectedStatus.value = status;
};

const filteredApplicants = computed(() => {
	if (selectedStatus.value === 'all') {
		return applicants.value;
	}
	return applicants.value.filter(applicant => applicant.status === selectedStatus.value);
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

const handleAccept = async (applicantId: string) => {
	const confirmed = await showConfirm({
		title: '確認錄取',
		message: '確定要錄取此應徵者嗎？'
	});

	if (confirmed) {
		const applicant = applicants.value.find(a => a.id === applicantId);
		if (applicant) {
			applicant.status = 'accepted';
			await showSuccess('已錄取應徵者');
			calculateStatusCounts();
		}
	}
};

const handleReject = async (applicantId: string) => {
	const confirmed = await showDangerConfirm(
		'確定要拒絕此應徵者嗎？',
		'確認拒絕'
	);

	if (confirmed) {
		const applicant = applicants.value.find(a => a.id === applicantId);
		if (applicant) {
			applicant.status = 'rejected';
			await showSuccess('已拒絕應徵者');
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