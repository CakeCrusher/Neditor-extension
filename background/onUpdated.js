chrome.tabs.onUpdated.addListener((_tabId, _info, tabInfo) => {
    // console.log('tabId: ', tabId)
    // console.log('info: ', info)
    // on the start of page load
    if (tabInfo.status === 'loading' && allProgressById[tabInfo.id] !== 'loading') {
        allProgressById[tabInfo.id] = 'loading'
        // gets the users nedit for this url from storage
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const tabLoading = tabs.find(tab => tab.id === tabInfo.id)
            const tabLoadingUrl = tabLoading.pendingUrl ? tabLoading.pendingUrl : tabLoading.url
            chrome.storage.sync.get([urlRoot(tabLoadingUrl)], (result) => {
                if (result[urlRoot(tabLoadingUrl)]) {
                    allNeditsById[tabInfo.id] = result[urlRoot(tabLoadingUrl)]
                    clearStorage(allNeditsById[tabInfo.id], tabLoadingUrl)
                } else {
                    allNeditsById[tabInfo.id] = {name: null, filters: [], urls: [], storage: false}
                    // insert automatic blocking condition and actions here
                }
                allBlockedUrlsById[tabInfo.id] = []
                allRequestsById[tabInfo.id] = []
                setIcon(tabInfo.id)
            })
        })
        chrome.runtime.sendMessage({to: 'all', msgType: 'reload', resetRequests: true}, (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
        sendDataPackage()
    }
    if (tabInfo.status === 'complete' && allProgressById[tabInfo.id] === 'loading') {
        allProgressById[tabInfo.id] = 'complete'
        setIcon(tabInfo.id)
    }
})