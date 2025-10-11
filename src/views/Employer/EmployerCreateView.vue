<script setup lang="ts">
import { ref, reactive } from 'vue';
import { showToast } from 'vant';
import type { Shift } from '@/types/shift';

defineOptions({
	name: 'EmployerCreateView',
});

// TAB 切換狀態
const activeTab = ref('single');

// 表單資料
const formData = reactive({
	// 基本資訊
	date: '',
	startTime: '',
	endTime: '',
	position: '',
	company: '',
	wage: 450,
	quota: 10,
	deadline: '',

	// 地點資訊
	address: '',
	trafficInfo: '',

	// 聯絡資訊
	contactPerson: '',
	contactPhone: '',
	contactEmail: '',

	// 工作說明
	description: '',

	// 應徵條件
	requirements: '',

	// 福利待遇
	benefits: ''
});

// 職位選項
const positionOptions = [
	'荷官',
	'發牌員',
	'服務員',
	'清潔人員',
	'保全',
	'其他'
];

// 地點選項
const locationOptions = [
	'台北市',
	'新北市',
	'桃園市',
	'台中市',
	'台南市',
	'高雄市',
	'其他'
];

// 表單驗證規則 (暫時未使用，保留供未來使用)
// const formRules = {
// 	date: [{ required: true, message: '請選擇日期' }],
// 	startTime: [{ required: true, message: '請選擇開始時間' }],
// 	endTime: [{ required: true, message: '請選擇結束時間' }],
// 	position: [{ required: true, message: '請選擇職位' }],
// 	location: [{ required: true, message: '請選擇地點' }],
// 	wage: [{ required: true, message: '請輸入時薪' }],
// 	quota: [{ required: true, message: '請輸入需求人數' }]
// };

// 提交表單
const handleSubmit = async () => {
	try {
		// 驗證表單
		if (!formData.date || !formData.startTime || !formData.endTime ||
			!formData.position || !formData.company || !formData.wage || !formData.quota) {
			showToast('請填寫所有必填欄位');
			return;
		}

		// 建立班別資料
		const shiftData: Partial<Shift> = {
			date: formData.date,
			startTime: formData.startTime,
			endTime: formData.endTime,
			title: `${formData.position} - ${formData.date}`,
			location: formData.address, // 使用地址作為地點
			address: formData.address,
			wage: formData.wage,
			quota: formData.quota,
			appliedCount: 0,
			employerId: 'current-employer-id', // 實際應用中從 store 取得
			status: 'draft',
			deadline: formData.deadline,
			description: formData.description,
			requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : [],
			benefits: formData.benefits ? formData.benefits.split('\n').filter(b => b.trim()) : [],
			contactPerson: formData.contactPerson,
			contactPhone: formData.contactPhone,
			contactEmail: formData.contactEmail,
			trafficInfo: formData.trafficInfo
		};

		// TODO: 呼叫 API 建立班別
		console.log('建立班別:', shiftData);

		showToast('班別建立成功');

		// 重置表單
		Object.assign(formData, {
			date: '',
			startTime: '',
			endTime: '',
			position: '',
			company: '',
			wage: 450,
			quota: 10,
			deadline: '',
			address: '',
			trafficInfo: '',
			contactPerson: '',
			contactPhone: '',
			contactEmail: '',
			description: '',
			requirements: '',
			benefits: ''
		});

	} catch (error) {
		console.error('建立班別失敗:', error);
		showToast('建立班別失敗，請稍後再試');
	}
};

// 切換 TAB
const handleTabChange = (tab: string) => {
	activeTab.value = tab;
};

// 選擇器顯示狀態
const showDatePicker = ref(false);
const showStartTimePicker = ref(false);
const showEndTimePicker = ref(false);
const showPositionPicker = ref(false);
const showLocationPicker = ref(false);
const showDeadlinePicker = ref(false);

// 選擇器資料

// 日期選擇處理
const handleDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
	if (selectedValues && selectedValues.length === 3) {
		formData.date = `${selectedValues[0]}/${selectedValues[1]}/${selectedValues[2]}`;
	}
	showDatePicker.value = false;
};

// 開始時間選擇處理
const handleStartTimeConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
	if (selectedValues && selectedValues.length === 2) {
		formData.startTime = `${selectedValues[0]}:${selectedValues[1]}`;
	}
	showStartTimePicker.value = false;
};

// 結束時間選擇處理
const handleEndTimeConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
	if (selectedValues && selectedValues.length === 2) {
		formData.endTime = `${selectedValues[0]}:${selectedValues[1]}`;
	}
	showEndTimePicker.value = false;
};

// 職位選擇處理
const handlePositionConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
	formData.position = selectedValues[0];
	showPositionPicker.value = false;
};

// 地點選擇處理 (已移除，改為直接輸入地址)
const handleLocationConfirm = () => {
	// 這個函數已不再使用，因為地點改為直接輸入地址
	showLocationPicker.value = false;
};

// 截止時間選擇處理
const deadlineDate = ref<string>('');
const deadlineTime = ref<string>('');

const handleDeadlineDateConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
	if (selectedValues && selectedValues.length === 3) {
		deadlineDate.value = `${selectedValues[0]}/${selectedValues[1]}/${selectedValues[2]}`;
	}
};

const handleDeadlineTimeConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
	if (selectedValues && selectedValues.length === 2) {
		deadlineTime.value = `${selectedValues[0]}:${selectedValues[1]}`;
	}
};

const handleDeadlineConfirm = () => {
	if (deadlineDate.value && deadlineTime.value) {
		formData.deadline = `${deadlineDate.value} ${deadlineTime.value}`;
	}
	showDeadlinePicker.value = false;
};
</script>

<template>
	<div class="employer-create-view">
		<!-- 頁面標題 -->
		<div class="page-header">
			<h1 class="page-title">建立班別</h1>
			<p class="page-subtitle">發布新的工作班別或批量上傳</p>
		</div>

		<!-- TAB 導航 -->
		<div class="tab-navigation">
			<div class="tab-item" :class="{ 'tab-item--active': activeTab === 'single' }" @click="handleTabChange('single')">
				<van-icon name="plus" size="16" color="black" />
				<span>單一班別</span>
			</div>
			<div class="tab-item" :class="{ 'tab-item--active': activeTab === 'batch' }" @click="handleTabChange('batch')">
				<van-icon name="arrow-up" size="16" color="black" />
				<span>批量上傳</span>
			</div>
		</div>

		<!-- 表單內容 -->
		<div class="form-container">
			<!-- 單一班別表單 -->
			<div v-if="activeTab === 'single'" class="form-content">
				<van-form @submit="handleSubmit">
					<!-- 1. 基本資訊區塊 -->
					<div class="form-section">
						<div class="section-header">
							<van-icon name="calendar-o" size="16" />
							<h3 class="section-title">基本資訊</h3>
						</div>

						<div class="form-grid">
							<!-- 日期 -->
							<div class="form-item form-item--full">
								<van-field v-model="formData.date" label="日期" placeholder="yyyy/月/dd" required readonly
									@click="showDatePicker = true">
									<template #right-icon>
										<van-icon name="calendar-o" />
									</template>
								</van-field>
							</div>

							<!-- 開始時間 -->
							<div class="form-item">
								<van-field v-model="formData.startTime" label="開始時間" placeholder="--:--" required readonly
									@click="showStartTimePicker = true">
									<template #right-icon>
										<van-icon name="clock-o" />
									</template>
								</van-field>
							</div>

							<!-- 結束時間 -->
							<div class="form-item">
								<van-field v-model="formData.endTime" label="結束時間" placeholder="--:--" required readonly
									@click="showEndTimePicker = true">
									<template #right-icon>
										<van-icon name="clock-o" />
									</template>
								</van-field>
							</div>

							<!-- 職位 -->
							<div class="form-item">
								<van-field v-model="formData.position" label="職位" placeholder="選擇職位" required readonly
									@click="showPositionPicker = true">
									<template #right-icon>
										<van-icon name="arrow-down" />
									</template>
								</van-field>
							</div>

							<!-- 商家 -->
							<div class="form-item">
								<van-field v-model="formData.company" label="商家" placeholder="輸入商家名稱" required />
							</div>

							<!-- 時薪 -->
							<div class="form-item">
								<van-field v-model.number="formData.wage" label="時薪 (元)" type="number" placeholder="450" required />
							</div>

							<!-- 人數 -->
							<div class="form-item">
								<van-field v-model.number="formData.quota" label="人數" type="number" placeholder="10" required />
							</div>

							<!-- 截止日期 -->
							<div class="form-item form-item--full">
								<van-field v-model="formData.deadline" label="截止日期" placeholder="yyyy/月/dd --:--" readonly
									@click="showDeadlinePicker = true">
									<template #right-icon>
										<van-icon name="calendar-o" />
									</template>
								</van-field>
							</div>
						</div>
					</div>

					<!-- 2. 地點資訊區塊 -->
					<div class="form-section">
						<div class="section-header">
							<van-icon name="location-o" size="16" />
							<h3 class="section-title">地點資訊</h3>
						</div>

						<div class="form-grid">
							<!-- 地址 -->
							<div class="form-item form-item--full">
								<van-field v-model="formData.address" label="地址" placeholder="請輸入詳細地址" required />
							</div>

							<!-- 交通資訊 -->
							<div class="form-item form-item--full">
								<van-field v-model="formData.trafficInfo" label="交通資訊" placeholder="例如：捷運站、公車站等交通資訊" />
							</div>
						</div>
					</div>

					<!-- 3. 聯絡資訊區塊 -->
					<div class="form-section">
						<div class="section-header">
							<van-icon name="phone-o" size="16" />
							<h3 class="section-title">聯絡資訊</h3>
						</div>

						<div class="form-grid">
							<!-- 聯絡人 -->
							<div class="form-item">
								<van-field v-model="formData.contactPerson" label="聯絡人" placeholder="請輸入聯絡人姓名" required />
							</div>

							<!-- 電話 -->
							<div class="form-item">
								<van-field v-model="formData.contactPhone" label="電話" placeholder="請輸入手機號碼" type="tel" required />
							</div>

							<!-- 信箱 -->
							<div class="form-item form-item--full">
								<van-field v-model="formData.contactEmail" label="信箱" placeholder="請輸入電子信箱" type="email" required />
							</div>
						</div>
					</div>

					<!-- 4. 工作說明區塊 -->
					<div class="form-section">
						<div class="section-header">
							<van-icon name="description" size="16" />
							<h3 class="section-title">工作說明</h3>
						</div>

						<div class="form-grid">
							<div class="form-item form-item--full">
								<van-field v-model="formData.description" label="工作說明" type="textarea" placeholder="請詳細描述工作內容、職責等"
									rows="4" autosize />
							</div>
						</div>
					</div>

					<!-- 5. 應徵條件區塊 -->
					<div class="form-section">
						<div class="section-header">
							<van-icon name="edit" size="16" />
							<h3 class="section-title">應徵條件</h3>
						</div>

						<div class="form-grid">
							<div class="form-item form-item--full">
								<van-field v-model="formData.requirements" label="應徵條件" type="textarea"
									placeholder="例如：需具備1年以上荷官經驗、熟悉百家樂規則等" rows="4" autosize />
							</div>
						</div>
					</div>

					<!-- 6. 福利待遇區塊 -->
					<div class="form-section">
						<div class="section-header">
							<van-icon name="gift-o" size="16" />
							<h3 class="section-title">福利待遇</h3>
						</div>

						<div class="form-grid">
							<div class="form-item form-item--full">
								<van-field v-model="formData.benefits" label="福利待遇" type="textarea" placeholder="例如：提供餐點、交通補助、績效獎金等"
									rows="4" autosize />
							</div>
						</div>
					</div>

					<!-- 提交按鈕 -->
					<div class="form-actions">
						<van-button type="primary" size="large" native-type="submit" class="submit-button">
							建立班別
						</van-button>
					</div>
				</van-form>
			</div>

			<!-- 批量上傳內容 -->
			<div v-if="activeTab === 'batch'" class="batch-upload">
				<div class="batch-placeholder">
					<van-icon name="upload" size="48" color="#ccc" />
					<p>批量上傳功能開發中...</p>
				</div>
			</div>
		</div>

		<!-- 日期選擇器 -->
		<van-popup v-model:show="showDatePicker" position="bottom">
			<van-date-picker @confirm="handleDateConfirm" @cancel="showDatePicker = false" />
		</van-popup>

		<!-- 開始時間選擇器 -->
		<van-popup v-model:show="showStartTimePicker" position="bottom">
			<van-time-picker @confirm="handleStartTimeConfirm" @cancel="showStartTimePicker = false" />
		</van-popup>

		<!-- 結束時間選擇器 -->
		<van-popup v-model:show="showEndTimePicker" position="bottom">
			<van-time-picker @confirm="handleEndTimeConfirm" @cancel="showEndTimePicker = false" />
		</van-popup>

		<!-- 職位選擇器 -->
		<van-popup v-model:show="showPositionPicker" position="bottom">
			<van-picker :columns="positionOptions.map(option => ({ text: option, value: option }))"
				@confirm="handlePositionConfirm" @cancel="showPositionPicker = false" />
		</van-popup>

		<!-- 地點選擇器 -->
		<van-popup v-model:show="showLocationPicker" position="bottom">
			<van-picker :columns="locationOptions.map(option => ({ text: option, value: option }))"
				@confirm="handleLocationConfirm" @cancel="showLocationPicker = false" />
		</van-popup>

		<!-- 截止時間選擇器 -->
		<van-popup v-model:show="showDeadlinePicker" position="bottom">
			<div class="deadline-picker-container">
				<div class="picker-section">
					<h4>選擇日期</h4>
					<van-date-picker @confirm="handleDeadlineDateConfirm" />
				</div>
				<div class="picker-section">
					<h4>選擇時間</h4>
					<van-time-picker @confirm="handleDeadlineTimeConfirm" />
				</div>
				<div class="picker-actions">
					<van-button @click="showDeadlinePicker = false">取消</van-button>
					<van-button type="primary" @click="handleDeadlineConfirm">確認</van-button>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<style lang="scss" scoped>
.employer-create-view {
	min-height: 100vh;
	background: $color-gray-50;
	padding-bottom: $spacing-24;
}

.page-header {
	padding: $spacing-8 $spacing-16;
	background: $color-white;
	border-bottom: 1px solid $color-gray-200;

	.page-title {
		font-size: $font-size-base;
		font-weight: $font-weight-bold;
		color: $color-gray-900;
	}

	.page-subtitle {
		font-size: $font-size-xs;
		color: $color-gray-600;
		margin: 0;
		line-height: 1;
	}
}

.tab-navigation {
	display: flex;
	background: $color-gray-2;

	padding: $spacing-4;
	border-radius: $border-radius-full;
	margin: $spacing-8 $spacing-16 $spacing-16;

	.tab-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: $spacing-4;
		border-radius: $border-radius-full;
		cursor: pointer;

		&--active {
			color: $color-primary;
			background: $color-white;
		}

		span {
			margin-left: $spacing-4;
			font-size: $font-size-xs;
			line-height: 1;
			color: $color-gray-900;
		}
	}
}

.form-container {
	padding: 0 $spacing-16;
}

.form-content {
	.form-section {
		background: $color-white;
		border-radius: $border-radius-lg;
		padding: $spacing-16;
		margin-bottom: $spacing-16;
		box-shadow: $shadow-sm;
		border: 1px solid $color-gray-200;

		&:last-child {
			margin-bottom: 0;
		}

		.section-header {
			display: flex;
			align-items: center;
			// margin-bottom: $spacing-16;
			// padding-bottom: $spacing-8;
			border-bottom: 1px solid $color-gray-100;

			.section-title {
				font-size: $font-size-base;
				font-weight: $font-weight-semibold;
				color: $color-gray-900;
				margin: 0 0 0 $spacing-8;
			}
		}
	}
}

.form-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: $spacing-16;

	.form-item {
		&--full {
			grid-column: 1 / -1;
		}
	}
}

.form-actions {
	padding: $spacing-24 0;
	text-align: center;

	.submit-button {
		width: 100%;
		height: 48px;
		font-size: $font-size-md;
		font-weight: $font-weight-medium;
		border-radius: $border-radius-lg;
	}
}

.batch-upload {
	background: $color-white;
	border-radius: $border-radius-lg;
	padding: $spacing-32;
	text-align: center;
	box-shadow: $shadow-sm;

	.batch-placeholder {
		p {
			margin: $spacing-16 0 0 0;
			color: $color-gray-500;
			font-size: $font-size-sm;
		}
	}
}

// 響應式設計
@media (max-width: 480px) {
	.form-grid {
		grid-template-columns: 1fr;
		gap: 0;
	}
}

// Vant 組件樣式覆蓋
:deep(.van-field) {
	align-items: center;
	padding: $spacing-12 0;

	.van-field__label {
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $color-gray-700;
		min-width: 80px;
	}

	.van-field__value {
		background: $color-gray-3;
		padding: $spacing-4 $spacing-8 0;
		border-radius: $border-radius-sm;

	}

	.van-field__control {
		font-size: $font-size-sm;
		color: $color-gray-900;
	}

	.van-field__right-icon {
		color: $color-gray-400;
	}
}

:deep(.van-field--required) {
	.van-field__label::after {
		content: '*';
		color: $color-red-1;
		margin-left: $spacing-2;
	}
}

:deep(.van-button--primary) {
	background: $color-primary;
	border-color: $color-primary;

	&:active {
		background: $color-primary-dark;
		border-color: $color-primary-dark;
	}
}

:deep(.van-popup) {
	border-radius: $border-radius-lg $border-radius-lg 0 0;
}

:deep(.van-picker) {
	.van-picker__toolbar {
		padding: $spacing-16;
		border-bottom: 1px solid $color-gray-200;
	}

	.van-picker__confirm {
		color: $color-primary;
		font-weight: $font-weight-medium;
	}
}

// 截止時間選擇器樣式
.deadline-picker-container {
	padding: $spacing-16;
	background: $color-white;

	.picker-section {
		margin-bottom: $spacing-16;

		h4 {
			font-size: $font-size-sm;
			font-weight: $font-weight-medium;
			color: $color-gray-700;
			margin: 0 0 $spacing-8 0;
		}
	}

	.picker-actions {
		display: flex;
		gap: $spacing-12;
		padding-top: $spacing-16;
		border-top: 1px solid $color-gray-200;

		.van-button {
			flex: 1;
		}
	}
}
</style>