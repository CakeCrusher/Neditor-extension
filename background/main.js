// delete all nedit storage data for client
//chrome.storage.sync.clear(() => console.log('cleared'))

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
let allProgressById = {}
let allRequestsById = {}
let allBlockedUrlsById = {}

