<script setup lang="ts">
import { ref } from 'vue';
import ProfileCard from '@/components/cards/ProfileCard.vue';
import TimesheetListCard from '@/components/cards/TimesheetListCard.vue';
import ApplicationListCard from '@/components/cards/ApplicationListCard.vue';
import type { TimesheetRecord } from '@/types/timesheet';
import type { ApplicationRecord } from '@/types/application';

defineOptions({
	name: 'UserProfile',
});

// 模擬用戶資料數據
const userProfile = ref({
	id: '1',
	name: '王小明',
	avatar: '',
	rating: 4.8,
	phone: '0912345678',
	email: 'wang@example.com'
});

// 模擬統計數據
const userStats = ref({
	approvedThisMonth: 128,
	pendingHours: 16,
	totalHours: 1250
});

// 模擬時數記錄數據
const timesheetRecords = ref<TimesheetRecord[]>([
	{
		id: '1',
		applicantId: 'USER001',
		applicantName: '王小明',
		position: '桌邊荷官',
		date: '2024-08-30',
		startTime: '18:00',
		endTime: '23:00',
		declaredHours: 4.5,
		breakDuration: 30,
		location: '豪華賭場',
		address: '台北市信義區',
		shiftId: '#SH240830001',
		workingHours: 4.5,
		submittedAt: '2024-08-31T10:00:00',
		phone: '0912345678',
		email: 'wang@example.com',
		status: 'submitted' as const,
		auditNote: '時數記錄已提交，等待審核'
	},
	{
		id: '2',
		applicantId: 'USER001',
		applicantName: '王小明',
		position: '發牌員',
		date: '2024-08-29',
		startTime: '14:00',
		endTime: '22:00',
		declaredHours: 7.0,
		breakDuration: 60,
		location: '星光娛樂城',
		address: '新北市板橋區',
		shiftId: '#SH240829002',
		workingHours: 7.0,
		submittedAt: '2024-08-30T09:00:00',
		phone: '0912345678',
		email: 'wang@example.com',
		status: 'approved' as const,
		auditNote: '時數記錄已核准，無需調整'
	},
	{
		id: '3',
		applicantId: 'USER001',
		applicantName: '王小明',
		position: '百家樂荷官',
		date: '2024-08-28',
		startTime: '20:00',
		endTime: '02:00',
		declaredHours: 6.0,
		breakDuration: 30,
		location: '金沙會館',
		address: '台北市中山區',
		shiftId: '#SH240828003',
		workingHours: 6.0,
		adjustedHours: 5.5,
		originalHours: 6.0,
		submittedAt: '2024-08-29T11:00:00',
		phone: '0912345678',
		email: 'wang@example.com',
		status: 'adjusted' as const,
		auditNote: '因遲到15分鐘，調整時數為5.5小時'
	}
]);

// 處理查看全部時數記錄
const handleViewAllTimesheets = () => {
	console.log('導航到時數記錄頁面');
	// 可以在這裡添加路由導航
};

// 處理查看時數詳情
const handleViewTimesheetDetails = (record: TimesheetRecord) => {
	console.log('查看時數詳情:', record);
	// 可以在這裡添加詳情彈窗或導航
};

// 模擬應徵記錄數據
const applicationRecords = ref<ApplicationRecord[]>([
	{
		id: '1',
		date: '2024-09-01',
		startTime: '18:00',
		endTime: '23:00',
		position: '桌邊荷官',
		location: '豪華賭場',
		address: '台北市信義區',
		appliedAt: '2024-08-30T15:30:00',
		status: 'accepted',
		resultMessage: '恭喜!您已被錄取，請準時到場工作。'
	},
	{
		id: '2',
		date: '2024-08-31',
		startTime: '14:00',
		endTime: '22:00',
		position: '發牌員',
		location: '星光娛樂城',
		address: '新北市板橋區',
		appliedAt: '2024-08-30T12:15:00',
		status: 'pending'
	},
	{
		id: '3',
		date: '2024-08-30',
		startTime: '20:00',
		endTime: '02:00',
		position: '百家樂荷官',
		location: '金沙會館',
		address: '台北市中山區',
		appliedAt: '2024-08-29T16:45:00',
		status: 'rejected',
		resultMessage: '很遺憾，這次未能錄取，請繼續關注其他機會。'
	}
]);

// 處理查看全部應徵記錄
const handleViewAllApplications = () => {
	console.log('導航到應徵記錄頁面');
	// 可以在這裡添加路由導航
};

// 處理撤回應徵
const handleWithdrawApplication = (record: ApplicationRecord) => {
	console.log('撤回應徵:', record);
	// 可以在這裡添加撤回應徵的邏輯
};
</script>
<template>
	<div class="user-profile">
		<!-- 個人資料卡片元件 -->
		<ProfileCard :user-profile="userProfile" :user-stats="userStats" />

		<!-- 實際上班時數卡片列表元件 -->
		<TimesheetListCard :timesheet-records="timesheetRecords" @view-all="handleViewAllTimesheets"
			@view-details="handleViewTimesheetDetails" />

		<!-- 應徵記錄卡片列表元件 -->
		<ApplicationListCard :application-records="applicationRecords" @view-all="handleViewAllApplications"
			@withdraw-application="handleWithdrawApplication" />

	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.user-profile {
	padding: $spacing-16 $spacing-8;
	background: $color-bg-gray;
	min-height: 100vh;

	// 確保卡片間有適當間距
	>*+* {
		margin-top: $spacing-16;
	}
}
</style>