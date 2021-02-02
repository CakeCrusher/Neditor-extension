chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.needDataPackage) {
        sendDataPackage(msg.isPopup)
    }
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (Object.keys(changes).includes('activated')) {
        activated = changes.activated.newValue
        chrome.runtime.sendMessage(
            {to: 'all', msgType: 'newNeditorActive', active: changes.activated.newValue},
        (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
    } else if (Object.keys(changes).includes('savedNedits')) {

    } else if (Object.keys(changes).includes('recommendationWords')) {
        recommendationWords = changes.recommendationWords.newValue
        chrome.runtime.sendMessage(
            {to: 'all', msgType: 'newRecommendationWords', recommendationWords: changes.recommendationWords.newValue},
        (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
    } else if (Object.keys(changes).includes('automaticNedit')) {
        automaticNedit = changes.automaticNedit.newValue
        chrome.runtime.sendMessage(
            {to: 'all', msgType: 'newAutomaticNedit', automaticNedit: changes.automaticNedit.newValue},
        (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
    } else if (Object.keys(changes).includes('darkMode')) {

    } else {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const rootUrl = urlRoot(tabs[0].url)
            const newNedit = changes[rootUrl].newValue

            if (newNedit.name && emptyNedit(newNedit)) {
                newNedit.name = null

                const neditToSet = {}
                neditToSet[rootUrl] = newNedit
                chrome.storage.sync.set(neditToSet)
            }
            
            chrome.runtime.sendMessage(
                {to: rootUrl, msgType: 'neditUpdate', nedit: newNedit},
            (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
        })
    }
    
})