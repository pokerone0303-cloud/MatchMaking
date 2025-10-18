<template>
	<van-dialog :show="show" :show-cancel-button="false" :show-confirm-button="false" class="edit-user-dialog"
		@close="handleClose" @update:show="(value) => emit('update:show', value)" :close-on-click-overlay="true">
		<div class="dialog-title">
			<van-icon name="user-o" size="16" color="black" />
			<h3 class="dialog-title-text">
				{{ isEdit ? '編輯用戶' : '新增用戶' }}
			</h3>
			<!-- 關閉按鈕 icon:x -->
			<div class="close-button" @click="$emit('update:show', false)">
				<van-icon name="close" size="16" color="black" />
			</div>
		</div>

		<div class="edit-user-dialog__content">
			<!-- 表單內容 -->
			<div class="edit-user-dialog__form">
				<div class="edit-user-dialog__form-grid">
					<template v-for="field in formConfig.fields" :key="field.key">
						<!-- 文字輸入框類型 -->
						<div v-if="field.type === 'text'" class="edit-user-dialog__form-item"
							:class="`edit-user-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-user-dialog__label">{{ field.label }}</label>
							<van-field :model-value="formConfig.values[field.key] as string" type="text"
								:placeholder="field.placeholder || field.label"
								@update:model-value="(value) => handleInputChange(field, value)" class="edit-user-dialog__text-input" />
						</div>

						<!-- 數字輸入框類型 -->
						<div v-else-if="field.type === 'number'" class="edit-user-dialog__form-item"
							:class="`edit-user-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-user-dialog__label">{{ field.label }}</label>
							<van-field :model-value="formConfig.values[field.key] as number" type="number"
								:placeholder="field.placeholder || field.label" :min="field.min" :max="field.max" :step="field.step"
								@update:model-value="(value) => handleInputChange(field, value)"
								class="edit-user-dialog__number-input" />
						</div>

						<!-- 日期選擇器類型 -->
						<div v-else-if="field.type === 'date'" class="edit-user-dialog__form-item"
							:class="`edit-user-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-user-dialog__label">{{ field.label }}</label>
							<van-field :model-value="getDisplayText(field, formConfig.values[field.key])"
								:placeholder="field.placeholder || field.label" readonly @click="showPickerForField(field.key)"
								class="edit-user-dialog__date-input" />
						</div>

						<!-- 多選標籤類型 -->
						<div v-else-if="field.type === 'tags'" class="edit-user-dialog__form-item"
							:class="`edit-user-dialog__form-item--${field.width || 'full'}`">
							<label class="edit-user-dialog__label">{{ field.label }}</label>
							<div class="edit-user-dialog__tags-container">
								<div class="edit-user-dialog__tags-list">
									<span v-for="tag in (formConfig.values[field.key] as string[])" :key="tag"
										class="edit-user-dialog__tag">
										{{ tag }}
										<van-icon name="cross" size="12" @click="removeTag(field.key, tag as string)" />
									</span>
								</div>
								<van-field v-model="newTagInput[field.key]" type="text" :placeholder="field.placeholder || '輸入標籤'"
									@keyup.enter="addTag(field.key)" class="edit-user-dialog__tag-input" />
							</div>
						</div>

						<!-- 下拉選擇器類型 -->
						<div v-else-if="field.type === 'select'" class="edit-user-dialog__form-item"
							:class="`edit-user-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-user-dialog__label">{{ field.label }}</label>
							<van-field :model-value="getDisplayText(field, formConfig.values[field.key])"
								:placeholder="field.placeholder || field.label" readonly @click="showPickerForField(field.key)"
								class="edit-user-dialog__select-input" />
						</div>
					</template>
				</div>
			</div>

			<!-- 操作按鈕 -->
			<div class="edit-user-dialog__actions">
				<van-button type="primary" size="small" class="edit-user-dialog__save-btn" @click="handleSave">
					{{ isEdit ? '更新' : '新增' }}
				</van-button>
				<van-button type="default" size="small" class="edit-user-dialog__cancel-btn" @click="handleCancel">
					取消
				</van-button>
			</div>
		</div>

		<!-- 動態生成的選擇器 -->
		<!-- 日期選擇器 -->
		<template v-for="field in dateFields" :key="`date-picker-${field.key}`">
			<van-popup v-model:show="showPicker[field.key]" position="bottom" destroy-on-close round>
				<van-date-picker v-model="datePickerValues[field.key]" @confirm="() => handleDatePickerConfirm(field)"
					@cancel="() => hidePickerForField(field.key)" />
			</van-popup>
		</template>

		<!-- 下拉選擇器 -->
		<template v-for="field in selectFields" :key="`select-picker-${field.key}`">
			<van-popup v-model:show="showPicker[field.key]" position="bottom" destroy-on-close round>
				<van-picker v-model="selectPickerValues[field.key]" :columns="getPickerColumns(field)"
					@confirm="() => handleSelectPickerConfirm(field)" @cancel="() => hidePickerForField(field.key)" />
			</van-popup>
		</template>
	</van-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Applicant } from '@/types/application';

// 表單欄位配置類型
interface FormField {
	key: string;
	label: string;
	type: 'text' | 'number' | 'date' | 'tags' | 'select';
	placeholder?: string;
	width?: 'half' | 'full';
	min?: number;
	max?: number;
	step?: number;
	options?: string[]; // 用於 select 類型
}

// 表單配置類型
interface FormConfig {
	fields: FormField[];
	values: Record<string, string | number | string[]>;
}

// Props 定義
interface Props {
	show: boolean;
	userData?: Applicant;
}

const props = withDefaults(defineProps<Props>(), {
	userData: undefined
});

// Emits 定義
const emit = defineEmits<{
	'update:show': [value: boolean];
	save: [data: Partial<Applicant>];
	cancel: [];
}>();

// 計算屬性：分離不同類型的欄位
const dateFields = computed(() => formConfig.value.fields.filter(field => field.type === 'date'));
const selectFields = computed(() => formConfig.value.fields.filter(field => field.type === 'select'));

// 計算屬性：是否為編輯模式
const isEdit = computed(() => !!props.userData);

// 表單配置
const formConfig = ref<FormConfig>({
	fields: [
		{
			key: 'name',
			label: '姓名',
			type: 'text',
			placeholder: '請輸入姓名',
			width: 'half'
		},
		{
			key: 'position',
			label: '職位',
			type: 'text',
			placeholder: '請輸入職位',
			width: 'half'
		},
		{
			key: 'phone',
			label: '電話',
			type: 'text',
			placeholder: '請輸入電話',
			width: 'half'
		},
		{
			key: 'email',
			label: '電子郵件',
			type: 'text',
			placeholder: '請輸入電子郵件',
			width: 'half'
		},
		{
			key: 'experience',
			label: '經驗年數',
			type: 'number',
			placeholder: '請輸入經驗年數',
			min: 0,
			max: 50,
			step: 1,
			width: 'half'
		},
		{
			key: 'rating',
			label: '評分',
			type: 'number',
			placeholder: '請輸入評分',
			min: 0,
			max: 5,
			step: 0.1,
			width: 'half'
		},
		{
			key: 'joinDate',
			label: '加入日期',
			type: 'date',
			placeholder: '請選擇加入日期',
			width: 'half'
		},
		{
			key: 'lastActivity',
			label: '最後活動日期',
			type: 'date',
			placeholder: '請選擇最後活動日期',
			width: 'half'
		},
		{
			key: 'skills',
			label: '技能標籤',
			type: 'tags',
			placeholder: '輸入技能標籤',
			width: 'full'
		},
		{
			key: 'workAreas',
			label: '可工作地區',
			type: 'tags',
			placeholder: '輸入工作地區',
			width: 'full'
		},
		{
			key: 'status',
			label: '用戶狀態',
			type: 'select',
			placeholder: '請選擇用戶狀態',
			options: ['active', 'inactive', 'suspended'],
			width: 'full'
		}
	],
	values: {}
});

// 彈出層顯示狀態
const showPicker = ref<Record<string, boolean>>({});

// 日期選擇器的值
const datePickerValues = ref<Record<string, string[]>>({});

// 下拉選擇器的值
const selectPickerValues = ref<Record<string, string[]>>({});

// 新標籤輸入
const newTagInput = ref<Record<string, string>>({});

// 監聽 props 變化，初始化表單數據
watch(
	() => props.userData,
	(newData) => {
		if (newData) {
			formConfig.value.values = {
				name: newData.name || '',
				position: newData.position || '',
				phone: newData.phone || '',
				email: newData.email || '',
				experience: newData.experience || 0,
				rating: newData.rating || 0,
				joinDate: newData.joinDate || '',
				lastActivity: newData.lastActivity || '',
				skills: [...(newData.skills || [])],
				workAreas: [...(newData.workAreas || [])],
				status: newData.status || 'active'
			};
		} else {
			// 新增模式，初始化空值
			formConfig.value.values = {
				name: '',
				position: '',
				phone: '',
				email: '',
				experience: 0,
				rating: 0,
				joinDate: '',
				lastActivity: '',
				skills: [],
				workAreas: [],
				status: 'active'
			};
		}
	},
	{ immediate: true, deep: true }
);

// 方法：獲取選擇器欄位
const getPickerColumns = (field: FormField) => {
	if (field.type === 'select' && field.options) {
		return field.options.map(option => ({
			text: getStatusDisplayText(option),
			value: option
		}));
	}
	return [];
};

// 方法：獲取狀態顯示文字
const getStatusDisplayText = (status: string) => {
	const statusMap = {
		'active': '啟用',
		'inactive': '停用',
		'suspended': '停權'
	};
	return statusMap[status as keyof typeof statusMap] || status;
};
// 方法：獲取顯示文字
const getDisplayText = (field: FormField, value: string | number | string[]) => {
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

	if (field.type === 'select') {
		return getStatusDisplayText(value as string);
	}

	if (field.type === 'tags') {
		return Array.isArray(value) ? value.join(', ') : '';
	}

	return value.toString();
};

// 方法：顯示選擇器
const showPickerForField = (key: string) => {
	const field = formConfig.value.fields.find(f => f.key === key);
	if (!field) return;

	if (field.type === 'date') {
		const currentValue = formConfig.value.values[key];
		if (currentValue) {
			let date;
			if (typeof currentValue === 'string') {
				if (currentValue.includes('/')) {
					const [year, month, day] = currentValue.split('/');
					date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
				} else if (currentValue.includes('-')) {
					date = new Date(currentValue);
				} else {
					date = new Date(currentValue);
				}
			} else {
				date = new Date(currentValue as unknown as string);
			}

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
	} else if (field.type === 'select') {
		const currentValue = formConfig.value.values[key];
		selectPickerValues.value[key] = [Array.isArray(currentValue) ? currentValue[0] : (currentValue as string)];
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

// 方法：處理下拉選擇器確認
const handleSelectPickerConfirm = (field: FormField) => {
	const selectedValues = selectPickerValues.value[field.key];
	if (selectedValues && selectedValues.length > 0) {
		handleInputChange(field, selectedValues[0]);
	}
	hidePickerForField(field.key);
};

// 方法：處理輸入框變更
const handleInputChange = (field: FormField, value: string | number | string[]) => {
	formConfig.value.values[field.key] = value;
};

// 方法：添加標籤
const addTag = (key: string) => {
	const input = newTagInput.value[key];
	if (input && input.trim()) {
		const currentTags = formConfig.value.values[key] as string[];
		if (!currentTags.includes(input.trim())) {
			currentTags.push(input.trim());
		}
		newTagInput.value[key] = '';
	}
};

// 方法：移除標籤
const removeTag = (key: string, tag: string) => {
	const currentTags = formConfig.value.values[key] as string[];
	const index = currentTags.indexOf(tag);
	if (index > -1) {
		currentTags.splice(index, 1);
	}
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

// 方法：處理儲存
const handleSave = () => {
	if (formConfig.value && formConfig.value.values) {
		emit('save', formConfig.value.values);
		handleClose();
	}
};
</script>

<style lang="scss">
.edit-user-dialog {
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

.edit-user-dialog {
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

	&__text-input,
	&__number-input,
	&__date-input,
	&__select-input {
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

	&__tags-container {
		display: flex;
		flex-direction: column;
		gap: $spacing-xs;
	}

	&__tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-xs;
		min-height: 32px;
		padding: $spacing-xs;
		background: $color-gray-3;
		border: 1px solid $color-gray-200;
		border-radius: $border-radius-base;
	}

	&__tag {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		padding: $spacing-xs $spacing-8;
		background: $color-white;
		color: $color-text-primary;
		border: 1px solid $color-gray-200;
		border-radius: $border-radius-base;
		font-size: $font-size-xs;
		cursor: pointer;

		&:hover {
			background: $color-gray-100;
		}
	}

	&__tag-input {
		:deep(.van-field__control) {
			font-size: $font-size-sm;
			color: $color-text-primary;
			padding: $spacing-8 $spacing-16;
			background: $color-white;
			border: 1px solid $color-gray-200;
			border-radius: $border-radius-base;

			&::placeholder {
				color: $color-text-secondary;
			}
		}

		:deep(.van-field__body) {
			padding: 0;
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

	&__save-btn {
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
