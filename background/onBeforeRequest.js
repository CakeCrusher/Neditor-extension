
chrome.webRequest.onBeforeRequest.addListener((request) => {
    if (activated && request.url.slice(0,19) !== 'chrome-extension://') {
        // handle request info
        if (allRequestsPerId[request.tabId]) {
            allRequestsPerId[request.tabId].push(request)
            chrome.runtime.sendMessage({to: request.tabId, requestUrl: request.url}, (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
        }
    }
}, {urls: ['<all_urls>']}, ['blocking'])