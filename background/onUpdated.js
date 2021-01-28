chrome.tabs.onUpdated.addListener((tabId, info) => {
    // on the start of page load
    if (info.status === 'loading') {
        chrome.runtime.sendMessage({to: 'all', resetRequests: true}, (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
        allRequestsPerId[tabId] = []
        sendDataPackage()
    }
})