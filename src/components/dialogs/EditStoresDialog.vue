<template>
	<van-dialog :show="show" :show-cancel-button="false" :show-confirm-button="false" class="edit-store-dialog"
		@close="handleClose" @update:show="(value) => emit('update:show', value)" :close-on-click-overlay="true">
		<div class="dialog-title">
			<van-icon name="shop-o" size="16" color="black" />
			<h3 class="dialog-title-text">
				{{ isEdit ? '編輯商家' : '新增商家' }}
			</h3>
			<!-- 關閉按鈕 icon:x -->
			<div class="close-button" @click="$emit('update:show', false)">
				<van-icon name="close" size="16" color="black" />
			</div>
		</div>

		<div class="edit-store-dialog__content">
			<!-- 表單內容 -->
			<div class="edit-store-dialog__form">
				<div class="edit-store-dialog__form-grid">
					<template v-for="field in formConfig.fields" :key="field.key">
						<!-- 文字輸入框類型 -->
						<div v-if="field.type === 'text'" class="edit-store-dialog__form-item"
							:class="`edit-store-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-store-dialog__label">{{ field.label }}</label>
							<van-field :model-value="formConfig.values[field.key] as string" type="text"
								:placeholder="field.placeholder || field.label"
								@update:model-value="(value) => handleInputChange(field, value)"
								class="edit-store-dialog__text-input" />
						</div>

						<!-- 多選標籤類型 -->
						<div v-else-if="field.type === 'tags'" class="edit-store-dialog__form-item"
							:class="`edit-store-dialog__form-item--${field.width || 'full'}`">
							<label class="edit-store-dialog__label">{{ field.label }}</label>
							<div class="edit-store-dialog__tags-container">
								<div class="edit-store-dialog__tags-list">
									<span v-for="tag in (formConfig.values[field.key] as string[])" :key="tag"
										class="edit-store-dialog__tag">
										{{ tag }}
										<van-icon name="cross" size="12" @click="removeTag(field.key, tag as string)" />
									</span>
								</div>
								<div class="edit-store-dialog__tag-input-container">
									<van-field v-model="newTagInput[field.key]" type="text" :placeholder="field.placeholder || '輸入標籤'"
										@keyup.enter="addTag(field.key)" class="edit-store-dialog__tag-input"
										:ref="(el) => setTagInputRef(field.key, el)" />
									<!-- 新增 TAG 按鈕 -->
									<button class="edit-store-dialog__add-tag-btn" @click="addTag(field.key)">
										<van-icon name="plus" size="12" />
										新增
									</button>
								</div>
							</div>
						</div>

						<!-- 下拉選擇器類型 -->
						<div v-else-if="field.type === 'select'" class="edit-store-dialog__form-item"
							:class="`edit-store-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-store-dialog__label">{{ field.label }}</label>
							<van-field :model-value="getDisplayText(field, formConfig.values[field.key])"
								:placeholder="field.placeholder || field.label" readonly @click="showPickerForField(field.key)"
								class="edit-store-dialog__select-input" />
						</div>
					</template>
				</div>
			</div>

			<!-- 操作按鈕 -->
			<div class="edit-store-dialog__actions">
				<van-button type="primary" size="small" class="edit-store-dialog__save-btn" @click="handleSave">
					{{ isEdit ? '更新' : '新增' }}
				</van-button>
				<van-button type="default" size="small" class="edit-store-dialog__cancel-btn" @click="handleCancel">
					取消
				</van-button>
			</div>
		</div>

		<!-- 動態生成的選擇器 -->
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
import type { Store, StoreFormData } from '@/types/store';

// 表單欄位配置類型
interface FormField {
	key: string;
	label: string;
	type: 'text' | 'tags' | 'select';
	placeholder?: string;
	width?: 'half' | 'full';
	options?: string[]; // 用於 select 類型
}

// 表單配置類型
interface FormConfig {
	fields: FormField[];
	values: Record<string, string | string[]>;
}

// Props 定義
interface Props {
	show: boolean;
	storeData?: Store;
}

const props = withDefaults(defineProps<Props>(), {
	storeData: undefined
});

// Emits 定義
const emit = defineEmits<{
	'update:show': [value: boolean];
	save: [data: StoreFormData];
	cancel: [];
}>();

// 計算屬性：分離不同類型的欄位
const selectFields = computed(() => formConfig.value.fields.filter(field => field.type === 'select'));

// 計算屬性：是否為編輯模式
const isEdit = computed(() => !!props.storeData);

// 表單配置
const formConfig = ref<FormConfig>({
	fields: [
		{
			key: 'name',
			label: '商家名稱',
			type: 'text',
			placeholder: '請輸入商家名稱',
			width: 'half'
		},
		{
			key: 'code',
			label: '商家編號',
			type: 'text',
			placeholder: '請輸入商家編號',
			width: 'half'
		},
		{
			key: 'manager',
			label: '經理姓名',
			type: 'text',
			placeholder: '請輸入經理姓名',
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
			key: 'phone',
			label: '電話號碼',
			type: 'text',
			placeholder: '請輸入電話號碼',
			width: 'half'
		},
		{
			key: 'address',
			label: '公司地址',
			type: 'text',
			placeholder: '請輸入公司地址',
			width: 'full'
		},
		{
			key: 'taxId',
			label: '統編',
			type: 'text',
			placeholder: '請輸入統編',
			width: 'half'
		},
		{
			key: 'locations',
			label: '營業據點',
			type: 'tags',
			placeholder: '輸入據點名稱',
			width: 'full'
		},
		{
			key: 'status',
			label: '狀態',
			type: 'select',
			placeholder: '選擇狀態',
			options: ['active', 'inactive', 'suspended'],
			width: 'full'
		}
	],
	values: {}
});

// 彈出層顯示狀態
const showPicker = ref<Record<string, boolean>>({});

// 下拉選擇器的值
const selectPickerValues = ref<Record<string, string[]>>({});

// 新標籤輸入
const newTagInput = ref<Record<string, string>>({});

// 標籤輸入框的 ref
const tagInputRefs = ref<Record<string, any>>({});

// 監聽 props 變化，初始化表單數據
watch(
	() => props.storeData,
	(newData) => {
		if (newData) {
			formConfig.value.values = {
				name: newData.name || '',
				code: newData.code || '',
				manager: newData.manager || '',
				email: newData.email || '',
				phone: newData.phone || '',
				address: newData.address || '',
				taxId: newData.taxId || '',
				locations: [...(newData.locations || [])],
				status: newData.status || 'active'
			};
		} else {
			// 新增模式，初始化空值
			formConfig.value.values = {
				name: '',
				code: '',
				manager: '',
				email: '',
				phone: '',
				address: '',
				taxId: '',
				locations: [],
				status: 'active'
			};
		}

		// 初始化標籤輸入框
		formConfig.value.fields.forEach(field => {
			if (field.type === 'tags') {
				newTagInput.value[field.key] = '';
			}
		});
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
const getDisplayText = (field: FormField, value: string | string[]) => {
	if (!value && value !== '') {
		return field.placeholder || field.label;
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

	if (field.type === 'select') {
		const currentValue = formConfig.value.values[key];
		selectPickerValues.value[key] = [Array.isArray(currentValue) ? currentValue[0] : (currentValue as string)];
	}

	showPicker.value[key] = true;
};

// 方法：隱藏選擇器
const hidePickerForField = (key: string) => {
	showPicker.value[key] = false;
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
const handleInputChange = (field: FormField, value: string | string[]) => {
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

// 方法：設置標籤輸入框 ref
const setTagInputRef = (key: string, el: any) => {
	if (el) {
		tagInputRefs.value[key] = el;
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
		const formData: StoreFormData = {
			name: formConfig.value.values.name as string,
			code: formConfig.value.values.code as string,
			manager: formConfig.value.values.manager as string,
			email: formConfig.value.values.email as string,
			phone: formConfig.value.values.phone as string,
			address: formConfig.value.values.address as string,
			taxId: formConfig.value.values.taxId as string,
			locations: formConfig.value.values.locations as string[],
			status: formConfig.value.values.status as 'active' | 'inactive' | 'suspended'
		};
		emit('save', formData);
		handleClose();
	}
};
</script>

<style lang="scss">
.edit-store-dialog {
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

.edit-store-dialog {
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

	&__tag-input-container {
		display: flex;
		gap: $spacing-xs;
		align-items: center;
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

	&__add-tag-btn {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		padding: $spacing-8 $spacing-12;
		background: $color-primary;
		color: $color-white;
		border: none;
		border-radius: $border-radius-base;
		font-size: $font-size-xs;
		font-weight: $font-weight-medium;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
		flex-shrink: 0;
	}

	&__tag-input {
		flex: 1;

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
