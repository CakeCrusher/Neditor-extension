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

const addUrlToBlock = (siteUrl, url) => {
    const rootUrl = urlRoot(siteUrl)
    chrome.storage.sync.get([rootUrl], (result) => {
        const nedit = result[rootUrl]
        nedit.urls.push(url)
        const neditForSite = {}
        neditForSite[rootUrl] = nedit
        chrome.storage.sync.set(neditForSite)
        
        return nedit
    })
}

const removeUrlToBlock = (siteUrl, url) => {
    const rootUrl = urlRoot(siteUrl)
    chrome.storage.sync.get([rootUrl], (result) => {
        const nedit = result[rootUrl]
        nedit.urls = nedit.urls.filter(blockedUrl => blockedUrl !== url)
        const neditForSite = {}
        neditForSite[rootUrl] = nedit
        chrome.storage.sync.set(neditForSite)
        
        return nedit
    })
}