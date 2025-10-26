// 篩選相關類型定義

export interface FilterOption {
	text: string;
	value: string | number;
}

export interface FilterField {
	type: 'search' | 'select' | 'date' | 'number' | 'text';
	key: string;
	label: string;
	placeholder?: string;
	options?: FilterOption[];
	width?: 'half' | 'full';
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
}

export interface FilterConfig {
	fields: FilterField[];
	values: Record<string, string | number>;
}

export type FilterFieldType = 'search' | 'select' | 'date' | 'number' | 'text';
