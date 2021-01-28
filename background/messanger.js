chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.needDataPackage) {
        sendDataPackage()
    }
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (Object.keys(changes).includes('activated')) {
        neditorActive = changes.activated.newValue
    } else if (Object.keys(changes).includes('savedNedits')) {

    } else if (Object.keys(changes).includes('recommendationWords')) {

    } else if (Object.keys(changes).includes('automaticNedit')) {

    } else if (Object.keys(changes).includes('darkMode')) {
        
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            console.log(tabs[0].url);
            const rootUrl = urlRoot(tabs[0].url)
            chrome.runtime.sendMessage({to: rootUrl, except: tabs[0].id, newNedit: changes[rootUrl].newValue})
        })
    }
    
})