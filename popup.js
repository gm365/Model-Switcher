document.addEventListener('DOMContentLoaded', function () {
    const modelItems = document.querySelectorAll('.model-item');
    const versionElement = document.querySelector('.version');

    // 从 manifest.json 获取版本号
    const manifestVersion = chrome.runtime.getManifest().version;
    versionElement.textContent = `v${manifestVersion}`;

    // 从存储中读取已保存的模型名称并高亮显示
    chrome.storage.sync.get('selectedModel', function (data) {
        if (data.selectedModel) {
            modelItems.forEach(item => {
                if (item.dataset.model === data.selectedModel) {
                    item.classList.add('selected');
                }
            });
        }
    });

    // 为每个模型选项添加点击事件
    modelItems.forEach(item => {
        item.addEventListener('click', function () {
            const selectedModel = this.dataset.model;

            // 移除其他项的选中状态
            modelItems.forEach(item => item.classList.remove('selected'));
            // 添加当前项的选中状态
            this.classList.add('selected');

            // 保存选择并关闭弹窗
            chrome.storage.sync.set({ 'selectedModel': selectedModel }, function () {
                console.log('模型已保存: ' + selectedModel);
                window.close();
            });
        });
    });
}); 