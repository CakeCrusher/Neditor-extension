// provides profound requests
chrome.devtools.network.onRequestFinished.addListener((request) => {
    if (request.request.url.includes('css')) {
        console.log('request.request.url: ', request.request.url)
    }
    allRequests.push(request)
    // add row to network table
    addRowToTable(networkTableColumn, networkTableData, request)
})

chrome.runtime.sendMessage({needDataPackage: true})

// core columns added
addColumn('block')
addColumn('url')