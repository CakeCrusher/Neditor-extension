chrome.tabs.onUpdated.addListener((tabId, info) => {
    // on the start of page load
    if (info.status === 'loading') {
        chrome.runtime.sendMessage({to: 'all', resetRequests: true})
        allRequestsPerId[tabId] = []
    }
})