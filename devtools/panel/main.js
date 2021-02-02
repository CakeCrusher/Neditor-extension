// provides profound requests
chrome.devtools.network.onRequestFinished.addListener((request) => {
    allRequests.push(request)
    setRequestCount()
    filterTable()
})

chrome.runtime.sendMessage({needDataPackage: true})

// core columns added
addColumn('block')
addColumn('url')