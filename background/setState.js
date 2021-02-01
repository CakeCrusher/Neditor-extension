const setState = (state, tabId) => {
    chrome.runtime.sendMessage({
        to: tabId, msgType: 'setState', state
    }, (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
    chrome.browserAction.setIcon({
        path: state.path,
        tabId: tabId
    })
}

const urlHasBeenBlocked = (url, blockedUrls) => {
    if (blockedUrls.includes(url)) {
        return true
    } else {
        return false
    }
}

const requestWasMadeWithUrl = (url, allRequests) => {
    const requestUrls = allRequests.map(request => request.url)
    if (requestUrls.includes(url)) {
        return true
    } else {
        return false
    }
}
const neditStates = [
    {
        id: 'Working', path: './icons/icon16-v-y.png', containerStyle: 'background-color: #FBBC05;', tips: [
            'If the nedit did not work as expected, hard refresh (Ctrl + Shift + R)',
            'Check the blocked requests table to see what was blocked.'
        ]
    },{
        id: 'Success', path: './icons/icon16-v-g.png', containerStyle: 'background-color: #34A853;', tips: [
            'Nedit was successfully executed!',
        ]
    },{
        id: 'Nedits!', path: './icons/icon16-v-N.png', containerStyle: 'background-color: #EA4335;', tips: [
            'There are nedits avalilable check them out!',
        ]
    }
]

const setIcon = (tabId) => {
    const currentNedit = allNeditsById[tabId]
    const currentRequests = allRequestsById[tabId]
    const currentBlockedUrls = allBlockedUrlsById[tabId]
    const currentProgress = allProgressById[tabId]

    if (emptyNedit(currentNedit)) {
        const stateToSet = neditStates.find(state => state.id === 'Nedits!')

        setState(stateToSet, tabId)
    } else {
        const neditUrlsBlocked = []
        for (const url of currentNedit.urls) {
            if (urlHasBeenBlocked(url, currentBlockedUrls)) {
                neditUrlsBlocked.push(url)
            } else if (currentProgress === 'complete' && !requestWasMadeWithUrl(url, currentRequests)) {
                neditUrlsBlocked.push(url)
            }
        }
        if (neditUrlsBlocked.length === currentNedit.urls.length) {
            const stateToSet = neditStates.find(state => state.id === 'Success')
            setState(stateToSet, tabId)
        } else {
            const stateToSet = neditStates.find(state => state.id === 'Working')
            setState(stateToSet, tabId)
        }

    }
}