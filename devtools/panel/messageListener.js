chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.to === tabId || msg.to === urlRoot(thisTabUrl) || msg.to === 'all') {
        if (msg.msgType === 'reload') {
            allRequests = []
            testRequests = []
            blockedUrlObjects = []
            parsedBlockedUrls = []
            resetTables([networkTableData])
            makeBlockedTable()
        }
        // if dataPackage is sent
        if (msg.msgType === 'dataPackage') {
            thisTabUrl = msg.thisTabUrl
            nedit = msg.nedit
            filtersToShow = msg.nedit.filters
            makeFilterTable()
            initiateStorageState()
            activateAfterNedit()
        }
        if (msg.msgType === 'backgroundRequestUrl') {
            backgroundRequestUrls.push(msg.requestUrl)
        }
        if (msg.msgType === 'neditUpdate') {
            nedit = msg.nedit
            filterTable()

        }
        if (msg.msgType === 'blockedUrl') {
            blockedUrlObjects.push(msg)
            parsedBlockedUrls = parseBlockedUrls(nedit)
            makeBlockedTable()
        }
    }
})