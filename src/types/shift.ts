// Shift 班別類型定義
export interface Shift {
	id: string;
	date: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endTime: string; // HH:mm
	title: string;
	location: string;
	address?: string;
	wage: number;
	quota: number;
	appliedCount: number;
	employerId: string;
	status: 'open' | 'closed' | 'filled' | 'draft';
	deadline?: string;
	description?: string;
	requirements?: string[];
	benefits?: string[];
	contactPerson?: string;
	contactPhone?: string;
	contactEmail?: string;
	trafficInfo?: string;
}

// 班別狀態映射
export const SHIFT_STATUS_MAP = {
	open: { text: '開放', class: 'status-open' },
	closed: { text: '已關閉', class: 'status-closed' },
	filled: { text: '額滿', class: 'status-filled' },
	draft: { text: '草稿', class: 'status-draft' }
} as const;

// 班別篩選條件
export interface ShiftFilters {
	date?: string;
	location?: string;
	position?: string;
	status?: string;
	wageRange?: {
		min: number;
		max: number;
	};
}

// 班別查詢參數
export interface ShiftQueryParams {
	page?: number;
	limit?: number;
	filters?: ShiftFilters;
	sortBy?: 'date' | 'wage' | 'createdAt';
	sortOrder?: 'asc' | 'desc';
}
