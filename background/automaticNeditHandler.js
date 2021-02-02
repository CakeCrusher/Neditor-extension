const setAutomaticNedit = async (passedAutomaticNedit, passedRecommendationWords, passedSavedNedits, tabUrl) => {
    const rawUrlNetworkEdits = await fetchGraphQL(`
    query{
        urlNetworkEdits(
          url: "${urlRoot(tabUrl)}"
        ){
          name
          uses
          _id
        }
      }
    `)
    const allNeditDataThisUrl = rawUrlNetworkEdits.data.urlNetworkEdits


    let chosenNeditData
    if (passedAutomaticNedit === 'most popular') {
        chosenNeditData = allNeditDataThisUrl[0]
    }
    if (passedAutomaticNedit === 'recommended') {
        const recommendedNedits = filterByRecommendationWords(passedRecommendationWords, allNeditDataThisUrl)
        chosenNeditData = recommendedNedits[0]
    }
    if (!chosenNeditData) {
        return false
    }
    const rawFindNetworkEdit = await fetchGraphQL(`
        query{
            findNetworkEdit(
            id: "${chosenNeditData._id}"
            ){
            name
            urls
            storage
            filters
            _id
            }
        }
    `)
    const findNetworkEdit = rawFindNetworkEdit.data.findNetworkEdit
    
    const newNedit = responseDataToNedit(findNetworkEdit, passedSavedNedits)

    const neditToSet = {}
    neditToSet[urlRoot(tabUrl)] = newNedit
    chrome.storage.sync.set(neditToSet)

    setTimeout(() => {
        chrome.tabs.create({url: tabUrl})
    }, 1000)
}
const automaticNeditHandler = (tabUrl) => {
    chrome.storage.sync.get(['automaticNedit', urlRoot(tabUrl), 'recommendationWords', 'savedNedits'], (result) => {
        if (
            result.automaticNedit &&
            emptyNedit(result[urlRoot(tabUrl)])
        ) {
            setAutomaticNedit(result.automaticNedit, result.recommendationWords, result.savedNedits, tabUrl)
        }
        
    })
}