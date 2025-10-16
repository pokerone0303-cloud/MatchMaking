// 時數記錄相關類型定義

export interface TimesheetRecord {
	id: string;
	applicantId: string;
	applicantName: string;
	position: string; // 職位
	date: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endTime: string; // HH:mm
	declaredHours: number; // 申報時數
	breakDuration: number; // 休息時間（分鐘）
	location: string;
	address: string;
	shiftId: string;
	workingHours: number; // 工作時數
	adjustedHours?: number; // 調整後時數
	originalHours?: number; // 原始時數
	dealerNote?: string; // 荷官備註
	auditNote?: string; // 審核備註
	submittedAt: string; // 提交時間
	phone: string; // 聯絡電話
	email: string; // 電子郵件
	status: 'submitted' | 'approved' | 'adjusted' | 'pending' | 'accepted' | 'rejected' | 'withdrawn'; // 審核狀態
}

export type TimesheetStatus = 'submitted' | 'approved' | 'adjusted' | 'pending' | 'accepted' | 'rejected' | 'withdrawn';
