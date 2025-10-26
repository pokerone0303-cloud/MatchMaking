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

// 應徵者資料介面（商家端使用）
export interface Applicant {
	id: string;
	name: string;
	position: string;
	shiftDate: string;
	startTime: string;
	endTime: string;
	experience: number;
	rating: number;
	skills: string[];
	workAreas: string[]; // 可工作地區
	phone: string;
	email: string;
	applicationTime: string;
	status: 'pending' | 'accepted' | 'rejected'; // 應徵狀態：待審、已錄取、已拒絕
	totalHours: number; // 總工時
	joinDate: string; // 加入日期
	lastActivity: string; // 最後活動日期
}

// 系統用戶資料介面（管理端使用）
export interface User {
	id: string;
	name: string;
	position: string;
	shiftDate: string;
	startTime: string;
	endTime: string;
	experience: number;
	rating: number;
	skills: string[];
	workAreas: string[]; // 可工作地區
	phone: string;
	email: string;
	applicationTime: string;
	status: 'active' | 'inactive' | 'suspended'; // 用戶系統狀態：啟用、停用、停權
	totalHours: number; // 總工時
	joinDate: string; // 加入日期
	lastActivity: string; // 最後活動日期
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export type FilterTab = 'all' | 'pending' | 'accepted' | 'rejected' | 'withdrawn';
