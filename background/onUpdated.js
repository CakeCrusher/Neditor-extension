chrome.tabs.onUpdated.addListener((_tabId, info, tabInfo) => {
    // on the start of page load
    if (
        (info.status === 'loading' && !info.url && allProgressById[tabInfo.id] !== 'loading') ||
        (info.status === 'loading' && info.url)
    ) {
        // gets the users nedit for this url from storage
        chrome.tabs.query({}, (tabs) => {
            chrome.runtime.sendMessage(
                {to: tabInfo.id, msgType: 'reload', resetRequests: true},
            (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
            
            const tabLoading = tabs.find(tab => tab.id === tabInfo.id)
            let tabLoadingUrl
            if (info.url) {
                tabLoadingUrl = info.url
            } else {
                tabLoadingUrl = tabLoading.pendingUrl ? tabLoading.pendingUrl : tabLoading.url
            }

            if (
                tabLoadingUrl &&
                allProgressById[tabInfo.id] !== 'loading' &&
                activated
            ) {
                automaticNeditHandler(tabLoadingUrl)
            }
            allProgressById[tabInfo.id] = 'loading'


            chrome.storage.sync.get([urlRoot(tabLoadingUrl)], (result) => {
                if (!emptyNedit(result[urlRoot(tabLoadingUrl)])) {
                    allNeditsById[tabInfo.id] = result[urlRoot(tabLoadingUrl)]
                    clearStorage(allNeditsById[tabInfo.id], tabLoadingUrl)
                } else {
                    allNeditsById[tabInfo.id] = {name: null, filters: [], urls: [], storage: false}
                    // insert automatic blocking condition and actions here
                }
                allBlockedUrlsById[tabInfo.id] = []
                allRequestsById[tabInfo.id] = []
                prepareNotification(allNeditsById[tabInfo.id], tabLoadingUrl, tabInfo.id)
                setIcon(tabInfo.id)
                console.log(allNeditsById[tabInfo.id]);
                saveNedit(allNeditsById[tabInfo.id], tabLoadingUrl)
            })
        })
        
        sendDataPackage()
    }
    if (tabInfo.status === 'complete' && allProgressById[tabInfo.id] === 'loading') {
        allProgressById[tabInfo.id] = 'complete'
        setIcon(tabInfo.id)
    }
})