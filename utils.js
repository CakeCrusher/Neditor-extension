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
            callback(inputElement.value)
            inputElement.value = ''
            deactivate()
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