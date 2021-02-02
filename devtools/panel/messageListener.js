chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.to === tabId || msg.to === urlRoot(thisTabUrl) || msg.to === 'all') {
        if (msg.msgType === 'reload') {
            allRequests = []
            testRequests = []
            blockedUrlObjects = []
            parsedBlockedUrls = []
            backgroundRequestUrls = []
            const container = document.getElementById('state_container')
            hideStateAlert(container)
            setNeditFromData(nedit, thisTabUrl)
            resetTables([networkTableData])
            makeBlockedTable()
            setRequestCount()
            setBlockedCount()
        }
        // if dataPackage is sent
        if (msg.msgType === 'dataPackage') {
            thisTabUrl = msg.thisTabUrl
            nedit = msg.nedit
            activated = msg.activated
            filtersToShow = msg.nedit.filters
            setNeditFromData(nedit, thisTabUrl)
            makeFilterTable()
            initiateCurrentNeditName()
            initiateStorageState()
            activateAfterNedit()
        }
        if (msg.msgType === 'newNeditorActive') {
            activated = msg.active
            setNeditActivated()
        }
        if (msg.msgType === 'backgroundRequestUrl') {
            backgroundRequestUrls.push(msg.requestUrl)
            setRequestCount()
        }
        if (msg.msgType === 'neditUpdate') {
            if (msg.brandNew) {
                filtersToShow = msg.nedit.filters
            }
            nedit = msg.nedit
            initiateCurrentNeditName()
            filterTable()
            displayClearNedit(nedit, clearNeditButton)
            makeFilterTable()
        }
        if (msg.msgType === 'blockedUrl') {
            blockedUrlObjects.push(msg)
            parsedBlockedUrls = parseBlockedUrls(nedit)
            makeBlockedTable()
            setBlockedCount()
        }
        if (msg.msgType === 'setState') {
            const container = document.getElementById('state_container')
            const title = document.getElementById('state_title')
            const content = document.getElementById('state_content_container')
            stateAlert(msg.state, container, title, content)
        } 
    }
})