// delete all nedit storage data for client
// chrome.storage.sync.clear(() => console.log('cleared'))

const initializeStorage = (name, initialState, setVar) => {
    chrome.storage.sync.get([name], (result) => {
        if (result[name]) {
            setVar(result[name])
        } else {
            const storageItem = {}
            storageItem[name] = initialState
            chrome.storage.sync.set(storageItem)
            setVar(initialState)
        }
    })
}

const sendDataPackage = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let nedit
        initializeStorage(urlRoot(tabs[0].url), {name: null, filters: [], urls: [], storage: false}, (res) => {
            nedit = res
            chrome.runtime.sendMessage({to: tabs[0].id, msgType: 'dataPackage', thisTabUrl: tabs[0].url, nedit}, (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})
        })
    })
}

// syncronizing vars with storage
let activated
initializeStorage('activated', true, (res) => {activated = res})
let savedNedits
initializeStorage('savedNedits', [], (res) => {savedNedits = res})
let recommendationWords
initializeStorage('recommendationWords', [], (res) => {recommendationWords = res})
let automaticNedit
initializeStorage('automaticNedit', false, (res) => {automaticNedit = res})
let darkMode
initializeStorage('darkMode', false, (res) => {darkMode = res})

let allNeditsById = {}

let allRequestsById = {}

