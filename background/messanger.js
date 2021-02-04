const sendDataPackage = (isPopup = false) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let nedit
        initializeStorage(urlRoot(tabs[0].url), {name: null, filters: [], urls: [], storage: false}, (res) => {
            nedit = res
            const sendTo = isPopup ? 'popup' : tabs[0].id
            chrome.runtime.sendMessage(
                {
                    to: sendTo,
                    msgType: 'dataPackage',
                    thisTabUrl: tabs[0].url,
                    nedit,
                    activated,
                    automaticNedit,
                    recommendationWords,
                    savedNedits
                },
            (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
        })
    })
}
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.needDataPackage) {
        sendDataPackage(msg.isPopup)
    }
})

