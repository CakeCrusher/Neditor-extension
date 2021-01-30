const tabId = chrome.devtools.inspectedWindow.tabId
let backgroundRequestUrls = []
let allRequests = []
let requestsToShow = []
let blockedUrlObjects = []
let parsedBlockedUrls = []
let thisTabUrl
let filtersToShow
let nedit