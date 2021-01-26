chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.to === tabId || msg.to === 'all') {
        if (msg.resetRequests) {
            allRequests = []
        }
        // when recieve requests
        if (msg.request) {
            allRequests.push(msg.request)
            console.log(allRequests.length);
            // add row to network table
            // addRowToTable(networkTableColumn, networkTableData, msg.request)
        }
    }
})