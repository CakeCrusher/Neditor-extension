chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.to === 'popup' || msg.to === urlRoot(thisTabUrl) || msg.to === 'all') {
        if (msg.msgType === 'dataPackage') {
            thisTabUrl = msg.thisTabUrl
            nedit = msg.nedit
            activated = msg.activated
            automaticNedit = msg.automaticNedit
            recommendationWords = msg.recommendationWords
            savedNedits = msg.savedNedits
            initiateAfterDataPackage(msg)
        }
        if (msg.msgType === 'neditUpdate') {
            nedit = msg.nedit
            displayClearNedit(nedit, clearNeditButton)
            setCurrentNeditName(nedit, neditNameElement)
        }
        if (msg.msgType === 'newNeditorActive') {
            activated = msg.active
            onToggleNeditor(msg.active, content, deactivatedContent)
        }
        if (msg.msgType === 'newAutomaticNedit') {
            automaticNedit = msg.automaticNedit
            setAutomaticNedit(msg.automaticNedit)
        }
        if (msg.msgType === 'newRecommendationWords') {
            recommendationWords = msg.recommendationWords
            setRecommendationWords(msg.recommendationWords)
        }
    }
})