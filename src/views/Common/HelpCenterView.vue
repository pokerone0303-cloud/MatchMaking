<template>
	<div class="help-center">
		<!-- 頁面標題 -->
		<van-nav-bar title="幫助中心" left-arrow @click-left="handleBack" fixed placeholder />

		<div class="help-center__container">
			<!-- 置頂公告 -->
			<div class="help-center__banner">
				<van-icon :name="helpData.banner.icon" class="help-center__banner-icon" />
				<div class="help-center__banner-content">
					<div class="help-center__banner-title">{{ helpData.banner.title }}</div>
					<div class="help-center__banner-text">
						{{ helpData.banner.text }}
					</div>
				</div>
			</div>

			<!-- 常見問題區塊 -->
			<div class="help-center__section">
				<div class="help-center__section-header">
					<van-icon name="question-o" class="help-center__section-icon" />
					<h3 class="help-center__section-title">常見問題</h3>
				</div>

				<van-collapse v-model="activeNames" class="help-center__collapse">
					<van-collapse-item v-for="category in helpData.categories" :key="category.name" :name="category.name"
						:title="category.title">
						<div class="help-center__qa-list">
							<div v-for="(item, index) in category.questions" :key="index" class="help-center__qa-item">
								<div class="help-center__qa-question">{{ item.question }}</div>
								<div class="help-center__qa-answer" v-html="item.answer"></div>
							</div>
						</div>
					</van-collapse-item>
				</van-collapse>
			</div>

			<!-- 聯絡客服區塊 -->
			<div class="help-center__section">
				<div class="help-center__section-header">
					<van-icon name="service-o" class="help-center__section-icon" />
					<h3 class="help-center__section-title">聯絡客服</h3>
				</div>

				<div class="help-center__contact-list">
					<div v-for="method in helpData.contactMethods" :key="method.id" class="help-center__contact-item"
						@click="handleContact(method)">
						<van-icon :name="method.icon" class="help-center__contact-icon" />
						<div class="help-center__contact-content">
							<div class="help-center__contact-title">{{ method.title }}</div>
							<div class="help-center__contact-text">{{ method.text }}</div>
							<div class="help-center__contact-note">{{ method.note }}</div>
						</div>
						<van-icon name="arrow" class="help-center__contact-arrow" />
					</div>
				</div>
			</div>

			<!-- 其他資訊 -->
			<div class="help-center__section">
				<div class="help-center__section-header">
					<van-icon name="info-o" class="help-center__section-icon" />
					<h3 class="help-center__section-title">其他資訊</h3>
				</div>

				<div class="help-center__info-list">
					<div v-for="(info, index) in helpData.otherInfo" :key="index" class="help-center__info-item">
						<div class="help-center__info-title">{{ info.title }}</div>
						<div class="help-center__info-text" v-html="info.content"></div>
					</div>
				</div>
			</div>

			<!-- 版權資訊 -->
			<div class="help-center__footer">
				<div class="help-center__footer-text">
					{{ helpData.footer.copyright }}
				</div>
				<div class="help-center__footer-version">
					{{ helpData.footer.version }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';
import helpCenterData from '@/data/help-center.json';

// 引入 JSON 資料
const helpData = helpCenterData;

// 手風琴展開/收起狀態
const activeNames = ref<string[]>([]);

// 路由
const router = useRouter();

// 返回上一頁
const handleBack = () => {
	router.back();
};

// 統一處理聯絡方式點擊事件
const handleContact = (method: {
	id: string;
	text: string;
	action: string;
	url?: string;
}) => {
	switch (method.action) {
		case 'call':
			showConfirmDialog({
				title: '撥打電話',
				message: `確定要撥打 ${method.text} 嗎？`,
			}).then(() => {
				window.location.href = `tel:${method.text}`;
			});
			break;

		case 'email':
			window.location.href = `mailto:${method.text}`;
			showToast('已開啟郵件應用程式');
			break;

		case 'line':
			if (method.url) {
				window.open(method.url, '_blank');
				showToast('已開啟 LINE');
			}
			break;

		case 'website':
			showToast('即將開放線上表單功能');
			break;

		default:
			showToast('功能開發中');
			break;
	}
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.help-center {
	min-height: 100vh;
	background: $color-gray-50;
	padding-bottom: $spacing-base;

	&__container {
		padding: $spacing-base;
	}

	// 置頂公告
	&__banner {
		display: flex;
		align-items: flex-start;
		gap: $spacing-12;
		padding: $spacing-16;
		background: linear-gradient(135deg, $color-blue-50 0%, $color-blue-100 100%);
		border-radius: $border-radius-lg;
		margin-bottom: $spacing-lg;

		&-icon {
			font-size: $font-size-2xl;
			color: $color-blue-1;
			flex-shrink: 0;
			margin-top: 2px;
		}

		&-content {
			flex: 1;
		}

		&-title {
			font-size: $font-size-lg;
			font-weight: $font-weight-semibold;
			color: $color-blue-700;
			margin-bottom: $spacing-xs;
		}

		&-text {
			font-size: $font-size-sm;
			color: $color-gray-600;
			line-height: 1.5;
		}
	}

	// 區塊標題
	&__section {
		margin-bottom: $spacing-lg;

		&-header {
			display: flex;
			align-items: center;
			gap: $spacing-8;
			margin-bottom: $spacing-12;
		}

		&-icon {
			font-size: $font-size-xl;
			color: $color-primary;
		}

		&-title {
			font-size: $font-size-lg;
			font-weight: $font-weight-semibold;
			color: $color-text-primary;
		}
	}

	// 手風琴樣式
	&__collapse {
		background: $color-white;
		border-radius: $border-radius-lg;
		overflow: hidden;

		:deep(.van-collapse-item) {
			&:not(:last-child)::after {
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				height: 1px;
				background: $color-gray-200;
			}
		}

		:deep(.van-collapse-item__title) {
			padding: $spacing-16;
			font-size: $font-size-base;
			font-weight: $font-weight-medium;
			color: $color-text-primary;
			background: $color-white;
		}

		:deep(.van-collapse-item__wrapper) {
			.van-collapse-item__content {
				padding: 0 $spacing-16 $spacing-16;
			}
		}

		:deep(.van-collapse-item__title--expanded) {
			background: $color-blue-50;
		}
	}

	// QA 列表
	&__qa-list {
		padding: $spacing-12 0;
	}

	&__qa-item {
		margin-bottom: $spacing-16;

		&:not(:last-child) {
			padding-bottom: $spacing-16;
			border-bottom: 1px solid $color-gray-200;
		}
	}

	&__qa-question {
		font-size: $font-size-base;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin-bottom: $spacing-8;
	}

	&__qa-answer {
		font-size: $font-size-sm;
		color: $color-text-secondary;
		line-height: 1.6;
		padding-left: $spacing-8;
		border-left: 2px solid $color-primary;
	}

	// 聯絡方式列表
	&__contact-list {
		background: $color-white;
		border-radius: $border-radius-lg;
		overflow: hidden;
	}

	&__contact-item {
		display: flex;
		align-items: center;
		gap: $spacing-12;
		padding: $spacing-16;
		cursor: pointer;
		transition: background-color 0.2s;

		&:active {
			background: $color-gray-100;
		}

		&:not(:last-child) {
			border-bottom: 1px solid $color-gray-200;
		}
	}

	&__contact-icon {
		font-size: $font-size-xl;
		color: $color-primary;
		flex-shrink: 0;
	}

	&__contact-content {
		flex: 1;
	}

	&__contact-title {
		font-size: $font-size-base;
		font-weight: $font-weight-medium;
		color: $color-text-primary;
		margin-bottom: $spacing-xs;
	}

	&__contact-text {
		font-size: $font-size-sm;
		color: $color-primary;
		font-weight: $font-weight-medium;
		margin-bottom: $spacing-xs;
	}

	&__contact-note {
		font-size: $font-size-xs;
		color: $color-text-secondary;
	}

	&__contact-arrow {
		font-size: $font-size-base;
		color: $color-gray-400;
		flex-shrink: 0;
	}

	// 其他資訊
	&__info-list {
		background: $color-white;
		border-radius: $border-radius-lg;
		overflow: hidden;
	}

	&__info-item {
		padding: $spacing-16;

		&:not(:last-child) {
			border-bottom: 1px solid $color-gray-200;
		}
	}

	&__info-title {
		font-size: $font-size-base;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin-bottom: $spacing-8;
	}

	&__info-text {
		font-size: $font-size-sm;
		color: $color-text-secondary;
		line-height: 1.6;
	}

	// 頁尾
	&__footer {
		text-align: center;
		padding: $spacing-24 0;
	}

	&__footer-text {
		font-size: $font-size-sm;
		color: $color-text-secondary;
		margin-bottom: $spacing-xs;
	}

	&__footer-version {
		font-size: $font-size-xs;
		color: $color-gray-400;
	}
}
</style>
