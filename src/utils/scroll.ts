/**
 * 滾動相關工具函數
 */

/**
 * 滾動到頁面頂部
 * 同時處理 window 和可能的 content 容器
 */
export const scrollToTop = () => {
	// 滾動 window
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});

	// 滾動 content 容器
	const contentElement = document.querySelector('.content');
	if (contentElement) {
		contentElement.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
};

/**
 * 立即滾動到頂部（不使用動畫）
 */
export const scrollToTopImmediate = () => {
	window.scrollTo(0, 0);
	const contentElement = document.querySelector('.content');
	if (contentElement) {
		contentElement.scrollTo(0, 0);
	}
};

