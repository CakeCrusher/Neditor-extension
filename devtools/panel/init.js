const tabId = chrome.devtools.inspectedWindow.tabId
let backgroundRequestUrls = []
let allRequests = []
let requestsToShow = []
let thisTabUrl
let filtersToShow
let nedit