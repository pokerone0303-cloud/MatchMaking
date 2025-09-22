<script setup lang="ts">
import BottomNav from '@/components/BottomNav/index.vue';
import SlideNav from '@/components/SlideNav/index.vue';
import { ref } from 'vue';

defineOptions({
	name: 'TestSlideNav',
});

const currentRole = ref<'user' | 'employer' | 'admin'>('user');
const showSlideNav = ref(false);

const handleOpenSlideNav = () => {
	showSlideNav.value = true;
};

const handleCloseSlideNav = () => {
	showSlideNav.value = false;
};
</script>

<template>
	<div class="test-page">
		<div class="page-content">
			<!-- 頁面標題 -->
			<van-nav-bar title="側邊選單測試" fixed />

			<!-- 角色切換 -->
			<div class="role-switcher">
				<div class="role-buttons">
					<button :class="['role-btn', { active: currentRole === 'user' }]" @click="currentRole = 'user'">
						用戶端
					</button>
					<button :class="['role-btn', { active: currentRole === 'employer' }]" @click="currentRole = 'employer'">
						商家端
					</button>
					<button :class="['role-btn', { active: currentRole === 'admin' }]" @click="currentRole = 'admin'">
						管理端
					</button>
				</div>
			</div>

			<!-- 內容區域 -->
			<div class="content-area">
				<van-cell-group>
					<van-cell title="當前角色" :value="currentRole" />
					<van-cell title="側邊選單功能" value="點擊底部導航的選單按鈕測試" />
				</van-cell-group>

				<div class="demo-content">
					<h3>側邊選單功能說明：</h3>
					<ul>
						<li>從右側滑入動畫</li>
						<li>根據角色顯示不同選單內容</li>
						<li>主要功能、工作管理、支援服務區塊</li>
						<li>登出確認對話框</li>
						<li>響應式設計，適配各種螢幕</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 底部導航 -->
		<BottomNav :role="currentRole" @open-slide-nav="handleOpenSlideNav" />

		<!-- 側邊選單 -->
		<SlideNav v-model:show="showSlideNav" :role="currentRole" @close="handleCloseSlideNav" />
	</div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.test-page {
	min-height: 100vh;
	background: $color-bg-secondary;
}

.page-content {
	padding-bottom: 80px; // 為底部導航留出空間
}

.role-switcher {
	background: $color-white;
	margin-top: 46px; // 為固定導航欄留出空間
	padding: $spacing-base;
}

.role-buttons {
	display: flex;
	gap: $spacing-sm;
}

.role-btn {
	flex: 1;
	padding: $spacing-sm $spacing-base;
	border: 1px solid $color-gray-2;
	background: $color-white;
	color: $color-text-secondary;
	border-radius: $border-radius-base;
	font-size: $font-size-sm;
	transition: all 0.3s ease;
	cursor: pointer;

	&.active {
		background: $color-primary;
		color: $color-white;
		border-color: $color-primary;
	}

	&:hover {
		border-color: $color-primary;
		color: $color-primary;
	}
}

.content-area {
	padding: $spacing-base;
}

.demo-content {
	margin-top: $spacing-base;
	padding: $spacing-base;
	background: $color-white;
	border-radius: $border-radius-base;

	h3 {
		margin: 0 0 $spacing-base 0;
		color: $color-text-primary;
	}

	ul {
		margin: 0;
		padding-left: $spacing-lg;

		li {
			margin-bottom: $spacing-sm;
			color: $color-text-secondary;
		}
	}
}
</style>
