<script setup lang="ts">
import { ref } from 'vue';
import EmployerProfileCard from '@/components/cards/EmployerProfileCard.vue';
import EmployerStatsCard from '@/components/cards/EmployerStatsCard.vue';
import ContactInfoCard from '@/components/cards/ContactInfoCard.vue';
import StoreListCard from '@/components/cards/StoreListCard.vue';

defineOptions({
	name: 'EmployerProfile',
});

// 模擬商家資料數據
const employerProfile = ref({
	id: '1',
	companyName: '豪華賭場集團',
	logo: '',
	contactPerson: '王經理',
	membershipDate: '2023-01-15',
	isVerified: true
});

// 模擬營運統計數據
const employerStats = ref({
	totalShifts: 156,
	ongoingShifts: 23,
	totalApplicants: 542,
	successfulHires: 89
});

// 模擬聯絡資訊數據
const contactInfo = ref({
	phone: '02-2345-6789',
	email: 'hr@luxurycasino.com',
	address: '台北市信義區信義路五段7號',
	unifiedNumber: '12345678'
});

// 模擬據點清單數據
const storeList = ref([
	{
		id: '1',
		name: '台北信義店',
		address: '台北市信義區信義路五段7號',
		status: 'operating' as const
	},
	{
		id: '2',
		name: '台北中山店',
		address: '台北市中山區南京東路二段125號',
		status: 'operating' as const
	},
	{
		id: '3',
		name: '新北板橋店',
		address: '新北市板橋區中山路一段168號',
		status: 'paused' as const
	}
]);

// 處理查看完整統計
const handleViewStats = () => {
	console.log('導航到營運統計頁面');
	// 可以在這裡添加路由導航
};

// 處理查看完整據點清單
const handleViewAllStores = () => {
	console.log('導航到據點清單頁面');
	// 可以在這裡添加路由導航
};
</script>
<template>
	<div class="employer-profile">
		<!-- 商家資料卡片元件 -->
		<EmployerProfileCard :employer-profile="employerProfile" />

		<!-- 營運統計卡片元件 -->
		<EmployerStatsCard :employer-stats="employerStats" @view-stats="handleViewStats" />

		<!-- 聯絡資訊卡片元件 -->
		<ContactInfoCard :contact-info="contactInfo" />

		<!-- 據點清單卡片元件 -->
		<StoreListCard :store-list="storeList" @view-all-stores="handleViewAllStores" />
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.employer-profile {
	padding: $spacing-16 $spacing-8;
	background: $color-bg-gray;
	min-height: 100vh;

	// 確保卡片間有適當間距
	>*+* {
		margin-top: $spacing-16;
	}
}
</style>