// 時數記錄相關類型定義

export interface TimesheetRecord {
	id: string;
	date: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endTime: string; // HH:mm
	breakDuration: number; // 休息時間（分鐘）
	location: string;
	address: string;
	shiftId: string;
	workingHours: number; // 工作時數
	adjustedHours?: number; // 調整後時數
	originalHours?: number; // 原始時數
	status: 'submitted' | 'approved' | 'adjusted'; // 審核狀態
	auditNote?: string; // 審核備註
}

export type TimesheetStatus = 'submitted' | 'approved' | 'adjusted';
