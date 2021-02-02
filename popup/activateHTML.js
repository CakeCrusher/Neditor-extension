const neditorActiveCheckbox = document.getElementById('extension_toggle')
neditorActiveCheckbox.onclick = () => toggleNeditor(neditorActiveCheckbox.checked)

const content = document.getElementById('popup_content')
const deactivatedContent = document.getElementById('deactivated_content')

const clearNeditButton = document.getElementById('clear_nedit_button')
const neditNameElement = document.getElementById('current_edit')

const setNeditFromId = async (id, savedNedits) => {
    const gqlResult = await fetchGraphQL(`
        query{
            findNetworkEdit(
            id: "${id}"
            ){
            name
            urls
            storage
            filters
            _id
            }
        }
    `)
    const neditFromGQL = gqlResult.data.findNetworkEdit
    const neditToSet = {}
    neditToSet[urlRoot(thisTabUrl)] = responseDataToNedit(neditFromGQL, savedNedits)

    console.log('setting nedit: ', neditToSet);
    chrome.storage.sync.set(neditToSet)
}
const makeNeditSetElement = (gqlResult, savedNedits) => {
    const containerDiv = document.createElement('div')
    containerDiv.style = 'margin-bottom: 5px;'
    containerDiv.className = 'side_by_side'
    const nameDiv = document.createElement('div')
    nameDiv.className = 'list_text'
    nameDiv.innerText = bestName(gqlResult.name, gqlResult._id, savedNedits)
    containerDiv.appendChild(nameDiv)
    const setButton = document.createElement('button')
    setButton.className = 'primary-button button-s set_block_data_button'
    setButton.innerText = 'set'
    setButton.onclick = () => setNeditFromId(gqlResult._id, savedNedits)
    containerDiv.appendChild(setButton)
    return containerDiv
}
let allNeditsThisUrlData = []
const allNeditsContainer = document.getElementById('edits_to_show')
const showNedits = (neditsToShow, passedSavedNedits = savedNedits) => {
    allNeditsContainer.innerHTML = ''
    for (const urlNedit of neditsToShow) {
        const wrapperList = document.createElement('li')
        const neditElement = makeNeditSetElement(urlNedit, passedSavedNedits)
        wrapperList.appendChild(neditElement)
        allNeditsContainer.appendChild(wrapperList)
    }
}
const setAllNeditsForSite = async (savedNedits) => {
    const rawUrlNetworkEdits = await fetchGraphQL(`
    query{
        urlNetworkEdits(
          url: "${urlRoot(thisTabUrl)}"
        ){
          name
          uses
          _id
        }
      }
    `)
    allNeditsThisUrlData = rawUrlNetworkEdits.data.urlNetworkEdits
    
    if (allNeditsThisUrlData.length) {
        showNedits(allNeditsThisUrlData, savedNedits)
    }
}
const setAllNeditsForSiteWithWrapped = () => {
    chrome.storage.sync.get(['savedNedits'], (response) => {
        setAllNeditsForSite(response.savedNedits)
    })
}

const automaticNeditCheckbox = document.getElementById('automatic_blocking_input')
const automaticNeditSubContainer = document.getElementById('automatic_blocking_container')
const automaticNeditSelector = document.getElementById('automatic_blocking_by')
const setAutomaticNedit = (setTo) => {
    console.log(setTo);
    if (setTo) {
        automaticNeditSubContainer.style.display = 'block'
        automaticNeditSelector.value = setTo
        automaticNeditCheckbox.checked = true
    } else {
        automaticNeditSubContainer.style.display = 'none'
        automaticNeditCheckbox.checked = false
    }
}
const onAutomaticNeditCheckboxClick = (newCheckboxState) => {
    if (newCheckboxState) {
        chrome.storage.sync.set({automaticNedit: 'most popular'})
    } else {
        chrome.storage.sync.set({automaticNedit: false})
    }
}
automaticNeditCheckbox.onclick = () => onAutomaticNeditCheckboxClick(automaticNeditCheckbox.checked)
const onAutomaticNeditSelectorChange = () => {
    chrome.storage.sync.set({automaticNedit: automaticNeditSelector.value})
}
automaticNeditSelector.onchange = onAutomaticNeditSelectorChange

const recommendationInput = document.getElementById('recommendation_input')
const recommendationSubmitButton = document.getElementById('recommend_submit')
const onRecommendationSubmit = (value) => {
    const refinedValue = value.toLowerCase()
    if (!recommendationWords.includes(refinedValue)) {
        addRecommendationWord(refinedValue)
        return true
    } else {
        return false
    }
}
inputSubmitUX(recommendationSubmitButton, recommendationInput, onRecommendationSubmit)
const recommendationWordsDisplayWrapper = document.getElementById('recommendation_words_wrapper')
const recommendationWordsDisplayContainer = document.getElementById('recommendation_words_container')
const setRecommendationWords = (recommendationWords) => {
    console.log(recommendationWords);
    recommendationWordsDisplayContainer.innerHTML = ''
    if (recommendationWords.length) {
        recommendationWordsDisplayWrapper.style.display = 'block'
        for (const recommendationWord of recommendationWords) {
            const newWordDiv = document.createElement('div')
            newWordDiv.className = 'recommendation-word'
            newWordDiv.innerText = recommendationWord
            recommendationWordsDisplayContainer.appendChild(newWordDiv)
        }
    } else {
        recommendationWordsDisplayWrapper.style.display = 'none'
    }
}
const clearRecommendationWordsButton = document.getElementById('clear_recommend_data')
const clearRecommendationWords = () => {
    chrome.storage.sync.set({recommendationWords: []})
}
clearRecommendationWordsButton.onclick = clearRecommendationWords

const neditSearchInput = document.getElementById('search-button')
const filteredBySeach = (neditsData) => {
    const filteredNeditsToShow = []

    for (const neditData of neditsData) {
        for (const neditDataName of neditData.name) {
            if (
                neditDataName.includes(neditSearchInput.value) &&
                !filteredNeditsToShow.find(filteredNeditData => filteredNeditData._id === neditData._id)
            ) {
                filteredNeditsToShow.push(neditData)
            }
        }
    }

    return filteredNeditsToShow
}
const searchOption = document.getElementById('search-option')
const searchInfo = document.getElementById('search-info')
const recommendedOption = document.getElementById('recommended-option')
const recommendedInfo = document.getElementById('recommended-info')
const browseNeditsBy = (by) => {
    allNeditsContainer.innerHTML = ''
    searchInfo.style.display = 'none'
    recommendedInfo.style.display = 'none'

    let neditsToShow = []
    if (by === 'search') {
        searchInfo.style.display = 'block'
        searchOption.style.backgroundColor = 'white'
        recommendedOption.style.backgroundColor = 'rgb(30,30,30)'   

        neditsToShow = filteredBySeach(allNeditsThisUrlData)
    }
    if (by === 'recommended') {
        recommendedInfo.style.display = 'block'
        recommendedOption.style.backgroundColor = 'white'
        searchOption.style.backgroundColor = 'rgb(30,30,30)'

        neditsToShow = filterByRecommendationWords(recommendationWords, allNeditsThisUrlData)
    }
    const addTextInPlaceOfData = (text) => {
        const wrapperDiv = document.createElement('div')
        wrapperDiv.innerHTML = text
        allNeditsContainer.appendChild(wrapperDiv)
    }
    if (neditsToShow.length) {
        showNedits(neditsToShow, )
    } else {
        if (allNeditsThisUrlData.length) {
            if (by === 'search') {
                addTextInPlaceOfData(`Nothing found for your search term. <strong>Please search again</strong>.`)
            }
            if (by === 'recommended') {
                addTextInPlaceOfData('Nothing you may be interested in. Consider expanding your "<strong>Recommendations setup</strong>".')
            }
        } else {
            addTextInPlaceOfData('No nedits available. <strong>Be the first!</strong>')
        }

    }

}
searchOption.onclick = () => browseNeditsBy('search')
recommendedOption.onclick = () => browseNeditsBy('recommended')
const queryTitle = document.getElementById('query-title')
neditSearchInput.addEventListener('input', () => {
    browseNeditsBy('search')
    if (neditSearchInput.value) {
        queryTitle.innerText = `"${neditSearchInput.value}"`
    } else {
        queryTitle.innerText = 'All'
    }
})


const initiateAfterDataPackage = (msg) => {
    neditorActiveCheckbox.checked = msg.activated
    onToggleNeditor(msg.activated, content, deactivatedContent)
    clearNeditButton.onclick = () => onClearNedit(thisTabUrl)
    displayClearNedit(nedit, clearNeditButton)
    setCurrentNeditName(nedit, neditNameElement)
    setAllNeditsForSiteWithWrapped()
    setAutomaticNedit(msg.automaticNedit)
    setRecommendationWords(msg.recommendationWords)
    browseNeditsBy('search')
}