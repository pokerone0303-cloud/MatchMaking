<template>
  <div class="layout">
    <div class="content">
      <RouterView />
    </div>
    <!-- 非公用才顯示底部導航和側邊欄 -->
    <template v-if="currentRole !== 'public'">
      <!-- 底部導航 -->
      <BottomNav :role="currentRole" @open-slide-nav="handleOpenSlideNav" />
      <!-- 側邊欄 -->
      <SlideNav v-model:show="showSlideNav" :role="currentRole" @close="handleCloseSlideNav" />
    </template>
    <!-- 回到頂部懸浮按鈕 -->
    <BackToTop />

  </div>
</template>

<script setup lang="ts">
import BottomNav from '@/components/BottomNav/index.vue';
import SlideNav from '@/components/SlideNav/index.vue';
import BackToTop from '@/components/common/BackToTop.vue';
import { computed, ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';

// 側邊欄狀態
const showSlideNav = ref(false);

// 根據路由判斷當前角色
const route = useRoute();
const currentRole = computed(() => {
  const path = route.path;
  if (path.startsWith('/u/')) return 'user';
  if (path.startsWith('/e/')) return 'employer';
  if (path.startsWith('/a/')) return 'admin';
  return 'public'; // 預設為用戶端
});

// 處理側邊欄開啟
const handleOpenSlideNav = () => {
  showSlideNav.value = true;
};

// 處理側邊欄關閉
const handleCloseSlideNav = () => {
  showSlideNav.value = false;
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.layout {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100dvh;
  width: 100dvw;
  position: relative;
  background: $color-gray-50;
}

.content {
  position: relative;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

// 確保側邊欄在最上層
:deep(.van-popup) {
  z-index: $z-index-modal;
}
</style>
