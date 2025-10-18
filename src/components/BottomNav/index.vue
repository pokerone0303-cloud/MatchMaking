<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
	name: 'BottomNav',
});

// Props
interface Props {
	role?: 'user' | 'employer' | 'admin';
}

const props = withDefaults(defineProps<Props>(), {
	role: 'user'
});

// Emits
const emit = defineEmits<{
	openSlideNav: [];
}>();

const router = useRouter();
const route = useRoute();

// 導航項目類型定義
interface NavItem {
	key: string;
	label: string;
	icon: string;
	route?: string;
	action?: string;
}

// 導航配置
const navConfigs: Record<string, NavItem[]> = {
	user: [
		{
			key: 'shifts',
			label: '班表',
			icon: 'calendar-o',
			route: '/u/shifts'
		},
		{
			key: 'profile',
			label: '個人資料',
			icon: 'user-o',
			route: '/u/profile'
		},
		{
			key: 'menu',
			label: '選單',
			icon: 'ellipsis',
			action: 'openSlideNav'
		}
	],
	employer: [
		{
			key: 'shifts',
			label: '班別',
			icon: 'calendar-o',
			route: '/e/shifts'
		},
		{
			key: 'create',
			label: '建立',
			icon: 'plus',
			route: '/e/create'
		},
		{
			key: 'applicants',
			label: '名單',
			icon: 'friends-o',
			route: '/e/applicants'
		},
		{
			key: 'profile',
			label: '商家資料',
			icon: 'user-o',
			route: '/e/profile'
		},
		{
			key: 'menu',
			label: '選單',
			icon: 'ellipsis',
			action: 'openSlideNav'
		}
	],
	admin: [
		{
			key: 'audit',
			label: '審核',
			icon: 'checked',
			route: '/a/audit'
		},
		{
			key: 'users',
			label: '用戶',
			icon: 'friends-o',
			route: '/a/users'
		},
		{
			key: 'stores',
			label: '商家',
			icon: 'shop-o',
			route: '/a/stores'
		},
		{
			key: 'shifts',
			label: '班別',
			icon: 'calendar-o',
			route: '/a/shifts'
		},
		{
			key: 'reports',
			label: '報表',
			icon: 'bar-chart-o',
			route: '/a/reports'
		},
		{
			key: 'menu',
			label: '選單',
			icon: 'ellipsis',
			action: 'openSlideNav'
		}
	]
};

// 當前角色的導航配置
const currentNavConfig = computed(() => navConfigs[props.role]);

// 處理導航點擊
const handleNavClick = (item: NavItem) => {
	if (item.action === 'openSlideNav') {
		emit('openSlideNav');
	} else if (item.route) {
		router.push(item.route);
	}
};

// 判斷是否為當前頁面
const isActive = (item: NavItem) => {
	if (item.action) return false;
	return item.route ? route.path.startsWith(item.route) : false;
};
</script>

<template>
	<div class="bottom-nav-container">
		<van-tabbar :fixed="false" :placeholder="true" :safe-area-inset-bottom="true" class="bottom-nav">
			<van-tabbar-item v-for="item in currentNavConfig" :key="item.key" :icon="item.icon"
				:class="{ 'nav-item--active': isActive(item) }" @click="handleNavClick(item)">
				{{ item.label }}
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<style lang="scss" scoped>
.bottom-nav-container {
	position: relative;
	z-index: $z-index-base;
}

.bottom-nav {
	background: $color-white;
	border-top: 1px solid $color-gray-2;
	box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);

	:deep(.van-tabbar-item) {
		color: $color-text-secondary;
		font-size: $font-size-xs;
		transition: all 0.3s ease;

		.van-icon {
			font-size: 20px;
			margin-bottom: 2px;
			transition: color 0.3s ease;
		}

		&:hover {
			color: $color-primary;

			.van-icon {
				color: $color-primary;
			}
		}
	}

	.nav-item--active {
		color: $color-primary;

		.van-icon {
			color: $color-primary;
		}
	}
}

// 確保在桌機上也顯示行動裝置樣式
@media (min-width: 1024px) {
	.bottom-nav-container {
		// max-width: 375px; // 限制最大寬度為行動裝置尺寸
		margin: 0 auto;
		// position: fixed;
		// bottom: 0;
		// left: 50%;
		// transform: translateX(-50%);
		width: 100%;
	}
}

// 平板尺寸調整
@media (min-width: 768px) and (max-width: 1023px) {
	.bottom-nav-container {
		max-width: 100%;
	}
}

// 行動裝置優化
@media (max-width: 767px) {
	.bottom-nav {
		:deep(.van-tabbar-item) {
			font-size: $font-size-xs;
			padding: 4px 0;
		}
	}
}

// 確保導航列始終在底部
.bottom-nav-container {
	// position: fixed;
	// bottom: 0;
	// left: 0;
	// right: 0;
	// z-index: $z-index-fixed;
}

// 為內容區域提供底部間距
:global(.page-content) {
	padding-bottom: 60px; // 為底部導航留出空間
}
</style>
