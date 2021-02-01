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
            setCurrentNeditName()
            initiateStorageState()
            activateAfterNedit()
        }
        if (msg.msgType === 'backgroundRequestUrl') {
            if (msg.requestUrl.includes('css')) {
                console.log('msg.requestUrl: ', msg.requestUrl)
            }
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
        if (msg.msgType === 'setState') {
            const container = document.getElementById('state_container')
            const title = document.getElementById('state_title')
            const content = document.getElementById('state_content_container')
            stateAlert(msg.state, container, title, content)
        } 
    }
})