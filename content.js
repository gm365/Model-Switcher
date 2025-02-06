// 添加初始化日志
console.log('AI Studio Model Switcher 插件已加载');

// 定义默认模型名称
const DEFAULT_MODEL_NAME = 'Gemini 2.0 Flash Thinking Experimental 01-21';
let TARGET_MODEL_NAME = DEFAULT_MODEL_NAME; // 初始化为默认值

// 创建通知样式
const style = document.createElement('style');
style.textContent = `
    .model-switcher-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(66, 133, 244, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .model-switcher-notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    .model-switcher-notification.hide {
        opacity: 0;
        transform: translateY(20px);
    }
`;
document.head.appendChild(style);

// 创建通知函数
function showNotification(message) {
    // 移除可能存在的旧通知
    const oldNotification = document.querySelector('.model-switcher-notification');
    if (oldNotification) {
        oldNotification.remove();
    }

    // 创建新通知元素
    const notification = document.createElement('div');
    notification.className = 'model-switcher-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // 3秒后开始淡出
    setTimeout(() => {
        notification.classList.add('hide');
        // 动画完成后移除元素
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 从 chrome.storage 中读取保存的模型名称
chrome.storage.sync.get('selectedModel', (data) => {
    if (data.selectedModel) {
        TARGET_MODEL_NAME = data.selectedModel;
        console.log('已加载用户选择的模型: ' + TARGET_MODEL_NAME);
    } else {
        console.log('使用默认模型: ' + TARGET_MODEL_NAME);
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations, observerInstance) => {
        // 1. 找到 mat-select 元素
        const matSelect = document.querySelector('#mat-select-0');
        if (matSelect) {
            console.log('mat-select 元素已出现:', matSelect);
            switchModel(matSelect);
            observerInstance.disconnect(); // 找到元素后停止监听
        }
    });

    // 开始监听 document.body 的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 定义一个函数来尝试切换模型
    function switchModel(matSelect) {
        console.log('尝试切换模型...');

        // 检查当前选中的模型
        const currentModelText = matSelect.textContent.trim();
        console.log('当前模型:', currentModelText);

        // 如果当前已经是目标模型，则不需要切换
        if (currentModelText.includes(TARGET_MODEL_NAME)) {
            console.log('当前已经是目标模型，无需切换');
            showNotification(`✓ 已经是 ${TARGET_MODEL_NAME} 模型`);
            return;
        }

        // 2. 模拟点击打开下拉菜单
        console.log('点击打开下拉菜单');
        matSelect.click();

        // 3. 等待下拉菜单展开并找到目标选项
        setTimeout(() => {
            // 更新选择器：尝试多个可能的选择器
            const modelOptions = document.querySelectorAll('mat-option, .mat-option, [role="option"]');
            console.log('找到的选项数量:', modelOptions.length);

            // 打印所有选项的文本内容进行调试
            modelOptions.forEach((option, index) => {
                console.log(`选项 ${index + 1}:`, option.textContent.trim());
            });

            let targetOption = null;
            for (let modelOption of modelOptions) {
                const optionText = modelOption.textContent.trim();
                console.log('检查选项:', optionText);
                if (optionText.includes(TARGET_MODEL_NAME)) {
                    targetOption = modelOption;
                    break;
                }
            }

            if (targetOption) {
                // 4. 模拟点击目标选项
                console.log('找到目标选项，执行点击');
                targetOption.click();
                console.log(`已成功切换到模型: ${TARGET_MODEL_NAME}`);
                // 显示成功通知
                showNotification(`✓ 已切换到 ${TARGET_MODEL_NAME} 模型`);
            } else {
                console.error(`找不到目标模型: "${TARGET_MODEL_NAME}"`);
                // 打印当前可见的下拉菜单内容
                const dropdown = document.querySelector('.mat-select-panel, .cdk-overlay-pane');
                if (dropdown) {
                    console.log('下拉菜单内容:', dropdown.innerHTML);
                } else {
                    console.log('未找到下拉菜单元素');
                }
                // 关闭下拉菜单
                document.body.click();
                // 显示错误通知
                showNotification('❌ 未找到目标模型');
            }
        }, 1500);
    }
}); 