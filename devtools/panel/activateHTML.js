const storageCheckbox = document.getElementById('storage_checkbox')
const onStorageToggle = () => {
    toggleStorage(thisTabUrl, storageCheckbox.checked)
    // nedit.storage = storageCheckbox.checked
}
const initiateStorageState = () => {
    storageCheckbox.checked = nedit.storage
}

const filterSubmit = document.getElementById('submit_program')
const filterInput = document.getElementById('program_description')
const onFilterAdd = (filterText) => {
    if (!filtersToShow.includes(filterText)) {
        // fixes an issue where when a filter is added it is unchecked
        nedit.filters.push(filterText)
        addFilters(thisTabUrl, [filterText])
        // nedit.filters.push(filterText)
        filtersToShow.push(filterText)
        addFilterTableRow(filterText)
        return true
    } else {
        return false
    }

}
inputSubmitUX(filterSubmit, filterInput, onFilterAdd)

const currentNeditName = document.getElementById('current_edit')
const setCurrentNeditName = () => {
    if (nedit.name) {
        currentNeditName.innerText = nedit.name
    } else {
        currentNeditName.innerHTML = '<i>None</i>'
    }
}

const saveSubmit = document.getElementById('save')
const saveInput = document.getElementById('edit_name')
const onNeditSave = async (saveName) => {
    nedit.name = saveName
    const neditToSave = {}
    neditToSave[urlRoot(thisTabUrl)] = nedit
    chrome.storage.sync.set(neditToSave)
    setCurrentNeditName()
}
inputSubmitUX(saveSubmit, saveInput, onNeditSave)

const integrateButton = document.getElementById('programs-block_button')
const onIntegrateToggle = (button) => {
    const allFilters = filtersToShow
    const buttonsOfFiltersInTable = []
    for (const filterText of allFilters) {
        const foundElement = document.getElementById(`blockCheckbox-FNR-${filterText}`)
        buttonsOfFiltersInTable.push(foundElement)
    }
    if (button.getAttribute('block')) {
        for (const blockButton of buttonsOfFiltersInTable) {
            blockButton.checked = true
        }
        addFilters(thisTabUrl, allFilters)
        // for (const filterText of allFilters) {
            // if (!nedit.filters.includes(filterText)) {
                // nedit.filters.push(filterText)         
            // }
        // }

        button.removeAttribute('block')
    } else {
        for (const blockButton of buttonsOfFiltersInTable) {
            blockButton.checked = false
        }
        removeFilters(thisTabUrl, allFilters)
        // for (const filterText of allFilters) {
            // nedit.filters = nedit.filters.filter(filter => filter !== filterText)            
        // }

        button.setAttribute('block', 'true')
    }
}

const tableOptionsContainer = document.getElementById('table_options-container')
const tableOptions = document.querySelectorAll('.table_option')
const selectTable = (tableOptionElement) => {
    tableOptionsContainer.style.backgroundColor = tableOptionElement.getAttribute('color')
    const clickedValue = tableOptionElement.getAttribute('value')
    const tableContentDiv = document.getElementById(`${clickedValue}-content`)
    tableContentDiv.style.display = 'block'
    // hide other tables
    const tablesContent = ['blocked', 'all']
    tablesContent.forEach(tc => {
        if (clickedValue !== tc) {
            const otherTableContentDiv = document.getElementById(`${tc}-content`)
            otherTableContentDiv.style.display = 'none'
        }
    })
}
tableOptions.forEach(tableOptionElement => {
    tableOptionElement.onclick = () => selectTable(tableOptionElement)
})


const activateAfterNedit = () => {
    storageCheckbox.onclick = onStorageToggle
    integrateButton.onclick = () => onIntegrateToggle(integrateButton)
}