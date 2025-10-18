<template>
	<van-dialog :show="show" :show-cancel-button="false" :show-confirm-button="false" class="admin-create-shift-dialog"
		@close="handleClose" @update:show="(value) => emit('update:show', value)">
		<div class="dialog-title">
			<van-icon name="plus" size="16" color="black" />
			<h3 class="dialog-title-text">
				新增班別
			</h3>
			<!-- 關閉按鈕 icon:x -->
			<div class="close-button" @click="$emit('update:show', false)">
				<van-icon name="close" size="16" color="black" />
			</div>
		</div>

		<div class="admin-create-shift-dialog__content">
			<!-- 表單內容 -->
			<div class="admin-create-shift-dialog__form">
				<div class="admin-create-shift-dialog__form-grid">
					<template v-for="field in formConfig.fields" :key="field.key">
						<!-- 商家選擇器類型 -->
						<div v-if="field.type === 'employer'" class="admin-create-shift-dialog__form-item"
							:class="`admin-create-shift-dialog__form-item--${field.width || 'full'}`">
							<label class="admin-create-shift-dialog__label">{{ field.label }}</label>
							<van-field :model-value="getDisplayText(field, formConfig.values[field.key])"
								:placeholder="field.placeholder || field.label" readonly @click="showPickerForField(field.key)"
								class="admin-create-shift-dialog__employer-input" />
						</div>

						<!-- 日期選擇器類型 -->
						<div v-else-if="field.type === 'date'" class="admin-create-shift-dialog__form-item"
							:class="`admin-create-shift-dialog__form-item--${field.width || 'half'}`">
							<label class="admin-create-shift-dialog__label">{{ field.label }}</label>
							<van-field :model-value="getDisplayText(field, formConfig.values[field.key])"
								:placeholder="field.placeholder || field.label" readonly @click="showPickerForField(field.key)"
								class="admin-create-shift-dialog__date-input" />
						</div>

						<!-- 時間選擇器類型 -->
						<div v-else-if="field.type === 'time'" class="admin-create-shift-dialog__form-item"
							:class="`admin-create-shift-dialog__form-item--${field.width || 'half'}`">
							<label class="admin-create-shift-dialog__label">{{ field.label }}</label>
							<van-field :model-value="getDisplayText(field, formConfig.values[field.key])"
								:placeholder="field.placeholder || field.label" readonly @click="showPickerForField(field.key)"
								class="admin-create-shift-dialog__time-input" />
						</div>

						<!-- 數字輸入框類型 -->
						<div v-else-if="field.type === 'number'" class="admin-create-shift-dialog__form-item"
							:class="`admin-create-shift-dialog__form-item--${field.width || 'half'}`">
							<label class="admin-create-shift-dialog__label">{{ field.label }}</label>
							<van-field :model-value="formConfig.values[field.key]" type="number"
								:placeholder="field.placeholder || field.label" :min="field.min" :max="field.max" :step="field.step"
								@update:model-value="(value) => handleInputChange(field, value)"
								class="admin-create-shift-dialog__number-input" />
						</div>

						<!-- 文字輸入框類型 -->
						<div v-else-if="field.type === 'text'" class="admin-create-shift-dialog__form-item"
							:class="`admin-create-shift-dialog__form-item--${field.width || 'half'}`">
							<label class="admin-create-shift-dialog__label">{{ field.label }}</label>
							<van-field :model-value="formConfig.values[field.key]" type="text"
								:placeholder="field.placeholder || field.label"
								@update:model-value="(value) => handleInputChange(field, value)"
								class="admin-create-shift-dialog__text-input" />
						</div>
					</template>
				</div>
			</div>

			<!-- 操作按鈕 -->
			<div class="admin-create-shift-dialog__actions">
				<van-button type="primary" size="small" class="admin-create-shift-dialog__create-btn" @click="handleCreate">
					建立班別
				</van-button>
				<van-button type="default" size="small" class="admin-create-shift-dialog__cancel-btn" @click="handleCancel">
					取消
				</van-button>
			</div>
		</div>

		<!-- 動態生成的選擇器 -->
		<template v-for="field in formConfig.fields" :key="`picker-${field.key}`">
			<!-- 商家選擇器彈出層 -->
			<van-popup v-if="field.type === 'employer'" v-model:show="showPicker[field.key]" position="bottom"
				destroy-on-close round>
				<van-picker v-model="employerPickerValues[field.key]" :columns="employerOptions"
					@confirm="() => handleEmployerPickerConfirm(field)" @cancel="() => hidePickerForField(field.key)" />
			</van-popup>

			<!-- 日期選擇器彈出層 -->
			<van-popup v-else-if="field.type === 'date'" v-model:show="showPicker[field.key]" position="bottom"
				destroy-on-close round>
				<van-date-picker v-model="datePickerValues[field.key]" @confirm="() => handleDatePickerConfirm(field)"
					@cancel="() => hidePickerForField(field.key)" />
			</van-popup>

			<!-- 時間選擇器彈出層 -->
			<van-popup v-else-if="field.type === 'time'" v-model:show="showPicker[field.key]" position="bottom"
				destroy-on-close round>
				<van-time-picker v-model="timePickerValues[field.key]" @confirm="() => handleTimePickerConfirm(field)"
					@cancel="() => hidePickerForField(field.key)" />
			</van-popup>
		</template>
	</van-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// 商家選項類型
interface EmployerOption {
	text: string;
	value: string;
}

// 表單欄位配置類型
interface FormField {
	key: string;
	label: string;
	type: 'text' | 'number' | 'date' | 'time' | 'employer';
	placeholder?: string;
	width?: 'half' | 'full';
	min?: number;
	max?: number;
	step?: number;
}

// 表單配置類型
interface FormConfig {
	fields: FormField[];
	values: Record<string, string | number>;
}

// Props 定義
interface Props {
	show: boolean;
	employers?: EmployerOption[];
}

const props = withDefaults(defineProps<Props>(), {
	employers: () => [
		{ text: '星光娛樂城', value: 'EMP001' },
		{ text: '金沙會館', value: 'EMP002' },
		{ text: '豪華賭場', value: 'EMP003' },
		{ text: '皇家賭場', value: 'EMP004' },
		{ text: '鑽石娛樂', value: 'EMP005' }
	]
});

// Emits 定義
const emit = defineEmits<{
	'update:show': [value: boolean];
	create: [data: Record<string, string | number>];
	cancel: [];
}>();

// 商家選項
const employerOptions = ref<EmployerOption[]>(props.employers);

// 表單配置
const formConfig = ref<FormConfig>({
	fields: [
		{
			key: 'employerId',
			label: '選擇商家',
			type: 'employer',
			placeholder: '請選擇商家',
			width: 'full'
		},
		{
			key: 'workDate',
			label: '工作日期',
			type: 'date',
			placeholder: '請選擇工作日期',
			width: 'full'
		},
		{
			key: 'startTime',
			label: '起始時間',
			type: 'time',
			placeholder: '請選擇起始時間',
			width: 'half'
		},
		{
			key: 'endTime',
			label: '結束時間',
			type: 'time',
			placeholder: '請選擇結束時間',
			width: 'half'
		},
		{
			key: 'position',
			label: '職位',
			type: 'text',
			placeholder: '請輸入職位',
			width: 'full'
		},
		{
			key: 'location',
			label: '地點',
			type: 'text',
			placeholder: '請輸入地點',
			width: 'full'
		},
		{
			key: 'hourlyWage',
			label: '時薪',
			type: 'number',
			placeholder: '請輸入時薪',
			min: 0,
			step: 1,
			width: 'half'
		},
		{
			key: 'requiredStaff',
			label: '需求人數',
			type: 'number',
			placeholder: '請輸入需求人數',
			min: 1,
			step: 1,
			width: 'half'
		},
		{
			key: 'deadline',
			label: '應徵截止時間',
			type: 'date',
			placeholder: '請選擇截止時間',
			width: 'full'
		}
	],
	values: {
		employerId: '',
		workDate: '',
		startTime: '',
		endTime: '',
		position: '',
		location: '',
		hourlyWage: 0,
		requiredStaff: 0,
		deadline: ''
	}
});

// 彈出層顯示狀態
const showPicker = ref<Record<string, boolean>>({});

// 商家選擇器的值
const employerPickerValues = ref<Record<string, string[]>>({});

// 日期選擇器的值
const datePickerValues = ref<Record<string, string[]>>({});

// 時間選擇器的值
const timePickerValues = ref<Record<string, string[]>>({});

// 監聽 props 變化，更新商家選項
watch(
	() => props.employers,
	(newEmployers) => {
		if (newEmployers) {
			employerOptions.value = newEmployers;
		}
	},
	{ immediate: true, deep: true }
);

// 方法：獲取顯示文字
const getDisplayText = (field: FormField, value: string | number) => {
	if (!value && value !== 0) {
		return field.placeholder || field.label;
	}

	if (field.type === 'employer') {
		const employer = employerOptions.value.find(emp => emp.value === value);
		return employer?.text || field.placeholder || field.label;
	}

	if (field.type === 'date') {
		if (!value) return field.placeholder || 'yyyy/月/dd';
		const d = new Date(value as string);
		return d.toLocaleDateString('zh-TW', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).replace(/\//g, '/');
	}

	if (field.type === 'time') {
		if (!value) return field.placeholder || 'HH:mm';
		return value.toString();
	}

	if (field.type === 'number') {
		return value.toString();
	}

	if (field.type === 'text') {
		return value.toString();
	}

	return field.placeholder || field.label;
};

// 方法：顯示選擇器
const showPickerForField = (key: string) => {
	const field = formConfig.value.fields.find(f => f.key === key);
	if (!field) return;

	if (field.type === 'employer') {
		const currentValue = formConfig.value.values[key];
		employerPickerValues.value[key] = currentValue ? [currentValue.toString()] : [];
	} else if (field.type === 'date') {
		const currentValue = formConfig.value.values[key];
		if (currentValue) {
			// 確保日期格式正確
			let date;
			if (typeof currentValue === 'string') {
				// 處理不同的日期格式
				if (currentValue.includes('/')) {
					// 處理 "2024/09/15" 格式
					const [year, month, day] = currentValue.split('/');
					date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
				} else if (currentValue.includes('-')) {
					// 處理 "2024-09-15" 格式
					date = new Date(currentValue);
				} else {
					date = new Date(currentValue);
				}
			} else {
				date = new Date(currentValue);
			}

			// 檢查日期是否有效
			if (isNaN(date.getTime())) {
				date = new Date();
			}

			datePickerValues.value[key] = [
				date.getFullYear().toString(),
				(date.getMonth() + 1).toString().padStart(2, '0'),
				date.getDate().toString().padStart(2, '0')
			];
		} else {
			const today = new Date();
			datePickerValues.value[key] = [
				today.getFullYear().toString(),
				(today.getMonth() + 1).toString().padStart(2, '0'),
				today.getDate().toString().padStart(2, '0')
			];
		}
	} else if (field.type === 'time') {
		const currentValue = formConfig.value.values[key];
		if (currentValue) {
			// 解析時間字串 (格式: "HH:mm" 或 "HH:mm:ss")
			const timeStr = currentValue.toString();
			const [hours, minutes] = timeStr.split(':');

			// 確保時間值有效
			const validHours = parseInt(hours) || 0;
			const validMinutes = parseInt(minutes) || 0;

			timePickerValues.value[key] = [
				Math.max(0, Math.min(23, validHours)).toString().padStart(2, '0'),
				Math.max(0, Math.min(59, validMinutes)).toString().padStart(2, '0')
			];
		} else {
			// 預設為當前時間
			const now = new Date();
			timePickerValues.value[key] = [
				now.getHours().toString().padStart(2, '0'),
				now.getMinutes().toString().padStart(2, '0')
			];
		}
	}

	showPicker.value[key] = true;
};

// 方法：隱藏選擇器
const hidePickerForField = (key: string) => {
	showPicker.value[key] = false;
};

// 方法：處理商家選擇器確認
const handleEmployerPickerConfirm = (field: FormField) => {
	const selectedValues = employerPickerValues.value[field.key];
	const selectedValue = selectedValues && selectedValues.length > 0 ? selectedValues[0] : null;
	if (selectedValue !== null) {
		handleInputChange(field, selectedValue);
	}
	hidePickerForField(field.key);
};

// 方法：處理日期選擇器確認
const handleDatePickerConfirm = (field: FormField) => {
	const selectedValues = datePickerValues.value[field.key];
	if (selectedValues && selectedValues.length >= 3) {
		const [year, month, day] = selectedValues;
		const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
		handleInputChange(field, dateString);
	}
	hidePickerForField(field.key);
};

// 方法：處理時間選擇器確認
const handleTimePickerConfirm = (field: FormField) => {
	const selectedValues = timePickerValues.value[field.key];
	if (selectedValues && selectedValues.length >= 2) {
		const [hours, minutes] = selectedValues;
		const timeString = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
		handleInputChange(field, timeString);
	}
	hidePickerForField(field.key);
};

// 方法：處理輸入框變更
const handleInputChange = (field: FormField, value: string | number) => {
	formConfig.value.values[field.key] = value;
};

// 方法：處理關閉
const handleClose = () => {
	emit('update:show', false);
};

// 方法：處理取消
const handleCancel = () => {
	emit('cancel');
	handleClose();
};

// 方法：處理建立
const handleCreate = () => {
	// 驗證必填欄位
	const requiredFields = ['employerId', 'workDate', 'startTime', 'endTime', 'position', 'location'];
	const missingFields = requiredFields.filter(field => !formConfig.value.values[field]);

	if (missingFields.length > 0) {
		// 這裡可以顯示錯誤提示
		console.warn('請填寫所有必填欄位:', missingFields);
		return;
	}

	if (formConfig.value && formConfig.value.values) {
		emit('create', formConfig.value.values);
		handleClose();
	}
};
</script>

<style lang="scss">
.admin-create-shift-dialog {
	max-width: 768px;
	max-height: 90vh;

	&.van-dialog {
		border-radius: $border-radius-lg;

		.van-dialog__content {
			padding: 0;
			max-height: 85vh;
			overflow-y: auto;
		}
	}
}
</style>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

:deep(.van-cell) {
	padding: $spacing-8 0;
}

.admin-create-shift-dialog {
	&__content {
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: $spacing-16 $spacing-16 0;
		position: relative;
		color: $color-gray-900;
	}

	&__form {
		flex: 1;
	}

	&__form-grid {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-8;
	}

	&__form-item {
		display: flex;
		flex-direction: column;

		&--half {
			flex: 0 0 calc(50% - 8px);
		}

		&--full {
			flex: 1 1 100%;
		}
	}

	&__label {
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		color: $color-text-primary;
		margin-bottom: $spacing-xs;
	}

	&__employer-input,
	&__date-input,
	&__time-input,
	&__number-input,
	&__text-input {
		:deep(.van-field__control) {
			font-size: $font-size-sm;
			color: $color-text-primary;
			padding: $spacing-8 $spacing-16;
			background: $color-gray-3;
			border: 1px solid $color-gray-200;
			border-radius: $border-radius-base;

			&::placeholder {
				color: $color-text-secondary;
			}
		}

		:deep(.van-field__body) {
			padding: 0;
		}

		:deep(.van-field__right-icon) {
			color: $color-text-secondary;
		}
	}

	&__actions {
		display: flex;
		align-items: center;
		gap: $spacing-16;
		padding: $spacing-12 $spacing-8;
		border-top: 1px solid $color-gray-200;
		background: $color-white;
		position: sticky;
		bottom: 0;
		z-index: 0;
	}

	&__create-btn {
		flex: 1 1 60%;
		background: $color-primary;
		color: $color-white;
		border: none;
		font-weight: $font-weight-medium;
	}

	&__cancel-btn {
		flex: 1 1 40%;
		background: $color-white;
		color: $color-text-secondary;
		border: 1px solid $color-gray-300;
		font-weight: $font-weight-medium;
	}
}

// 對話框標題樣式
.dialog-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: $spacing-16 $spacing-16 $spacing-8;
	border-bottom: 1px solid $color-gray-200;
	background: $color-white;
	position: sticky;
	top: 0;
	z-index: 1;

	.dialog-title-text {
		font-size: $font-size-lg;
		font-weight: $font-weight-semibold;
		color: $color-text-primary;
		margin: 0;
		flex: 1;
		text-align: center;
		margin-left: -24px; // 平衡關閉按鈕的寬度
	}

	.close-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		cursor: pointer;
		border-radius: $border-radius-sm;
		transition: background-color 0.2s ease;

		&:hover {
			background: $color-gray-100;
		}
	}
}
</style>
