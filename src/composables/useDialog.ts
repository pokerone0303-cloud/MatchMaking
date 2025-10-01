import { showDialog, showConfirmDialog } from 'vant';

/**
 * Dialog 整合方法
 * 提供統一的提示窗口和確認窗口功能
 */
export function useDialog() {
	/**
	 * 提示窗口 - 僅有確認按鈕
	 * @param options 對話框選項
	 * @returns Promise<void>
	 */
	const showAlert = (options: {
		title?: string;
		message: string;
		confirmButtonText?: string;
		confirmButtonColor?: string;
	}) => {
		return showDialog({
			title: options.title || '提示',
			message: options.message,
			showCancelButton: false,
			confirmButtonText: options.confirmButtonText || '確認',
			confirmButtonColor: options.confirmButtonColor || '#2F80ED',
		});
	};

	/**
	 * 確認窗口 - 具有確認和取消按鈕
	 * @param options 對話框選項
	 * @returns Promise<boolean> - true: 確認, false: 取消
	 */
	const showConfirm = (options: {
		title?: string;
		message: string;
		confirmButtonText?: string;
		cancelButtonText?: string;
		confirmButtonColor?: string;
		cancelButtonColor?: string;
	}): Promise<boolean> => {
		return showConfirmDialog({
			title: options.title || '確認',
			message: options.message,
			confirmButtonText: options.confirmButtonText || '確認',
			cancelButtonText: options.cancelButtonText || '取消',
			confirmButtonColor: options.confirmButtonColor || '#2F80ED',
			cancelButtonColor: options.cancelButtonColor || '#909399',
		})
			.then(() => true) // 用戶點擊確認
			.catch(() => false); // 用戶點擊取消或關閉
	};

	/**
	 * 成功提示
	 * @param message 提示訊息
	 * @param title 標題
	 */
	const showSuccess = (message: string, title = '成功') => {
		return showAlert({
			title,
			message,
			confirmButtonColor: '#27AE60',
		});
	};

	/**
	 * 錯誤提示
	 * @param message 提示訊息
	 * @param title 標題
	 */
	const showError = (message: string, title = '錯誤') => {
		return showAlert({
			title,
			message,
			confirmButtonColor: '#EB5757',
		});
	};

	/**
	 * 警告提示
	 * @param message 提示訊息
	 * @param title 標題
	 */
	const showWarning = (message: string, title = '警告') => {
		return showAlert({
			title,
			message,
			confirmButtonColor: '#F2994A',
		});
	};

	/**
	 * 危險操作確認
	 * @param message 確認訊息
	 * @param title 標題
	 */
	const showDangerConfirm = (message: string, title = '危險操作') => {
		return showConfirm({
			title,
			message,
			confirmButtonText: '確認刪除',
			cancelButtonText: '取消',
			confirmButtonColor: '#EB5757',
			cancelButtonColor: '#909399',
		});
	};

	return {
		showAlert,
		showConfirm,
		showSuccess,
		showError,
		showWarning,
		showDangerConfirm,
	};
}
