chrome.runtime.onInstalled.addListener(() => {
    console.log('Extensão de Relatórios Pedagógicos instalada');
    
    chrome.storage.sync.get(['apiKey', 'turma', 'idade', 'professora', 'periodoPadrao'], (result) => {
        if (!result.apiKey) {
            chrome.runtime.openOptionsPage();
        }

    });
});
 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openOptions') {
        chrome.runtime.openOptionsPage();
    }

});