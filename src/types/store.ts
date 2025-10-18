export interface Store {
	id: string;
	name: string;
	code: string; // 商家編號，如 #E001
	manager: string; // 經理姓名
	email: string;
	phone: string;
	address: string; // 公司地址
	taxId: string; // 統編
	locationCount: number; // 據點數
	locations: string[]; // 營業據點
	publishedShifts: number; // 發布班別數
	successfulHires: number; // 成功錄取數
	joinDate: string; // 加入日期
	status: 'active' | 'inactive' | 'suspended';
	createdAt: string;
	updatedAt: string;
}

export interface StoreFormData {
	name: string;
	code: string;
	manager: string;
	email: string;
	phone: string;
	address: string;
	taxId: string;
	locations: string[];
	status: 'active' | 'inactive' | 'suspended';
}
