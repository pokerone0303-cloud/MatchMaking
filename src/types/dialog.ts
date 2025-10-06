// 對話框相關類型定義

// 區塊項目類型
export interface DialogItem {
	label: string;
	value: string;
	valueClass?: string; // 可選的樣式類別
}

// 區塊類型
export type DialogBlockType = 'section' | 'highlight' | 'remark';

// 對話框區塊配置
export interface DialogBlock {
	type: DialogBlockType;
	title: string;
	items?: DialogItem[]; // 一般區塊和重點區域使用
	content?: string; // 備註區塊使用
	contentClass?: string; // 備註內容的樣式類別
}

// 對話框配置
export interface DialogConfig {
	title: string;
	blocks: DialogBlock[];
}

// 狀態配置
export interface StatusConfig {
	text: string;
	class: string;
}

// 狀態映射
export const STATUS_MAP: Record<string, StatusConfig> = {
	submitted: { text: '待審核', class: 'status-pending' },
	approved: { text: '已核准', class: 'status-approved' },
	adjusted: { text: '已調整', class: 'status-adjusted' },
	pending: { text: '待審', class: 'status-pending' },
	accepted: { text: '錄取', class: 'status-accepted' },
	rejected: { text: '未錄取', class: 'status-rejected' },
	withdrawn: { text: '撤回', class: 'status-withdrawn' }
};
