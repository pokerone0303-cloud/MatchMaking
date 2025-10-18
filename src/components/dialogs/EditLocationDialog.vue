<template>
	<van-dialog :show="show" :show-cancel-button="false" :show-confirm-button="false" class="edit-store-dialog"
		@close="handleClose" @update:show="(value) => emit('update:show', value)">
		<div class="dialog-title">
			<van-icon name="notes-o" size="16" color="black" />
			<h3 class="dialog-title-text">
				{{ mode === 'add' ? '新增據點' : '編輯據點' }}
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
							<van-field :model-value="formConfig.values[field.key]" type="text"
								:placeholder="field.placeholder || field.label"
								@update:model-value="(value) => handleInputChange(field, value)"
								class="edit-store-dialog__text-input" />
						</div>

						<!-- 數字輸入框類型 -->
						<div v-else-if="field.type === 'number'" class="edit-store-dialog__form-item"
							:class="`edit-store-dialog__form-item--${field.width || 'half'}`">
							<label class="edit-store-dialog__label">{{ field.label }}</label>
							<van-field :model-value="formConfig.values[field.key]" type="number"
								:placeholder="field.placeholder || field.label" :min="field.min" :max="field.max" :step="field.step"
								@update:model-value="(value) => handleInputChange(field, value)"
								class="edit-store-dialog__number-input" />
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
				<van-button type="primary" size="small" class="edit-store-dialog__update-btn" @click="handleUpdate">
					{{ mode === 'add' ? '新增' : '更新' }}
				</van-button>
				<van-button type="default" size="small" class="edit-store-dialog__cancel-btn" @click="handleCancel">
					取消
				</van-button>
			</div>
		</div>

		<!-- 動態生成的選擇器 -->
		<template v-for="field in formConfig.fields" :key="`picker-${field.key}`">
			<!-- 下拉選擇器彈出層 -->
			<van-popup v-if="field.type === 'select'" v-model:show="showPicker[field.key]" position="bottom" destroy-on-close
				round>
				<van-picker v-model="pickerValues[field.key]" :columns="field.options || []"
					@confirm="() => handlePickerConfirm(field)" @cancel="() => hidePickerForField(field.key)" />
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
	type: 'text' | 'number' | 'select';
	placeholder?: string;
	width?: 'half' | 'full';
	min?: number;
	max?: number;
	step?: number;
	options?: { text: string; value: string }[];
}

// 表單配置類型
interface FormConfig {
	fields: FormField[];
	values: Record<string, string | number>;
}

// Props 定義
interface Props {
	show: boolean;
	mode?: 'add' | 'edit';
	storeData?: {
		name: string;
		address: string;
		contactPerson: string;
		phone: string;
		capacity: number;
		email: string;
		operatingHours: string;
		facilities: string;
		remarks: string;
		status: string;
	};
}

const props = withDefaults(defineProps<Props>(), {
	mode: 'edit',
	storeData: () => ({
		name: '',
		address: '',
		contactPerson: '',
		phone: '',
		capacity: 0,
		email: '',
		operatingHours: '',
		facilities: '',
		remarks: '',
		status: 'operating'
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
			key: 'name',
			label: '據點名稱',
			type: 'text',
			placeholder: '請輸入據點名稱',
			width: 'full'
		},
		{
			key: 'city',
			label: '城市',
			type: 'select',
			placeholder: '請選擇城市',
			width: 'half',
			options: [
				{ text: '台北市', value: 'taipei' },
				{ text: '新北市', value: 'newtaipei' },
				{ text: '桃園市', value: 'taoyuan' },
				{ text: '台中市', value: 'taichung' },
				{ text: '台南市', value: 'tainan' },
				{ text: '高雄市', value: 'kaohsiung' }
			]
		},
		{
			key: 'district',
			label: '行政區',
			type: 'select',
			placeholder: '請選擇行政區',
			width: 'half',
			options: [
				{ text: '信義區', value: 'xinyi' },
				{ text: '板橋區', value: 'banqiao' },
				{ text: '中壢區', value: 'zhongli' },
				{ text: '西區', value: 'west' },
				{ text: '東區', value: 'east' },
				{ text: '前金區', value: 'qianjin' }
			]
		},
		{
			key: 'address',
			label: '地址',
			type: 'text',
			placeholder: '請輸入完整地址',
			width: 'full'
		},
		{
			key: 'contactPerson',
			label: '負責人',
			type: 'text',
			placeholder: '請輸入負責人姓名',
			width: 'full'
		},
		{
			key: 'phone',
			label: '電話',
			type: 'text',
			placeholder: '請輸入電話號碼',
			width: 'half'
		},
		{
			key: 'capacity',
			label: '容納人數',
			type: 'number',
			placeholder: '請輸入容納人數',
			min: 1,
			step: 1,
			width: 'half'
		},
		{
			key: 'email',
			label: '信箱',
			type: 'text',
			placeholder: '請輸入電子信箱',
			width: 'full'
		},
		{
			key: 'operatingHours',
			label: '營業時間',
			type: 'text',
			placeholder: '請輸入營業時間',
			width: 'full'
		},
		{
			key: 'facilities',
			label: '提供設施',
			type: 'text',
			placeholder: '請輸入提供設施',
			width: 'full'
		},
		{
			key: 'remarks',
			label: '備註',
			type: 'text',
			placeholder: '請輸入備註',
			width: 'full'
		}
	],
	values: {}
});

// 彈出層顯示狀態
const showPicker = ref<Record<string, boolean>>({});

// 選擇器的值
const pickerValues = ref<Record<string, string[]>>({});

// 監聽 props 變化，初始化表單數據
watch(
	[() => props.storeData, () => props.mode],
	([newData, mode]) => {
		if (mode === 'add') {
			// 新增模式：使用預設值
			formConfig.value.values = {
				name: '',
				city: 'taipei',
				district: 'xinyi',
				address: '',
				contactPerson: '',
				phone: '',
				capacity: 0,
				email: '',
				operatingHours: '',
				facilities: '',
				remarks: ''
			};
		} else if (newData) {
			// 編輯模式：使用傳入的資料
			formConfig.value.values = {
				name: newData.name || '',
				city: 'taipei',
				district: 'xinyi',
				address: newData.address || '',
				contactPerson: newData.contactPerson || '',
				phone: newData.phone || '',
				capacity: newData.capacity || 0,
				email: newData.email || '',
				operatingHours: newData.operatingHours || '',
				facilities: newData.facilities || '',
				remarks: newData.remarks || ''
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

	if (field.type === 'select') {
		const option = field.options?.find(opt => opt.value === value);
		return option ? option.text : field.placeholder || field.label;
	}

	return value.toString();
};

// 方法：顯示選擇器
const showPickerForField = (key: string) => {
	const field = formConfig.value.fields.find(f => f.key === key);
	if (!field) return;

	if (field.type === 'select') {
		const currentValue = formConfig.value.values[key];
		pickerValues.value[key] = [(currentValue as string) || (field.options?.[0]?.value || '')];
	}

	showPicker.value[key] = true;
};

// 方法：隱藏選擇器
const hidePickerForField = (key: string) => {
	showPicker.value[key] = false;
};

// 方法：處理選擇器確認
const handlePickerConfirm = (field: FormField) => {
	const selectedValue = pickerValues.value[field.key];
	handleInputChange(field, selectedValue[0] || '');
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
	}

	&__text-input,
	&__number-input,
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
