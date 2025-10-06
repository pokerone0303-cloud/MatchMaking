// SheetDetailsDialog 配置範例
import type { DialogConfig } from '@/types/dialog';

// 範例 1: 時數記錄詳細資料（預設配置）
export const timesheetConfig: DialogConfig = {
	title: '工時詳細資料',
	blocks: [
		{
			type: 'section',
			title: '基本資訊',
			items: [
				{ label: '工時單號', value: 'TS20240913' },
				{ label: '工作日期', value: '2024/09/13' },
				{ label: '工作時間', value: '20:00 - 02:00' },
				{ label: '商家', value: '金沙會館' },
				{ label: '地點', value: '台北中山店 台北市中山區' },
				{ label: '職位', value: '百家樂荷官' }
			]
		},
		{
			type: 'section',
			title: '工時統計',
			items: [
				{ label: '正常工時', value: '6 小時', valueClass: 'text-blue' },
				{ label: '加班工時', value: '0 小時', valueClass: 'text-orange' },
				{ label: '總工時', value: '6 小時', valueClass: 'text-blue' }
			]
		},
		{
			type: 'section',
			title: '薪資計算',
			items: [
				{ label: '基本時薪', value: '$600' },
				{ label: '加班時薪', value: '$900' },
				{ label: '基本薪資', value: '$3600' },
				{ label: '加班薪資', value: '$0' },
				{ label: '總薪資', value: '$3600', valueClass: 'text-green' }
			]
		},
		{
			type: 'section',
			title: '狀態資訊',
			items: [
				{ label: '狀態', value: '待審核', valueClass: 'status-pending' },
				{ label: '記錄時間', value: '2024/9/14 上午8:20:00' }
			]
		},
		{
			type: 'highlight',
			title: '職位要求',
			content: '五年以上經驗',
			contentClass: 'highlight-requirement'
		},
		{
			type: 'remark',
			title: '備註',
			content: '深夜班,客流量較大',
			contentClass: 'remark-content'
		}
	]
};

// 範例 2: 應徵記錄詳細資料
export const applicationConfig: DialogConfig = {
	title: '應徵詳細資料',
	blocks: [
		{
			type: 'section',
			title: '基本資訊',
			items: [
				{ label: '應徵編號', value: 'APP20240913' },
				{ label: '申請日期', value: '2024/09/10' },
				{ label: '工作日期', value: '2024/09/13' },
				{ label: '工作時間', value: '20:00 - 02:00' },
				{ label: '商家', value: '金沙會館' },
				{ label: '職位', value: '百家樂荷官' }
			]
		},
		{
			type: 'section',
			title: '應徵狀態',
			items: [
				{ label: '狀態', value: '待審', valueClass: 'status-pending' },
				{ label: '申請時間', value: '2024/9/10 下午2:30:00' },
				{ label: '審核時間', value: '-' },
				{ label: '審核人員', value: '-' }
			]
		},
		{
			type: 'highlight',
			title: '職位要求',
			content: '五年以上經驗，具備良好溝通能力',
			contentClass: 'highlight-requirement'
		},
		{
			type: 'remark',
			title: '備註',
			content: '深夜班,客流量較大，需要輪班',
			contentClass: 'remark-content'
		}
	]
};

// 範例 3: 簡化版配置
export const simpleConfig: DialogConfig = {
	title: '簡化詳細資料',
	blocks: [
		{
			type: 'section',
			title: '基本資訊',
			items: [
				{ label: '編號', value: 'TS001' },
				{ label: '日期', value: '2024/09/13' },
				{ label: '狀態', value: '已確認', valueClass: 'status-approved' }
			]
		},
		{
			type: 'remark',
			title: '說明',
			content: '這是一個簡化版的配置範例',
			contentClass: 'remark-content'
		}
	]
};

// 範例 4: 自訂樣式配置
export const customStyleConfig: DialogConfig = {
	title: '自訂樣式範例',
	blocks: [
		{
			type: 'section',
			title: '重要資訊',
			items: [
				{ label: '緊急聯絡人', value: '張三', valueClass: 'text-red' },
				{ label: '聯絡電話', value: '0912-345-678', valueClass: 'text-blue' },
				{ label: '備用電話', value: '02-1234-5678', valueClass: 'text-green' }
			]
		},
		{
			type: 'highlight',
			title: '重要提醒',
			content: '請務必在指定時間前到達工作地點',
			contentClass: 'highlight-requirement'
		},
		{
			type: 'remark',
			title: '注意事項',
			content: '請攜帶身分證件及相關證照',
			contentClass: 'remark-content'
		}
	]
};
