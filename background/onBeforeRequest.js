
chrome.webRequest.onBeforeRequest.addListener((request) => {
    if (activated && request.url.slice(0,19) !== 'chrome-extension://') {
        // handle request info
        if (allNeditsById[request.tabId]) {
            chrome.runtime.sendMessage({to: request.tabId, msgType: 'backgroundRequestUrl', requestUrl: request.url}, (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
            if (blockRequest(allNeditsById[request.tabId], request)) {
                return {cancel: true}
            } else {
                return {cancel: false}
            }
        }
    }
}, {urls: ['<all_urls>']}, ['blocking'])