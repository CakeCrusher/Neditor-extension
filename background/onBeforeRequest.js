
chrome.webRequest.onBeforeRequest.addListener((request) => {
    if (activated && request.url.slice(0,19) !== 'chrome-extension://') {
        // handle request info
        if (request.url.includes('css')) {
            console.log('request.url: ', request.url)
        }
        if (!emptyNedit(allNeditsById[request.tabId])) {
            chrome.runtime.sendMessage({to: request.tabId, msgType: 'backgroundRequestUrl', requestUrl: request.url}, (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
            allRequestsById[request.tabId].push(request)
            if (blockRequest(allNeditsById[request.tabId], request)) {
                if (allBlockedUrlsById[request.tabId]) {
                    allBlockedUrlsById[request.tabId].push(request.url)
                }
                return {cancel: true}
            } else {
                return {cancel: false}
            }
        }
    }
}, {urls: ['<all_urls>']}, ['blocking'])