<template>
	<div class="admin-stores">
		<FilterHeader title="商家管理" :filter-config="filterConfig" :sticky="true" :show-title="false" :show-add-button="true"
			add-button-text="新增" @update-filter="handleFilterChange" @search="handleSearch"
			@toggle-filter="handleToggleFilter" @reset="handleReset" @add="handleAddStore" />

		<div class="content-container">
			<div class="status-filter-buttons">
				<!-- 狀態按鈕 -->
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

			<div class="stores-list">
				<StoresCard v-for="store in filteredStores" :key="store.id" :store="store" @edit="handleEdit"
					@toggle-status="handleToggleStatus" />
			</div>
		</div>

		<!-- 編輯商家對話框 -->
		<EditStoresDialog :show="showEditDialog" :store-data="editingStore" @save="handleSaveStore"
			@cancel="handleCancelEdit" @update:show="showEditDialog = $event" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import StoresCard from '@/components/cards/admin/StoresCard.vue';
import EditStoresDialog from '@/components/dialogs/EditStoresDialog.vue';
import FilterHeader from '@/components/common/FilterHeader.vue';
import { useDialog } from '@/composables/useDialog';
import type { FilterConfig } from '@/types/filter';
import type { Store } from '@/types/store';

defineOptions({
	name: 'AdminStoresView',
});

const { showSuccess } = useDialog();

// 編輯對話框狀態
const showEditDialog = ref(false);
const editingStore = ref<Store | undefined>(undefined);

const stores = ref<Store[]>([
	{
		id: '1',
		name: '豪華賭場',
		code: '#E001',
		manager: '王經理',
		email: 'hr@luxurycasino.com',
		phone: '02-2345-6789',
		address: '台北市信義區信義路五段7號',
		taxId: '12345678',
		locationCount: 2,
		locations: ['台北信義店', '台北中山店'],
		publishedShifts: 156,
		successfulHires: 89,
		joinDate: '2023-01-10',
		status: 'active' as const,
		createdAt: '2023-01-10T00:00:00Z',
		updatedAt: '2024-09-15T00:00:00Z',
	},
	{
		id: '2',
		name: '皇家娛樂城',
		code: '#E002',
		manager: '李總監',
		email: 'contact@royalcasino.com',
		phone: '02-3456-7890',
		address: '台北市中山區南京東路二段100號',
		taxId: '87654321',
		locationCount: 3,
		locations: ['台北總店', '新北板橋店', '桃園中壢店'],
		publishedShifts: 203,
		successfulHires: 142,
		joinDate: '2022-11-15',
		status: 'active' as const,
		createdAt: '2022-11-15T00:00:00Z',
		updatedAt: '2024-09-14T00:00:00Z',
	},
	{
		id: '3',
		name: '金典娛樂',
		code: '#E003',
		manager: '陳主任',
		email: 'info@goldenentertainment.com',
		phone: '04-1234-5678',
		address: '台中市西區台灣大道二段285號',
		taxId: '11223344',
		locationCount: 1,
		locations: ['台中旗艦店'],
		publishedShifts: 89,
		successfulHires: 67,
		joinDate: '2023-06-20',
		status: 'inactive' as const,
		createdAt: '2023-06-20T00:00:00Z',
		updatedAt: '2024-09-12T00:00:00Z',
	},
	{
		id: '4',
		name: '南方娛樂',
		code: '#E004',
		manager: '張副總',
		email: 'admin@southernent.com',
		phone: '07-9876-5432',
		address: '高雄市前金區中正四路211號',
		taxId: '55667788',
		locationCount: 2,
		locations: ['高雄總店', '台南分店'],
		publishedShifts: 134,
		successfulHires: 98,
		joinDate: '2023-03-08',
		status: 'suspended' as const,
		createdAt: '2023-03-08T00:00:00Z',
		updatedAt: '2024-09-10T00:00:00Z',
	},
]);

const selectedStatus = ref('all');
const statusOptions = ref([
	{ label: '全部', value: 'all' },
	{ label: '啟用', value: 'active' },
	{ label: '停用', value: 'inactive' },
	{ label: '停權', value: 'suspended' }
]);

const statusCounts = ref<Record<string, number>>({
	all: 0,
	active: 0,
	inactive: 0,
	suspended: 0
});

// 篩選配置
const filterConfig = ref<FilterConfig>({
	fields: [
		{
			type: 'search',
			key: 'search',
			label: '搜尋',
			placeholder: '搜尋商家名稱/編號',
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
				{ text: '啟用', value: 'active' },
				{ text: '停用', value: 'inactive' },
				{ text: '停權', value: 'suspended' }
			]
		},
		{
			type: 'select',
			key: 'location',
			label: '據點',
			placeholder: '選擇據點',
			width: 'half',
			options: [
				{ text: '全部據點', value: 'all' },
				{ text: '台北', value: 'taipei' },
				{ text: '台中', value: 'taichung' },
				{ text: '高雄', value: 'kaohsiung' }
			]
		},
		{
			type: 'date',
			key: 'joinDate',
			label: '加入日期',
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
				{ text: '發布班別多到少', value: 'shifts_high' },
				{ text: '發布班別少到多', value: 'shifts_low' }
			]
		}
	],
	values: {
		search: '',
		status: 'all',
		location: 'all',
		joinDate: '',
		sortBy: 'newest'
	}
});

const calculateStatusCounts = () => {
	const counts = {
		all: stores.value.length,
		active: 0,
		inactive: 0,
		suspended: 0
	};

	stores.value.forEach(store => {
		switch (store.status) {
			case 'active':
				counts.active++;
				break;
			case 'inactive':
				counts.inactive++;
				break;
			case 'suspended':
				counts.suspended++;
				break;
		}
	});

	statusCounts.value = counts;
};

const handleStatusFilter = (status: string) => {
	selectedStatus.value = status;
};

const filteredStores = computed(() => {
	if (selectedStatus.value === 'all') {
		return stores.value;
	}
	return stores.value.filter(store => store.status === selectedStatus.value);
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
		status: 'all',
		location: 'all',
		joinDate: '',
		sortBy: 'newest'
	};
	selectedStatus.value = 'all';
};

const handleAddStore = () => {
	// 新增模式：清空編輯商家數據
	editingStore.value = undefined;
	showEditDialog.value = true;
};

const handleEdit = (storeId: string) => {
	const store = stores.value.find(s => s.id === storeId);
	if (store) {
		editingStore.value = { ...store };
		showEditDialog.value = true;
	}
};

const handleSaveStore = (storeData: Partial<Store>) => {
	if (editingStore.value) {
		// 編輯模式
		const index = stores.value.findIndex(s => s.id === editingStore.value!.id);
		if (index > -1) {
			stores.value[index] = { ...stores.value[index], ...storeData };
			showSuccess('商家資料已更新');
		}
	} else {
		// 新增模式
		const newStore: Store = {
			id: Date.now().toString(),
			name: storeData.name || '',
			code: storeData.code || '',
			manager: storeData.manager || '',
			email: storeData.email || '',
			phone: storeData.phone || '',
			address: storeData.address || '',
			taxId: storeData.taxId || '',
			locationCount: storeData.locations?.length || 0,
			locations: storeData.locations || [],
			publishedShifts: 0,
			successfulHires: 0,
			joinDate: new Date().toISOString().split('T')[0],
			status: (storeData.status as 'active' | 'inactive' | 'suspended') || 'active',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		stores.value.unshift(newStore);
		showSuccess('新商家已新增');
	}
	calculateStatusCounts();
};

const handleCancelEdit = () => {
	editingStore.value = undefined;
	showEditDialog.value = false;
};

const handleToggleStatus = async (storeId: string) => {
	const store = stores.value.find(s => s.id === storeId);
	if (!store) return;

	const isActive = store.status === 'active';
	const action = isActive ? '停用' : '啟用';

	// 直接更新狀態（確認對話框已在子組件中處理）
	store.status = isActive ? 'inactive' : 'active';
	await showSuccess(`已${action}商家`);
	calculateStatusCounts();
};

onMounted(() => {
	calculateStatusCounts();
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.admin-stores {
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
			&--active {
				&.active {
					background: $color-green-600;
					border-color: $color-green-600;
				}
			}

			&--inactive {
				&.active {
					background: $color-gray-600;
					border-color: $color-gray-600;
				}
			}

			&--suspended {
				&.active {
					background: $color-red-600;
					border-color: $color-red-600;
				}
			}
		}
	}

	.stores-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-8;
		width: 100%;
	}
}

@media (min-width: 768px) {
	.admin-stores {
		.content-container {
			padding: $spacing-20;
		}

		.stores-list {
			gap: $spacing-12;
		}
	}
}
</style>