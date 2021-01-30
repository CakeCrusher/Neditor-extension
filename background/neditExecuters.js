const blockRequest = (nedit, request) => {
    const requestUrl = request.url

    if (nedit) {
        for (const filter of nedit.filters) {
            if (requestUrl.includes(filter)) {
                chrome.runtime.sendMessage(
                    {to: request.tabId, msgType: 'blockedUrl', blockedUrl: requestUrl, by: 'filter', which: filter}
                )
                return true
            }
        }
    
        if (nedit.urls.includes(requestUrl)) {
            chrome.runtime.sendMessage(
                {to: request.tabId, msgType: 'blockedUrl', blockedUrl: requestUrl, by: 'specificUrl', which: requestUrl}
            )
            return true
        }
    }
    return false
}

const clearStorage = (nedit, tabUrl) => {
    if (nedit.storage) {
        chrome.browsingData.remove({
            "origins": [tabUrl]
        }, {
            "cacheStorage": true,
            "cookies": true,
            "fileSystems": true,
            "indexedDB": true,
            "localStorage": true,
            "serviceWorkers": true,
            "webSQL": true,
        }, () => console.log('cleared storage'))
    }    
}