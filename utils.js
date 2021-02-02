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
const saveNedit = async (nedit, thisTabUrl) => {
    if (!emptyNedit(nedit)) {
        const neditForSchema = modifyNeditForSchema(nedit)

        const rawRes = await fetchGraphQL(
            `query{
                findNetworkEdit(
                url: "${urlRoot(thisTabUrl)}",
                filters: [${neditForSchema.filters}],
                urls: [${neditForSchema.urls}],
                storage: ${neditForSchema.storage}
                ){
                name
                filters
                urls
                storage
                uses
                _id
                }
            }`
        )
        let findNetworkEdit = rawRes.data.findNetworkEdit

        if (findNetworkEdit) {
            await fetchGraphQL(
                `mutation{
                    incrementNetworkEditUses(
                    id: "${findNetworkEdit._id}"
                    ){
                    name
                    filters
                    urls
                    storage
                    uses
                    _id
                    }
                }`
            )
        } else if (!findNetworkEdit) {
            const rawMakeNetworkEdit = await fetchGraphQL(
                `mutation{
                    makeNetworkEdit(
                    name: "${neditForSchema.name}",
                    url: "${urlRoot(thisTabUrl)}"
                    storage: ${neditForSchema.storage},
                    filters: [${neditForSchema.filters}],
                    urls: [${neditForSchema.urls}]
                    ){
                    name
                    filters
                    urls
                    storage
                    uses
                    _id
                    }
                }`
            )
            findNetworkEdit = rawMakeNetworkEdit.data.makeNetworkEdit
        }

        return findNetworkEdit
    } else {
        return false
    }
}

const setName = async (newName, dataId) => {
    const rawRes = await fetchGraphQL(
        `mutation{
            setNetworkEditName(
              name: "${newName}",
              id: "${dataId}"
            ){
              name
              uses
              _id
            }
        }`
    )

    chrome.storage.sync.get(['savedNedits'], (result) => {
        const neditAlreadySaved = result.savedNedits.find(savedNedit => savedNedit.id === dataId)
        if (neditAlreadySaved) {
            neditAlreadySaved.name = newName
        } else {
            result.savedNedits.push({id: dataId, name: newName})
        }
        console.log('result: ', result)
        chrome.storage.sync.set(result)
    })

    if (rawRes.data) {
        const setNetworkEditName = rawRes.data.setNetworkEditName
        return setNetworkEditName
    } else {
        return false
    }
}

const setNeditFromData = async (nedit, thisTabUrl) => {
    const rootUrl = urlRoot(thisTabUrl)

    const neditForSchema = modifyNeditForSchema(nedit)
    const rawRes = await fetchGraphQL(
        `query{
            findNetworkEdit(
            url: "${rootUrl}",
            filters: [${neditForSchema.filters}],
            urls: [${neditForSchema.urls}],
            storage: ${neditForSchema.storage}
            ){
            name
            filters
            urls
            storage
            uses
            url
            _id
            }
        }`
    )
    let findNetworkEdit = rawRes.data.findNetworkEdit

    if (findNetworkEdit) {
        chrome.storage.sync.get(['savedNedits'], (result) => {
            const newNedit = responseDataToNedit(findNetworkEdit, result.savedNedits)
            
            const neditToSave = {}
            neditToSave[rootUrl] = newNedit
            chrome.storage.sync.set(neditToSave)
            
            chrome.runtime.sendMessage(
                {to: rootUrl, msgType: 'neditUpdate', nedit: newNedit},
            (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
            return newNedit
        })
    } else {
        chrome.runtime.sendMessage(
            {to: rootUrl, msgType: 'neditUpdate', nedit: {name: null, filters: [], urls: [], storage: false}},
        (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})

        return nedit
    }
    
}

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
    neditForSchema.name = neditForSchema.name ? neditForSchema.name.toLowerCase() : `(${neditForSchema.urls.length + neditForSchema.urls.length})${neditForSchema.storage ? 'c' : ''}`
    neditForSchema.urls = nedit.urls.length ? nedit.urls.sort().map(url => `"${url}"`) : ''
    neditForSchema.filters = nedit.filters.length ? nedit.filters.sort().map(filter => `"${filter}"`) : ''
    return neditForSchema
}
const responseDataToNedit = (responseData, savedNedits) => {
    const newNedit = {}
    
    newNedit.name = bestName(responseData.name, responseData._id, savedNedits)
    newNedit.filters = responseData.filters
    newNedit.urls = responseData.urls
    newNedit.storage = responseData.storage
    
    return newNedit
}

const setCurrentNeditName = (nedit, neditNameElement) => {
    if (nedit.name) {
        neditNameElement.innerText = nedit.name
    } else {
        neditNameElement.innerHTML = '<i>None</i>'
    }
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
const inputSubmitUX = async (submitElement, inputElement, callback) => {
    const deactivate = () => {
        submitElement.style.opacity = '0.5'
        submitElement.style.cursor = 'auto'
        submitElement.setAttribute('disabled', 'true')
    }
    const triggerCallback = async () => {
        if (submitElement.getAttribute('disabled')) {
            null
        } else {
            const response = await callback(inputElement.value)
            if (response) {
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

const hideStateAlert = (container) => {
    container.style.display = 'none'
}

const stateAlert = (state, container, title, content) => {
    container.style.display = 'block'

    const tipsHTMLString = state.tips.map(tip => `<div>${tip}</div>`).join(' ')
    container.style = state.containerStyle
    title.innerText = state.id
    content.innerHTML = tipsHTMLString
}