chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.needDataPackage) {
        sendDataPackage()
    }
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log(changes);
    if (Object.keys(changes).includes('activated')) {
        neditorActive = changes.activated.newValue
    } else if (Object.keys(changes).includes('savedNedits')) {

    } else if (Object.keys(changes).includes('recommendationWords')) {

    } else if (Object.keys(changes).includes('automaticNedit')) {

    } else if (Object.keys(changes).includes('darkMode')) {

    } else {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const rootUrl = urlRoot(tabs[0].url)
            chrome.runtime.sendMessage({to: rootUrl, msgType: 'neditUpdate', nedit: changes[rootUrl].newValue})
        })
    }
    
})