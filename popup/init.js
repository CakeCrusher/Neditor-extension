let tabId
let nedit
let thisTabUrl

let activated
let savedNedits
let recommendationWords
let automaticNedit

chrome.runtime.sendMessage({needDataPackage: true, isPopup: true}, (ignoreThis) => {if (!window.chrome.runtime.lastError) {/*checks an error */}})

const logElement = document.getElementById('log')
const setLog = (setTo) => {logElement.innerText = setTo}
