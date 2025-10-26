<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { scrollToTop as scrollToTopUtil } from '@/utils/scroll';

defineOptions({
	name: 'BackToTop',
});

// 按鈕顯示狀態
const isVisible = ref(true); // 臨時設為 true 用於調試

// 滾動到頂部的函數
const scrollToTop = () => {
	scrollToTopUtil();
};

// 監聽滾動事件
const handleScroll = () => {
	// 檢查 window 和 content 容器的滾動位置
	const windowScrollY = window.scrollY;
	const contentElement = document.querySelector('.content');
	const contentScrollTop = contentElement ? contentElement.scrollTop : 0;

	// 使用較大的滾動值
	const scrollY = Math.max(windowScrollY, contentScrollTop);
	isVisible.value = scrollY > 10;
};

// 生命週期
onMounted(() => {
	// 監聽 window 滾動
	window.addEventListener('scroll', handleScroll);

	// 監聽 content 容器滾動
	const contentElement = document.querySelector('.content');
	if (contentElement) {
		contentElement.addEventListener('scroll', handleScroll);
	}
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);

	const contentElement = document.querySelector('.content');
	if (contentElement) {
		contentElement.removeEventListener('scroll', handleScroll);
	}
});
</script>

<template>
	<Transition name="fade">
		<div v-show="isVisible" class="back-to-top" @click="scrollToTop">
			<van-icon name="arrow-up" />
		</div>
	</Transition>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.back-to-top {
	position: fixed;
	right: $spacing-16;
	bottom: 10dvh;
	width: 32px;
	height: 32px;
	background: $color-primary;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: $shadow-lg;
	cursor: pointer;
	z-index: 99;
	transition: all 0.3s ease;

	&:hover {
		background: $color-primary-dark;
		transform: translateY(-2px);
		box-shadow: $shadow-xl;
	}

	&:active {
		transform: translateY(0);
	}

	.van-icon {
		color: $color-white;
		font-size: 20px;
	}
}

// 淡入淡出動畫
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(20px);
}

// 響應式設計
@media (min-width: 768px) {
	.back-to-top {
		right: $spacing-24;
		width: 48px;
		height: 48px;

		.van-icon {
			font-size: 20px;
		}
	}
}

// 確保在移動端有足夠的觸控區域
@media (max-width: 767px) {
	.back-to-top {
		width: 32px;
		height: 32px;
		right: $spacing-12;
	}
}
</style>
