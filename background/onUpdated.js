chrome.tabs.onUpdated.addListener((tabId, info) => {
    // on the start of page load
    if (info.status === 'loading') {
        // gets the users nedit for this url from storage
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const tabLoading = tabs.find(tab => tab.id === tabId)
            const tabLoadingUrl = tabLoading.pendingUrl ? tabLoading.pendingUrl : tabLoading.url
            chrome.storage.sync.get([urlRoot(tabLoadingUrl)], (result) => {
                if (result[urlRoot(tabLoadingUrl)]) {
                    allNeditsById[tabId] = result[urlRoot(tabLoadingUrl)]
                    clearStorage(allNeditsById[tabId], tabLoadingUrl)
                } else {
                    allNeditsById[tabId] = {}
                    // insert automatic blocking condition and actions here
                }
            })
        })
        chrome.runtime.sendMessage({to: 'all', msgType: 'reload', resetRequests: true}, (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
        allRequestsById[tabId] = []
        sendDataPackage()
    }
})