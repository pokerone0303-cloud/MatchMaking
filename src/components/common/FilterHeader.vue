<script setup lang="ts">
import { ref } from 'vue';
import type { FilterConfig, FilterField } from '@/types/filter';

interface Props {
	title: string;
	searchPlaceholder?: string;
	filterConfig: FilterConfig;
	sticky?: boolean;
}

// 定義 props
const props = withDefaults(defineProps<Props>(), {
	searchPlaceholder: '搜尋商家、職位或應徵編號',
	sticky: true
});

// 定義 emits
const emit = defineEmits<{
	updateFilter: [key: string, value: string | number];
	search: [value: string];
	toggleFilter: [];
	reset: [];
}>();

// 篩選選單展開狀態
const isFilterExpanded = ref(false);

// 搜尋輸入值
const searchValue = ref('');

// 彈出層顯示狀態
const showPicker = ref<Record<string, boolean>>({});

// 選擇器的值
const pickerValues = ref<Record<string, (string | number)[]>>({});

// 日期選擇器的值
const datePickerValues = ref<Record<string, string[]>>({});

// 方法：切換篩選選單
const toggleFilter = () => {
	isFilterExpanded.value = !isFilterExpanded.value;
	emit('toggleFilter');
};

// 方法：處理搜尋
const handleSearch = (value: string) => {
	emit('search', value);
};

// 方法：處理篩選變更
const handleFilterChange = (key: string, value: string | number) => {
	emit('updateFilter', key, value);
};

// 方法：重置篩選
const handleReset = () => {
	searchValue.value = '';
	emit('reset');
};

// 方法：顯示選擇器
const showPickerForField = (key: string) => {
	const field = props.filterConfig.fields.find(f => f.key === key);
	if (!field) return;

	if (field.type === 'select') {
		// 初始化選擇器的值為當前值（轉換為數組格式）
		const currentValue = props.filterConfig.values[key];
		pickerValues.value[key] = [currentValue];
	} else if (field.type === 'date') {
		// 初始化日期選擇器的值（轉換為數組格式）
		const currentValue = props.filterConfig.values[key];
		if (currentValue) {
			const date = new Date(currentValue);
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
	}

	showPicker.value[key] = true;
};

// 方法：隱藏選擇器
const hidePickerForField = (key: string) => {
	showPicker.value[key] = false;
};

// 方法：獲取選項顯示文字
const getDisplayText = (field: FilterField, value: string | number) => {
	// 檢查值是否存在且不為空
	if (!value && value !== 0) {
		return field.placeholder || field.label;
	}

	if (field.type === 'select' && field.options) {
		const option = field.options.find(opt => opt.value === value);
		return option?.text || field.placeholder || field.label;
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

	if (field.type === 'number') {
		return value.toString();
	}

	if (field.type === 'text') {
		return value.toString();
	}

	return field.placeholder || field.label;
};

// 方法：處理選擇器確認
const handlePickerConfirm = (field: FilterField) => {
	const selectedValues = pickerValues.value[field.key];
	const selectedValue = selectedValues && selectedValues.length > 0 ? selectedValues[0] : null;
	if (selectedValue !== null) {
		handleFilterChange(field.key, selectedValue);
	}
	hidePickerForField(field.key);
};

// 方法：處理選擇器取消
const handlePickerCancel = (field: FilterField) => {
	hidePickerForField(field.key);
};

// 方法：處理日期選擇器確認
const handleDatePickerConfirm = (field: FilterField) => {
	const selectedValues = datePickerValues.value[field.key];
	if (selectedValues && selectedValues.length >= 3) {
		const [year, month, day] = selectedValues;
		const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
		handleFilterChange(field.key, dateString);
	}
	hidePickerForField(field.key);
};

// 方法：處理輸入框變更
const handleInputChange = (field: FilterField, value: string | number) => {
	handleFilterChange(field.key, value);
};

</script>

<template>
	<div :class="['filter-header', { 'filter-header--sticky': sticky }]">
		<!-- 返回按鈕 + 頁面標題 -->
		<div class="filter-header__nav">
			<van-nav-bar :title="title" left-arrow @click-left="$router.back()" class="filter-header__nav-bar" />
		</div>

		<!-- 搜尋框 + 搜尋按鈕 + 篩選按鈕 -->
		<div class="filter-header__search-section">
			<div class="filter-header__search-wrapper">
				<van-search v-model="searchValue" :placeholder="searchPlaceholder" @search="handleSearch"
					@clear="() => handleSearch('')" class="filter-header__search" />
				<van-button type="primary" size="small" class="filter-header__search-btn" @click="handleSearch(searchValue)">
					搜尋
				</van-button>
			</div>

			<van-button :type="isFilterExpanded ? 'primary' : 'default'" size="small" class="filter-header__filter-btn"
				@click="toggleFilter">
				<van-icon name="filter" class="filter-header__filter-icon" />
				篩選
			</van-button>
		</div>

		<!-- 展開收合的篩選選單 -->
		<div :class="['filter-header__filter-panel', { 'filter-header__filter-panel--expanded': isFilterExpanded }]">
			<div class="filter-header__filter-content">
				<!-- 篩選欄位網格 -->
				<div class="filter-header__filter-grid">
					<template v-for="field in filterConfig.fields" :key="field.key">
						<!-- 選擇器類型 -->
						<div v-if="field.type === 'select'" class="filter-header__filter-item filter-header__filter-item--input"
							:class="`filter-header__filter-item--${field.width || 'half'}`">
							<van-field :model-value="getDisplayText(field, filterConfig.values[field.key])"
								:placeholder="field.placeholder || field.label" readonly is-link @click="showPickerForField(field.key)"
								class="filter-header__select-input" />
						</div>

						<!-- 日期選擇器類型 -->
						<div v-else-if="field.type === 'date'" class="filter-header__filter-item filter-header__filter-item--input"
							:class="`filter-header__filter-item--${field.width || 'half'}`">
							<van-field :model-value="getDisplayText(field, filterConfig.values[field.key])"
								:placeholder="field.placeholder || field.label" readonly is-link @click="showPickerForField(field.key)"
								class="filter-header__date-input" />
						</div>

						<!-- 數字輸入框類型 -->
						<div v-else-if="field.type === 'number'"
							class="filter-header__filter-item filter-header__filter-item--input"
							:class="`filter-header__filter-item--${field.width || 'half'}`">
							<van-field :model-value="filterConfig.values[field.key]" type="number"
								:placeholder="field.placeholder || field.label" :min="field.min" :max="field.max" :step="field.step"
								@update:model-value="(value) => handleInputChange(field, value)" class="filter-header__number-input" />
						</div>

						<!-- 文字輸入框類型 -->
						<div v-else-if="field.type === 'text'" class="filter-header__filter-item filter-header__filter-item--input"
							:class="`filter-header__filter-item--${field.width || 'half'}`">
							<van-field :model-value="filterConfig.values[field.key]" type="text"
								:placeholder="field.placeholder || field.label"
								@update:model-value="(value) => handleInputChange(field, value)" class="filter-header__text-input" />
						</div>
					</template>
				</div>

				<!-- 操作按鈕 -->
				<div class="filter-header__filter-actions">
					<van-button type="default" size="small" class="filter-header__reset-btn" @click="handleReset">
						重置
					</van-button>
				</div>
			</div>
		</div>

		<!-- 動態生成的選擇器 -->
		<template v-for="field in filterConfig.fields" :key="`picker-${field.key}`">
			<!-- 選擇器彈出層 -->
			<van-popup v-if="field.type === 'select'" v-model:show="showPicker[field.key]" position="bottom" destroy-on-close
				round>
				<van-picker v-model="pickerValues[field.key]" :columns="field.options || []"
					@confirm="() => handlePickerConfirm(field)" @cancel="() => handlePickerCancel(field)" />
			</van-popup>

			<!-- 日期選擇器彈出層 -->
			<van-popup v-else-if="field.type === 'date'" v-model:show="showPicker[field.key]" position="bottom"
				destroy-on-close round>
				<van-date-picker v-model="datePickerValues[field.key]" @confirm="() => handleDatePickerConfirm(field)"
					@cancel="() => hidePickerForField(field.key)" />
			</van-popup>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.filter-header {
	background: $color-white;
	border-bottom: 1px solid $color-gray-2;
	box-shadow: $shadow-sm;

	&--sticky {
		position: sticky;
		top: 0;
		z-index: $z-index-sticky;
	}

	&__nav-bar {
		:deep(.van-nav-bar__title) {
			font-size: $font-size-lg;
			font-weight: $font-weight-semibold;
			color: $color-text-primary;
		}

		:deep(.van-nav-bar__left) {
			color: $color-text-primary;
		}
	}

	&__search-section {
		display: flex;
		align-items: center;
		gap: $spacing-12;
		padding: $spacing-16;
	}

	&__search-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
		gap: $spacing-8;
	}

	&__search {
		flex: 1;

		:deep(.van-search__content) {
			background: $color-gray-3;
			border-radius: $border-radius-base;
			border: 1px solid $color-gray-2;
		}

		:deep(.van-field__control) {
			font-size: $font-size-base;
			color: $color-text-primary;

			&::placeholder {
				color: $color-text-secondary;
			}
		}
	}

	&__search-btn {
		font-size: $font-size-sm;
		height: 32px;
		padding: 0 $spacing-12;
		flex-shrink: 0;
	}

	&__filter-btn {
		font-size: $font-size-sm;
		height: 32px;
		padding: 0 $spacing-12;
		display: flex;
		align-items: center;
		gap: $spacing-4;
	}

	&__filter-icon {
		font-size: $font-size-sm;
	}

	&__filter-panel {
		height: 0;
		overflow: hidden;
		transition: height 0.3s ease;
		background: $color-white;
		border-top: 1px solid $color-gray-2;

		&--expanded {
			height: auto;
		}
	}

	&__filter-content {
		padding: $spacing-16;
	}

	&__filter-grid {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-12;
		margin-bottom: $spacing-16;
	}

	&__filter-item {
		flex: 0 0 calc(50% - 6px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-12 $spacing-16;
		background: $color-white;
		border: 1px solid $color-gray-2;
		border-radius: $border-radius-base;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			border-color: $color-primary;
		}

		&:active {
			background: $color-gray-3;
		}

		&--full {
			flex: 1 1 100%;
		}

		&--half {
			flex: 0 0 calc(50% - 6px);
		}

		&--input {
			cursor: default;
			padding: 0;

			&:hover {
				border-color: $color-gray-2;
			}

			&:active {
				background: $color-white;
			}
		}
	}

	&__number-input,
	&__text-input,
	&__select-input,
	&__date-input {
		:deep(.van-field__control) {
			font-size: $font-size-sm;
			color: $color-text-primary;
			padding: $spacing-12 $spacing-16;
			background: transparent;
			border: none;
			outline: none;

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

	&__filter-text {
		font-size: $font-size-sm;
		color: $color-text-primary;
		font-weight: $font-weight-medium;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__filter-arrow {
		font-size: $font-size-xs;
		color: $color-text-secondary;
		margin-left: $spacing-8;
		flex-shrink: 0;
	}

	&__filter-actions {
		display: flex;
		gap: $spacing-12;
		padding-top: $spacing-16;
		border-top: 1px solid $color-gray-2;
	}

	&__reset-btn,
	&__apply-btn {
		flex: 1;
		height: 40px;
		font-size: $font-size-base;
		font-weight: $font-weight-medium;
		border-radius: $border-radius-base;
	}

	&__reset-btn {
		background: $color-gray-3;
		color: $color-text-secondary;
		border: 1px solid $color-gray-2;
	}

	&__apply-btn {
		background: $color-primary;
		color: $color-white;
		border: none;
	}
}

// 響應式設計
@media (min-width: 768px) {
	.filter-header {
		&__search-section {
			padding: $spacing-20;
		}

		&__filter-content {
			padding: $spacing-20;
		}

		&__filter-grid {
			gap: $spacing-16;
		}

		&__filter-item {
			flex: 0 0 calc(50% - 8px);
			padding: $spacing-16 $spacing-20;
		}

		&__filter-text {
			font-size: $font-size-base;
		}
	}
}

// 小螢幕時，篩選欄位改為全寬
@media (max-width: 480px) {
	.filter-header {
		&__filter-item {
			flex: 1 1 100%;
		}
	}
}
</style>
