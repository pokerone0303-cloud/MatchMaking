<script setup lang="ts">
import { ref } from 'vue';
import ProfileCard from '@/components/cards/ProfileCard.vue';
import TimesheetListCard from '@/components/cards/TimesheetListCard.vue';
import type { TimesheetRecord } from '@/types/timesheet';

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
const timesheetRecords = ref([
	{
		id: '1',
		date: '2024-08-30',
		startTime: '18:00',
		endTime: '23:00',
		breakDuration: 30,
		location: '豪華賭場',
		address: '台北市信義區',
		shiftId: '#SH240830001',
		workingHours: 4.5,
		status: 'submitted' as const,
		auditNote: '時數記錄已提交，等待審核'
	},
	{
		id: '2',
		date: '2024-08-29',
		startTime: '14:00',
		endTime: '22:00',
		breakDuration: 60,
		location: '星光娛樂城',
		address: '新北市板橋區',
		shiftId: '#SH240829002',
		workingHours: 7.0,
		status: 'approved' as const,
		auditNote: '時數記錄已核准，無需調整'
	},
	{
		id: '3',
		date: '2024-08-28',
		startTime: '20:00',
		endTime: '02:00',
		breakDuration: 30,
		location: '金沙會館',
		address: '台北市中山區',
		shiftId: '#SH240828003',
		workingHours: 6.0,
		adjustedHours: 5.5,
		originalHours: 6.0,
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
</script>
<template>
	<div class="user-profile">
		<!-- 個人資料卡片元件 -->
		<ProfileCard :user-profile="userProfile" :user-stats="userStats" />

		<!-- 實際上班時數卡片列表元件 -->
		<TimesheetListCard :timesheet-records="timesheetRecords" @view-all="handleViewAllTimesheets"
			@view-details="handleViewTimesheetDetails" />

		<!-- 應徵記錄卡片列表元件 -->
		<div>
			<!-- 區塊標題 -->
			<!-- 水平排序 -->
			<div>
				<!--icon + 標題:應徵記錄 -->
				<div>

				</div>
				<!-- 查看全部按鈕:作用為跳轉到該資料頁面 -->
				<div>

				</div>
			</div>
			<!-- 紀錄篩選TAB列表: 全部，待審，錄取，未錄取，撤回，點擊後即會查詢該狀態的應徵記錄-->
			<div></div>
			<!-- 卡片式列表 v-for -->
			<div>
				<!-- 卡片 -->
				<!-- 標題:應徵工作的日期+時間 --> <!-- 同行右上角定位 審核狀態: 已錄取，已投遞，未錄取 -->
				<!-- 副標:職位 -->
				<!-- 副標:地點名稱+地址 -->
				<!-- 內容:icon + 投遞時間 -->
				<!-- 結果提示訊息: "恭喜!您已被錄取，請準時到場工作"，"很抱歉，您這次未被錄取，請繼續關注其他機會"，如尚未審核，則顯示"撤回應應徵按鈕" -->
				<div>
				</div>
			</div>
		</div>

	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.user-profile {
	padding: $spacing-16;
	background: $color-bg-gray;
	min-height: 100vh;

	// 確保卡片間有適當間距
	>*+* {
		margin-top: $spacing-16;
	}
}
</style>