chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.to === tabId || (msg.to === urlRoot(thisTabUrl) && msg.except !== tabId) || msg.to === 'all') {
        if (msg.resetRequests) {
            allRequests = []
            testRequests = []
            resetTables([networkTableData])
        }
        // if dataPackage is sent
        if (msg.thisTabUrl) {
            thisTabUrl = msg.thisTabUrl
            nedit = msg.nedit
        }
        if (msg.requestUrl) {
            backgroundRequestUrls.push(msg.requestUrl)
        }
        if (msg.newNedit) {
            console.log('nedit updated thanks to newNedit');
            nedit = msg.newNedit
        }
    }
})