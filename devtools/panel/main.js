// provides profound requests
chrome.devtools.network.onRequestFinished.addListener((request) => {
    allRequests.push(request)
    // add row to network table
    addRowToTable(networkTableColumn, networkTableData, request)
})

console.log('sending message');
chrome.runtime.sendMessage({needDataPackage: true})

// core columns added
addColumn('block')
addColumn('url')