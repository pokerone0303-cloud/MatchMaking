<script setup lang="ts">
import { ref } from 'vue';
import ProfileCard from '@/components/cards/ProfileCard.vue';

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
</script>
<template>
	<div class="user-profile">
		<!-- 個人資料卡片元件 -->
		<ProfileCard :user-profile="userProfile" :user-stats="userStats" />

		<!-- 實際上班時數卡片列表元件 -->
		<div>
			<!-- 區塊標題 -->
			<!-- 水平排序 -->
			<div>
				<!--icon + 標題:實際上班時數 -->
				<div>

				</div>
				<!-- 查看全部按鈕:作用為跳轉到該資料頁面 -->
				<div>

				</div>
			</div>
			<!-- 卡片式列表 v-for -->
			<div>
				<!-- 卡片 -->
				<!-- 標題:日期+時間 --> <!-- 同行右上角定位 審核狀態: 已提交，已核准，已調整 -->
				<!-- 副標:地點名稱+地址 -->
				<!-- 內容:icon + 工作時數 -->
				<!-- 查看詳情按鈕:作用為展開該卡片資料，手風琴效果 -->
				<!-- 展開內容: 標題為審核備註，內容為審核備註內容 -->
				<div>
				</div>
			</div>
		</div>

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