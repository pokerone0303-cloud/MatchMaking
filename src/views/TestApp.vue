<script setup lang="ts">
defineOptions({
	name: 'TestApp',
});
</script>

<template>
	<div class="test-app">
		<van-nav-bar title="App.vue 整合測試" fixed />

		<div class="content">
			<van-cell-group>
				<van-cell title="當前頁面" value="TestApp" />
				<van-cell title="底部導航" value="已整合到 App.vue" />
				<van-cell title="側邊欄" value="已整合到 App.vue" />
			</van-cell-group>

			<div class="demo-content">
				<h3>功能測試：</h3>
				<ul>
					<li>點擊底部導航的「選單」按鈕開啟側邊欄</li>
					<li>側邊欄會根據當前路由自動判斷角色</li>
					<li>選單項目會跳轉到對應頁面</li>
					<li>登出按鈕會顯示確認對話框</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.test-app {
	min-height: 100vh;
	background: $color-bg-secondary;
}

.content {
	padding: 60px $spacing-base $spacing-base; // 為固定導航欄留出空間
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
