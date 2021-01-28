const filterInput = document.getElementById('program_description')
const filterSubmit = document.getElementById('submit_program')
const onFilterAdd = (filterText) => {
    if (!nedit.filters.includes(filterText)) {
        addFilters(thisTabUrl, [filterText])
        nedit.filters.push(filterText)
        filtersToShow.push(filterText)
        addFilterTableRow(filterText)
    }

}
inputSubmitUX(filterSubmit, filterInput, onFilterAdd)

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
        for (const filterText of allFilters) {
            if (!nedit.filters.includes(filterText)) {
                nedit.filters.push(filterText)         
            }
        }

        button.removeAttribute('block')
    } else {
        for (const blockButton of buttonsOfFiltersInTable) {
            blockButton.checked = false
        }
        removeFilters(thisTabUrl, allFilters)
        for (const filterText of allFilters) {
            nedit.filters = nedit.filters.filter(filter => filter !== filterText)            
        }

        button.setAttribute('block', 'true')
    }
}

const storageCheckbox = document.getElementById('storage_checkbox')
const onStorageToggle = () => {
    toggleStorage(thisTabUrl, storageCheckbox.checked)
    nedit.storage = storageCheckbox.checked
}
const initiateStorageState = () => {
    storageCheckbox.checked = nedit.storage
}

const activateAfterNedit = () => {
    storageCheckbox.onclick = onStorageToggle
    integrateButton.onclick = () => onIntegrateToggle(integrateButton)
}