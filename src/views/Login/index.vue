<script setup lang="ts">
import { showToast } from 'vant';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
	name: 'LoginView',
});

// 響應式數據
const activeRole = ref('user');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);

const router = useRouter();

// 角色選項
const roleOptions = [
	{
		key: 'user',
		label: '荷官端',
		icon: 'user-o',
	},
	{
		key: 'employer',
		label: '商家端',
		icon: 'shop-o',
	},
	{
		key: 'admin',
		label: '管理端',
		icon: 'shield-o',
	}
];


// 登入按鈕文字
const loginButtonText = computed(() => {
	const role = roleOptions.find(r => r.key === activeRole.value);
	return `登入${role?.label}`;
});

// 表單驗證
const validateForm = () => {
	if (!email.value) {
		showToast('請輸入您的電子信箱');
		return false;
	}

	if (!password.value) {
		showToast('請輸入您的密碼');
		return false;
	}

	// 簡單的電子信箱格式驗證
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email.value)) {
		showToast('請輸入正確的電子信箱格式');
		return false;
	}

	return true;
};

// 登入處理
const handleLogin = async () => {
	if (!validateForm()) return;

	isLoading.value = true;

	try {
		// 模擬登入 API 調用
		await new Promise(resolve => setTimeout(resolve, 1000));

		// 根據角色跳轉到對應頁面
		switch (activeRole.value) {
			case 'user':
				router.push('/u/shifts');
				break;
			case 'employer':
				router.push('/e/shifts');
				break;
			case 'admin':
				router.push('/a/audit');
				break;
			default:
				router.push('/');
		}

		showToast('登入成功');
	} catch {
		showToast('登入失敗，請稍後再試');
	} finally {
		isLoading.value = false;
	}
};

// 切換密碼顯示
const togglePasswordVisibility = () => {
	showPassword.value = !showPassword.value;
};

// 處理幫助中心
const handleHelp = () => {
	router.push('/help');
	// 這裡可以添加跳轉到幫助中心的邏輯
};

// 處理聯絡客服
const handleContact = () => {
	showToast('跳轉到聯絡客服');
	// 這裡可以添加跳轉到聯絡客服的邏輯
};
</script>

<template>
	<div class="page-container login-container">
		<!-- 登入卡片 -->
		<div class="login-card">
			<!-- 標題區域 -->
			<div class="login-header">
				<div class="login-icon">
					<van-icon name="user-circle-o" size="60" color="#155dfc" />
				</div>
				<h1 class="login-title">歡迎登入</h1>
				<p class="login-subtitle">選擇您的身份類型並登入系統</p>
			</div>

			<!-- 身份選擇標籤 -->
			<div class="role-tabs">
				<div v-for="role in roleOptions" :key="role.key" :class="['role-tab', { active: activeRole === role.key }]"
					@click="activeRole = role.key">
					<van-icon :name="role.icon" size="20" :class="`role-icon role-icon--${role.key}`" />
					<span>{{ role.label }}</span>
				</div>
			</div>


			<!-- 登入表單 -->
			<van-form @submit="handleLogin" class="login-form">
				<van-field v-model="email" name="email" label="電子信箱" placeholder="請輸入您的電子信箱" type="email"
					:rules="[{ required: true, message: '請輸入電子信箱' }]" class="login-field" label-align="top" />

				<van-field v-model="password" name="password" label="密碼" :placeholder="`請輸入您的密碼`"
					:type="showPassword ? 'text' : 'password'" :rules="[{ required: true, message: '請輸入密碼' }]" class="login-field"
					label-align="top" @keyup.enter="handleLogin">
					<template #right-icon>
						<van-icon :name="showPassword ? 'eye-o' : 'closed-eye'" @click="togglePasswordVisibility"
							class="password-toggle" />
					</template>
				</van-field>

				<!-- 登入按鈕 -->
				<van-button type="primary" size="large" :loading="isLoading" loading-text="登入中..." @click="handleLogin"
					class="login-button">
					{{ loginButtonText }}
				</van-button>
			</van-form>

			<!-- 幫助與聯絡 -->
			<div class="help-section">
				<van-button type="default" size="small" class="help-button" @click="handleHelp">
					<van-icon name="question-o" size="16" />
					幫助中心
				</van-button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.login-card {
	position: relative;
	z-index: 2;
	background: $color-white;
	border-radius: $border-radius-xl;
	padding: $spacing-base;
	width: 100%;
	max-width: 400px;
	box-shadow: $shadow-xl;
	border: 1px solid $color-gray-2;
}

.login-header {
	text-align: center;
	margin-bottom: $spacing-lg;
}

.login-icon {
	margin-bottom: $spacing-base;
}

.login-title {
	font-size: $font-size-xl;
	color: $color-text-primary;
	margin: 0 0 $spacing-sm 0;
}

.login-subtitle {
	font-size: $font-size-sm;
	color: $color-text-secondary;
	margin: 0;
}

.role-tabs {
	display: flex;
	background: $color-gray-2;
	border-radius: $border-radius-base;
	padding: $spacing-xs;
	margin-bottom: $spacing-base;
}

.role-tab {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: $spacing-sm;
	border-radius: $border-radius-sm;
	cursor: pointer;
	transition: all 0.3s ease;
	color: $color-text-secondary;
	font-size: $font-size-xs;

	&.active {
		background: $color-white;
		color: $color-primary;
		box-shadow: $shadow-sm;
	}

	span {
		margin-top: $spacing-xs;
	}
}

// 角色圖標顏色
.role-icon {
	&--user {
		color: $color-blue-1;
	}

	&--employer {
		color: $color-green-1;
	}

	&--admin {
		color: $color-purple;
	}
}


.login-form {
	margin-bottom: $spacing-lg;
}

.login-field {
	margin-bottom: $spacing-sm;

	:deep(.van-field__label) {
		color: $color-text-primary;
		font-weight: 500;
		font-size: $font-size-sm;
		margin-bottom: $spacing-xs;
	}

	:deep(.van-field__control) {
		color: $color-text-primary;
		font-size: $font-size-base;
	}

	:deep(.van-field__body) {
		margin-top: $spacing-xs;
	}
}

.password-toggle {
	cursor: pointer;
	color: $color-text-secondary;

	&:hover {
		color: $color-primary;
	}
}

.login-button {
	width: 100%;
	height: 48px;
	font-size: $font-size-base;
	font-weight: 600;
	border-radius: $border-radius-base;
	margin-top: $spacing-base;
}

.help-section {
	display: flex;
	justify-content: space-between;
	gap: $spacing-sm;
	padding: $spacing-base;
	border-top: 1px solid $color-gray-2;
}

.help-button {
	flex: 1;
	height: 36px;
	font-size: $font-size-xs;
	border-radius: $border-radius-sm;

	:deep(.van-icon) {
		margin-right: $spacing-xs;
	}
}

// 響應式設計
@media (max-width: 480px) {
	.login-container {
		padding: $spacing-sm;
	}

	.login-card {
		padding: $spacing-lg;
	}

	.login-title {
		font-size: $font-size-xl;
	}
}
</style>
