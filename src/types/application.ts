// 應徵記錄相關類型定義

export interface ApplicationRecord {
	id: string;
	date: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endTime: string; // HH:mm
	position: string; // 職位名稱
	location: string; // 地點名稱
	address: string; // 地址
	appliedAt: string; // 投遞時間
	status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'; // 應徵狀態
	resultMessage?: string; // 結果提示訊息
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export type FilterTab = 'all' | 'pending' | 'accepted' | 'rejected' | 'withdrawn';
