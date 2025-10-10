<template>
	<van-dialog :show="show" :show-cancel-button="false" :show-confirm-button="false" class="edit-shift-dialog"
		@close="handleClose" @update:show="(value) => emit('update:show', value)">
		<div class="dialog-title">
			<van-icon name="notes-o" size="16" color="black" />
			<h3 class="dialog-title-text">
				編輯班別
			</h3>
			<!-- 關閉按鈕 icon:x -->
			<div class="close-button" @click="$emit('update:show', false)">
				<van-icon name="close" size="16" color="black" />
			</div>
		</div>

		<div class="edit-shift-dialog__content">
			<!-- 表單內容 -->
			<div class="edit-shift-dialog__form">
				<div class="edit-shift-dialog__form-grid">
					<template v-for="field in formConfig.fields" :key="field.key">
						<!-- 日期選擇器類型 -->
						<div v-if="field.type === 'date'" class="edit-shift-dialog__form-item"
							:class="`edit-shift-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-shift-dialog__label">{{ field.label }}</label>
							<van-field :model-value="getDisplayText(field, formConfig.values[field.key])"
								:placeholder="field.placeholder || field.label" readonly @click="showPickerForField(field.key)"
								class="edit-shift-dialog__date-input" />
						</div>

						<!-- 時間選擇器類型 -->
						<div v-else-if="field.type === 'time'" class="edit-shift-dialog__form-item"
							:class="`edit-shift-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-shift-dialog__label">{{ field.label }}</label>
							<van-field :model-value="getDisplayText(field, formConfig.values[field.key])"
								:placeholder="field.placeholder || field.label" readonly @click="showPickerForField(field.key)"
								class="edit-shift-dialog__time-input" />
						</div>

						<!-- 數字輸入框類型 -->
						<div v-else-if="field.type === 'number'" class="edit-shift-dialog__form-item"
							:class="`edit-shift-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-shift-dialog__label">{{ field.label }}</label>
							<van-field :model-value="formConfig.values[field.key]" type="number"
								:placeholder="field.placeholder || field.label" :min="field.min" :max="field.max" :step="field.step"
								@update:model-value="(value) => handleInputChange(field, value)"
								class="edit-shift-dialog__number-input" />
						</div>

						<!-- 文字輸入框類型 -->
						<div v-else-if="field.type === 'text'" class="edit-shift-dialog__form-item"
							:class="`edit-shift-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-shift-dialog__label">{{ field.label }}</label>
							<van-field :model-value="formConfig.values[field.key]" type="text"
								:placeholder="field.placeholder || field.label"
								@update:model-value="(value) => handleInputChange(field, value)"
								class="edit-shift-dialog__text-input" />
						</div>
					</template>
				</div>
			</div>

			<!-- 操作按鈕 -->
			<div class="edit-shift-dialog__actions">
				<van-button type="primary" size="small" class="edit-shift-dialog__update-btn" @click="handleUpdate">
					更新
				</van-button>
				<van-button type="default" size="small" class="edit-shift-dialog__cancel-btn" @click="handleCancel">
					取消
				</van-button>
			</div>
		</div>

		<!-- 動態生成的選擇器 -->
		<template v-for="field in formConfig.fields" :key="`picker-${field.key}`">
			<!-- 日期選擇器彈出層 -->
			<van-popup v-if="field.type === 'date'" v-model:show="showPicker[field.key]" position="bottom" destroy-on-close
				round>
				<van-date-picker v-model="datePickerValues[field.key]" @confirm="() => handleDatePickerConfirm(field)"
					@cancel="() => hidePickerForField(field.key)" />
			</van-popup>

			<!-- 時間選擇器彈出層 -->
			<van-popup v-if="field.type === 'time'" v-model:show="showPicker[field.key]" position="bottom" destroy-on-close
				round>
				<van-time-picker v-model="timePickerValues[field.key]" @confirm="() => handleTimePickerConfirm(field)"
					@cancel="() => hidePickerForField(field.key)" />
			</van-popup>
		</template>
	</van-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// 表單欄位配置類型
interface FormField {
	key: string;
	label: string;
	type: 'text' | 'number' | 'date' | 'time';
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
	shiftData?: {
		workDate: string;
		startTime: string;
		endTime: string;
		position: string;
		location: string;
		hourlyWage: number;
		requiredStaff: number;
		deadline: string;
	};
}

const props = withDefaults(defineProps<Props>(), {
	shiftData: () => ({
		workDate: '',
		startTime: '',
		endTime: '',
		position: '',
		location: '',
		hourlyWage: 0,
		requiredStaff: 0,
		deadline: ''
	})
});

// Emits 定義
const emit = defineEmits<{
	'update:show': [value: boolean];
	update: [data: Record<string, string | number>];
	cancel: [];
}>();

// 表單配置
const formConfig = ref<FormConfig>({
	fields: [
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
	values: {}
});

// 彈出層顯示狀態
const showPicker = ref<Record<string, boolean>>({});

// 日期選擇器的值
const datePickerValues = ref<Record<string, string[]>>({});

// 時間選擇器的值
const timePickerValues = ref<Record<string, string[]>>({});

// 監聽 props 變化，初始化表單數據
watch(
	() => props.shiftData,
	(newData) => {
		if (newData) {
			formConfig.value.values = {
				workDate: newData.workDate || '',
				startTime: newData.startTime || '',
				endTime: newData.endTime || '',
				position: newData.position || '',
				location: newData.location || '',
				hourlyWage: newData.hourlyWage || 0,
				requiredStaff: newData.requiredStaff || 0,
				deadline: newData.deadline || ''
			};
		}
	},
	{ immediate: true, deep: true }
);

// 方法：獲取顯示文字
const getDisplayText = (field: FormField, value: string | number) => {
	if (!value && value !== 0) {
		return field.placeholder || field.label;
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

	if (field.type === 'date') {
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

// 方法：處理更新
const handleUpdate = () => {
	if (formConfig.value && formConfig.value.values) {
		emit('update', formConfig.value.values);
		handleClose();
	}
};
</script>
<style lang="scss">
.edit-shift-dialog {
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

.edit-shift-dialog {
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
	}

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

	&__update-btn {
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
</style>
