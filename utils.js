const fetchGraphQL = async (schema) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var graphql = JSON.stringify({
        query: schema,
        variables: {}
    })
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow'
    };
    const res = await fetch("https://neditor-backend.herokuapp.com/graphql", requestOptions).then(res => res.json())
    return res
}
// RE-IMPLEMENT THIS
// const saveNetworkEdit = async (neditForSchema) => {
//     if (!emptyNedit(nedit)){
//         console.log('HAS BEEN EDITED', blockData);
        
//         const rawRes = await fetchGraphQL(
//             `query{
//                 findNetworkEdit(
//                 url: "${generalCurrentURL()}",
//                 filters: [${blockData.programs.sort().map(program => `"${program}"`)}],
//                 urls: [${filteredUrls.sort().map(url => `"${url}"`)}],
//                 storage: ${blockData.storage}
//                 ){
//                 name
//                 uses
//                 _id
//                 }
//             }`
//         )
//         let findNetworkEdit = rawRes.data.findNetworkEdit
//         console.log(findNetworkEdit);
//         if (findNetworkEdit && used) {
//             const rawIncrementNetworkEditUses = await fetchGraphQL(
//                 `mutation{
//                     incrementNetworkEditUses(
//                     id: "${findNetworkEdit._id}"
//                     ){
//                     name
//                     uses
//                     _id
//                     }
//                 }`
//             )
//             const incrementNetworkEditUses = rawIncrementNetworkEditUses.data.incrementNetworkEditUses
//         } else if (!findNetworkEdit) {
//             console.log('make new NetworkEdit');
//             const rawMakeNetworkEdit = await fetchGraphQL(
//                 `mutation{
//                     makeNetworkEdit(
//                     name: "(${blockData.urls.length})${blockData.storage ? 'C' : ''}",
//                     url: "${generalCurrentURL()}"
//                     storage: ${blockData.storage},
//                     filters: [${blockData.programs.sort().map(program => `"${program}"`)}],
//                     urls: [${blockData.urls.sort().map(url => `"${url}"`)}]
//                     ){
//                     name
//                     _id
//                     }
//                 }`
//             )
//             findNetworkEdit = rawMakeNetworkEdit.data.makeNetworkEdit
//         }
//         return findNetworkEdit
//     }
// }

const bestName = (names, dataId, savedNedits) => {
    const foundSavedNedit = savedNedits.find(savedNedit => savedNedit.id === dataId)
    if (foundSavedNedit) {
        return foundSavedNedit.name
    }
    const interestingNames = names.filter(name => {
        let nameParse = name
        if (name.includes('(') && name.includes(')')) {
            if(Number(nameParse.split('(')[1].split(')')[0])) {
                return false
            }
        }
        return true
    })
    if (interestingNames.length) {
        return interestingNames[0]
    } else {
        return names[0]
    }
}

const modifyNeditForSchema = (nedit) => {
    const neditForSchema = {...nedit}
    neditForSchema.name = neditForSchema.name.toLowerCase()
    neditForSchema.urls = nedit.urls.length ? nedit.urls.sort().map(url => `"${url}"`) : ''
    neditForSchema.filters = nedit.filters.length ? nedit.filters.sort().map(filter => `"${filter}"`) : ''
    return neditForSchema
}

const urlRoot = (url) => {
    return url.split('/')[2]
}



const setStorageNedit = () => {
    chrome.storage.sync.get(['test2'], (result) => {
        console.log(result);
    })
}

// make sure no blocked method reiterates
const cleanNeditBlockedUrls = (nedit) => {
    const cleanedNedit = {...nedit}
    const filteredFilters = nedit.filters.filter(filterText => {
        for (const innerFilterText of nedit.filters) {
            if (filterText !== innerFilterText && filterText.includes(innerFilterText)) {
                return false
            }
        }
        return true
    })
    cleanedNedit.filters = filteredFilters
    const filteredUrls = nedit.urls.filter(url => {
        for (const filterText of cleanedNedit.filters) {
            if (url.includes(filterText)) {
                return false
            }
        }
        return true
    })
    cleanedNedit.urls = filteredUrls

    return cleanedNedit
}

// const editNedit = (siteUrl, callback) => {
//     const rootUrl = urlRoot(siteUrl)
//     chrome.storage.sync.get([rootUrl], (result) => {
//         let nedit = result[rootUrl]
//         nedit = callback(nedit)
//         const neditForSite = {}
//         neditForSite[rootUrl] = nedit
//         chrome.storage.sync.set(neditForSite)
//         console.log('rootUrl: ', rootUrl)
//         return nedit
//     })
// }

const addUrlsToBlock = (siteUrl, urls) => {
    const rootUrl = urlRoot(siteUrl)
    chrome.storage.sync.get([rootUrl], (result) => {
        const nedit = result[rootUrl]
        for (const url of urls) {
            nedit.urls.push(url)
        }
        const neditForSite = {}
        neditForSite[rootUrl] = cleanNeditBlockedUrls(nedit)
        chrome.storage.sync.set(neditForSite)
        
        return nedit
    })
}

const removeUrlsToBlock = (siteUrl, urls) => {
    const rootUrl = urlRoot(siteUrl)
    chrome.storage.sync.get([rootUrl], (result) => {
        const nedit = result[rootUrl]
        for (const url of urls) {
            nedit.urls = nedit.urls.filter(blockedUrl => blockedUrl !== url)
        }
        const neditForSite = {}
        neditForSite[rootUrl] = cleanNeditBlockedUrls(nedit)
        chrome.storage.sync.set(neditForSite)
        
        return nedit
    })
}

const addFilters = (siteUrl, filterTexts) => {
    const rootUrl = urlRoot(siteUrl)
    chrome.storage.sync.get([rootUrl], (result) => {
        const nedit = result[rootUrl]
        for (const filterText of filterTexts) {
            if (!nedit.filters.includes(filterText)) {
                nedit.filters.push(filterText)
            }
        }
        const neditForSite = {}
        neditForSite[rootUrl] = cleanNeditBlockedUrls(nedit)
        chrome.storage.sync.set(neditForSite)
        
        return nedit
    })
}

const removeFilters = (siteUrl, filterTexts) => {
    const rootUrl = urlRoot(siteUrl)
    chrome.storage.sync.get([rootUrl], (result) => {
        const nedit = result[rootUrl]
        for (const filterText of filterTexts) {
            nedit.filters = nedit.filters.filter(filter => filter !== filterText)
        }
        const neditForSite = {}
        neditForSite[rootUrl] = cleanNeditBlockedUrls(nedit)
        chrome.storage.sync.set(neditForSite)
        
        return nedit
    })
}

const toggleStorage = (siteUrl, newStorageState) => {
    const rootUrl = urlRoot(siteUrl)
    chrome.storage.sync.get([rootUrl], (result) => {
        const nedit = result[rootUrl]
        nedit.storage = newStorageState
        const neditForSite = {}
        neditForSite[rootUrl] = nedit
        chrome.storage.sync.set(neditForSite)

        return nedit
    })
}

const onEnterPress = (e, callback) => {
    if (e) {
        if (e.keyCode === 13) {
            callback()
        }
    }
}
const inputSubmitUX = (submitElement, inputElement, callback) => {
    const deactivate = () => {
        submitElement.style.opacity = '0.5'
        submitElement.style.cursor = 'auto'
        submitElement.setAttribute('disabled', 'true')
    }
    const triggerCallback = () => {
        if (submitElement.getAttribute('disabled')) {
            null
        } else {
            if (callback(inputElement.value)) {
                inputElement.value = ''
                deactivate()
            } else {
                const inputBackgroundColor = inputElement.style.backgroundColor
                inputElement.style.backgroundColor = '#ea433555'
                setTimeout(() => {inputElement.style.backgroundColor = inputBackgroundColor}, 1000)
            }

        }
    }

    submitElement.onclick = triggerCallback
    inputElement.onkeyup = (e) => onEnterPress(e, triggerCallback)
    inputElement.addEventListener('input', () => {
        if (inputElement.value) {
            submitElement.style.opacity = '1'
            submitElement.style.cursor = 'pointer'
            submitElement.removeAttribute('disabled')
        } else {
            deactivate()
        }
    })
}

const parseBlockedUrls = (nedit) => {
    const parsedBlockedUrls = []
    const blockedByFilter = blockedUrlObjects.filter(blockedUrlObject => blockedUrlObject.by === 'filter')
    for (const filter of nedit.filters) {
        const urlsBlockedByFilter = {by: 'filter', which: filter, urls: []}
        const objectsBlockedByFilter = blockedByFilter.filter(blockedUrlObject => blockedUrlObject.which === filter)
        urlsBlockedByFilter.urls = objectsBlockedByFilter.map(object => object.blockedUrl)
        if (urlsBlockedByFilter.urls.length) {
            parsedBlockedUrls.push(urlsBlockedByFilter)
        }
    }
    const blockedBySpecificUrl = blockedUrlObjects.filter(blockedUrlObject => blockedUrlObject.by === 'specificUrl')
    for (const blockedUrlObject of blockedBySpecificUrl) {
        const urlsBlockedBySpecificUrl = {by: 'specificUrl', which: blockedUrlObject.which, urls: [blockedUrlObject.blockedUrl]}
        parsedBlockedUrls.push(urlsBlockedBySpecificUrl)
    }
    return parsedBlockedUrls
}

const emptyNedit = (nedit) => {
    if (!nedit) {
        return true
    }
    if (!nedit.storage && !nedit.urls.length && !nedit.filters.length) {
        return true
    } else {
        return false
    }
}

const stateAlert = (state, container, title, content) => {
    const tipsHTMLString = state.tips.map(tip => `<div>${tip}</div>`).join(' ')
    container.style = state.containerStyle
    container.style.display = 'block'
    title.innerText = state.id
    content.innerHTML = tipsHTMLString
}