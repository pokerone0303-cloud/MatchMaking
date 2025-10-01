<script setup lang="ts">
import { showConfirmDialog, showToast } from 'vant';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
	name: 'SlideNav',
});

// Props
interface Props {
	show: boolean;
	role?: 'user' | 'employer' | 'admin';
}

const props = withDefaults(defineProps<Props>(), {
	show: false,
	role: 'user'
});

// Emits
const emit = defineEmits<{
	'update:show': [value: boolean];
	close: [];
}>();

const router = useRouter();

// 選單配置
const menuConfigs = {
	user: {
		mainFunctions: [
			{
				key: 'shifts',
				title: '班表管理',
				description: '查看並應徵班別',
				icon: 'calendar-o',
				route: '/u/shifts'
			},
			{
				key: 'profile',
				title: '我的資料',
				description: '個人資訊與設定',
				icon: 'user-o',
				route: '/u/profile'
			}
		],
		workManagement: [
			{
				key: 'timesheets',
				title: '工時記錄',
				description: '查看詳細上班時數',
				icon: 'clock-o',
				route: '/u/timesheets'
			},
			{
				key: 'applications',
				title: '應徵紀錄',
				description: '查看詳細應徵歷史',
				icon: 'description',
				route: '/u/applications'
			}
		]
	},
	employer: {
		mainFunctions: [
			{
				key: 'shifts',
				title: '班別管理',
				description: '管理已建立的班別',
				icon: 'calendar-o',
				route: '/e/shifts'
			},
			{
				key: 'create',
				title: '建立班別',
				description: '發布新的工作班別',
				icon: 'plus',
				route: '/e/create'
			},
			{
				key: 'applicants',
				title: '應徵名單',
				description: '管理應徵者名單',
				icon: 'friends-o',
				route: '/e/applicants'
			},
			{
				key: 'profile',
				title: '商家資料',
				description: '商家資訊與設定',
				icon: 'shop-o',
				route: '/e/profile'
			}
		],
		workManagement: [
			{
				key: 'timesheets',
				title: '工時審核',
				description: '審核員工工時記錄',
				icon: 'clock-o',
				route: '/e/timesheets'
			},
			{
				key: 'reports',
				title: '營運報表',
				description: '查看營運統計數據',
				icon: 'bar-chart-o',
				route: '/e/reports'
			}
		]
	},
	admin: {
		mainFunctions: [
			{
				key: 'audit',
				title: '時數審核',
				description: '審核所有用戶工時',
				icon: 'checked',
				route: '/a/audit'
			},
			{
				key: 'users',
				title: '用戶管理',
				description: '管理用戶與商家',
				icon: 'friends-o',
				route: '/a/users'
			},
			{
				key: 'shifts',
				title: '班別管理',
				description: '監控所有班別',
				icon: 'calendar-o',
				route: '/a/shifts'
			},
			{
				key: 'reports',
				title: '系統報表',
				description: '查看系統統計',
				icon: 'bar-chart-o',
				route: '/a/reports'
			}
		],
		workManagement: [
			{
				key: 'system',
				title: '系統設定',
				description: '系統參數與配置',
				icon: 'setting-o',
				route: '/a/settings'
			}
		]
	}
};

// 支援服務選單（所有角色共用）
const supportServices = [
	{
		key: 'help',
		title: '幫助中心',
		description: '使用說明與FAQ',
		icon: 'question-o',
		route: '/help'
	},
	{
		key: 'about',
		title: '關於我們',
		description: '應用程式資訊',
		icon: 'info-o',
		route: '/about'
	}
];

// 當前角色的選單配置
const currentMenuConfig = computed(() => menuConfigs[props.role]);

// 關閉選單
const handleClose = () => {
	emit('update:show', false);
	emit('close');
};

// 選單項目類型定義
interface MenuItem {
	key: string;
	title: string;
	description: string;
	icon: string;
	route?: string;
}

// 處理選單項目點擊
const handleMenuClick = (item: MenuItem) => {
	handleClose();
	if (item.route) {
		router.push(item.route);
	}
};

// 處理登出
const handleLogout = async () => {
	try {
		await showConfirmDialog({
			title: '確認登出',
			message: '您確定要登出嗎？',
			confirmButtonText: '登出',
			cancelButtonText: '取消'
		});

		// 這裡可以添加登出邏輯
		showToast('已登出');
		router.push('/login');
	} catch {
		// 用戶取消登出
	}
};
</script>

<template>
	<van-popup :show="show" position="right" :style="{ width: '250px', height: '100%' }" :close-on-click-overlay="true"
		@close="handleClose" @update:show="(value: boolean) => emit('update:show', value)" class="slide-nav-popup">
		<div class="slide-nav">
			<!-- 標題欄 -->
			<div class="slide-nav-header">
				<h2 class="slide-nav-title">選單</h2>
				<van-icon name="cross" size="20" class="close-icon" @click="handleClose" />
			</div>

			<!-- 選單內容 -->
			<div class="slide-nav-content">
				<!-- 主要功能 -->
				<div class="menu-section">
					<h3 class="section-title">主要功能</h3>
					<van-cell-group>
						<van-cell v-for="item in currentMenuConfig.mainFunctions" :key="item.key" :title="item.title"
							:label="item.description" :icon="item.icon" is-link @click="handleMenuClick(item)" class="menu-item" />
					</van-cell-group>
				</div>

				<!-- 工作管理 -->
				<div class="menu-section">
					<h3 class="section-title">工作管理</h3>
					<van-cell-group>
						<van-cell v-for="item in currentMenuConfig.workManagement" :key="item.key" :title="item.title"
							:label="item.description" :icon="item.icon" is-link @click="handleMenuClick(item)" class="menu-item" />
					</van-cell-group>
				</div>

				<!-- 支援服務 -->
				<div class="menu-section">
					<h3 class="section-title">支援服務</h3>
					<van-cell-group>
						<van-cell v-for="item in supportServices" :key="item.key" :title="item.title" :label="item.description"
							:icon="item.icon" is-link @click="handleMenuClick(item)" class="menu-item" />
					</van-cell-group>
				</div>
			</div>

			<!-- 登出按鈕 -->
			<div class="slide-nav-footer">
				<van-button type="danger" size="small" block icon="logout" @click="handleLogout" class="logout-button">
					登出
				</van-button>
			</div>
		</div>
	</van-popup>
</template>

<style lang="scss" scoped>
.slide-nav-popup {
	:deep(.van-popup) {
		background: $color-white;
	}
}

.slide-nav {
	height: 100%;
	display: flex;
	flex-direction: column;
	background: $color-white;
}

.slide-nav-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: $spacing-base;
	padding-bottom: 0;
	border-bottom: 1px solid $color-gray-2;
	background: $color-white;
	position: sticky;
	top: 0;
	z-index: 10;
}

.slide-nav-title {
	margin: 0;
	font-size: $font-size-lg;
	font-weight: 600;
	color: $color-text-primary;
}

.close-icon {
	cursor: pointer;
	color: $color-text-secondary;
	padding: $spacing-xs;

	&:hover {
		color: $color-primary;
	}
}

.slide-nav-content {
	flex: 1;
	overflow-y: auto;
	padding: $spacing-base;
}

.menu-section {
	margin-bottom: $spacing-lg;
}

.section-title {
	margin: 0 0 $spacing-sm 0;
	font-size: $font-size-sm;
	font-weight: 500;
	color: $color-text-secondary;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.menu-item {
	display: flex;
	align-items: center;

}

::v-deep(.menu-item.van-cell) {
	padding: $spacing-sm 0;

	.van-cell__left-icon {
		--van-cell-icon-size: 18px
	}

	.ane-cell__right-icon {
		--van-cell-icon-size: 16px
	}


	.van-cell__title {
		font-size: $font-size-sm;
		font-weight: 500;
		color: $color-text-primary;
	}

	.van-cell__label {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		margin-top: 0px;
	}

	.van-icon {
		color: $color-text-secondary;
		margin-right: $spacing-sm;
	}

	&:active {
		background: $color-bg-accent;
	}
}

.slide-nav-footer {
	padding: $spacing-base;
	border-top: 1px solid $color-gray-2;
	background: $color-white;
	position: sticky;
	bottom: 0;
}

.logout-button {
	height: 48px;
	font-size: $font-size-base;
	font-weight: 600;
	border-radius: $border-radius-base;

	:deep(.van-icon) {
		margin-right: $spacing-sm;
	}
}

// 響應式設計
@media (max-width: 320px) {
	.slide-nav-popup {
		:deep(.van-popup) {
			width: 100% !important; // 小螢幕使用全寬
		}
	}
}

@media (min-width: 321px) and (max-width: 480px) {
	.slide-nav-popup {
		:deep(.van-popup) {
			width: 250px !important; // 保持 250px 最大寬度
		}
	}
}

// 確保選單在桌機上也保持行動裝置樣式
@media (min-width: 481px) {
	.slide-nav-popup {
		:deep(.van-popup) {
			width: 250px !important; // 統一使用 250px 寬度
		}
	}
}
</style>
