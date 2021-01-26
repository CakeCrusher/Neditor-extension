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

// syncronizing vars with storage
let activated
initializeStorage('activated', true, (res) => {activated = res})
let nedit
initializeStorage('nedit', {name: null, filters: [], urls: [], storage: false}, (res) => {nedit = res})
let savedNedits
initializeStorage('savedNedits', [], (res) => {savedNedits = res})
let recommendationWords
initializeStorage('recommendationWords', [], (res) => {recommendationWords = res})
let automaticNedit
initializeStorage('automaticNedit', false, (res) => {automaticNedit = res})
let darkMode
initializeStorage('darkMode', false, (res) => {darkMode = res})

let allRequestsPerId = {}