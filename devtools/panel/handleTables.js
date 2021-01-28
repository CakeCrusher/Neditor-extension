const networkTableData = document.getElementById('table_data')
const networkTableHead = document.getElementById('table_head')
const columnAggregator = document.getElementById('column_data')

const networkTableColumn = []
const filters = {}

// navigates the request Object
const requestNavigator = (lookingFor, request) => {
    let resultFound
    if (lookingFor === 'type') {
        resultFound = request.response.content.mimeType
    } else if (lookingFor === 'url') {
        resultFound = request.request.url
    } else if (lookingFor === 'priority') {
        resultFound = request._priority
    } else if (lookingFor === 'time') {
        resultFound = request.time
    } else if (lookingFor === 'headers(amount)') {
        resultFound = request.request.headers.length
    } else if (lookingFor === 'size') {
        resultFound = request.response.content.size
    } else {
        resultFound = 'Invalid Column'
    }
    if (resultFound) {
        return resultFound
    } else {
        return 'NA'
    }
}

const onBlockCheckboxClick = (checkbox, request) => {
    const url = requestNavigator('url', request)
    if (checkbox.checked) {
        addUrlsToBlock(thisTabUrl, [url])
        nedit.urls.push(url)
    } else {
        removeUrlsToBlock(thisTabUrl, [url])
        nedit.urls = nedit.urls.filter(blockedUrl => blockedUrl !== url)
    }
}
const onBlockCheckboxClickTR = (checkbox, filterText) => {
    if (checkbox.checked) {
        addFilters(thisTabUrl, [filterText])
        nedit.filters.push(filterText)
    } else {
        removeFilters(thisTabUrl, [filterText])
        nedit.filters = nedit.filters.filter(blockedUrl => blockedUrl !== filterText)
    }
}

const makeCellContent = (type, request, tableId) => {
    if (type === 'block') {
        const checkbox = document.createElement('input')
        const uniqueId = tableId === 'ANR' ? requestNavigator('url', request) : request
        checkbox.type = 'checkbox'
        checkbox.className = 'blockCheckbox'
        checkbox.id = `blockCheckbox-${tableId}-${uniqueId}`
        if (tableId === 'ANR') {
            checkbox.checked = nedit.urls.includes(uniqueId)
            checkbox.onclick = () => onBlockCheckboxClick(checkbox, request)
        } else if (tableId === 'FNR') {
            checkbox.checked = nedit.filters.includes(uniqueId)
            checkbox.onclick = () => onBlockCheckboxClickTR(checkbox, request)
        }
        return checkbox
    } else if (type === 'url' || type === 'filter' || type === 'type' || type === 'priority' || type === 'time' || type === 'headers(amount)' || type === 'size') {
        const div = document.createElement('div')
        if (tableId === 'ANR') {
            div.innerText = requestNavigator(type, request)
        } else if (tableId === 'FNR') {
            div.innerText = request
        }
        return div
    }
}

const addCell = (type, request, row, tableId = 'ANR') => {
    const cell = document.createElement('td')
    cell.appendChild(makeCellContent(type, request, tableId))
    row.appendChild(cell) 
}

const addRowToTable = (columns, tableData, request) => {
    if (requestFilter(request)) {
        const row = document.createElement('tr')
        row.id = `row-${requestNavigator('url', request)}`
    
        for (const type of columns) {
            addCell(type, request, row)
        }
    
        tableData.appendChild(row)
    }
}

const makeTable = () => {
    networkTableData.innerHTML = ''
    for (const request of requestsToShow) {
        addRowToTable(networkTableColumn, networkTableData, request)
    }
}

const filterTable = () => {
    requestsToShow = [...allRequests]
    Object.keys(filters).forEach(filterKey => {
        const passedRequests = []
        requestsToShow.forEach(r => {
            if (requestNavigator(filterKey, r).includes(filters[filterKey])) {
                passedRequests.push(r)
            }
        })
        requestsToShow = passedRequests
    })
    makeTable()
}

const requestFilter = (request) => {
    let failed = false
    Object.keys(filters).forEach(filterKey => {
        if (!requestNavigator(filterKey, request).includes(filters[filterKey])) {
            failed = true
        }
    })
    if (failed) {
        return false
    } else {
        return true
    }
}

const resetTables = (tables) => {
    for (const table of tables) {
        table.innerHTML = ''
        
    }
}

const addColumn = (columnType = columnAggregator.value) => {
    networkTableColumn.push(columnType)
    activateColumn(columnType)
}

const onBlockToggle = (button) => {
    const urlsOfRequestsInTable = requestsToShow.map(r => r.request.url)
    const buttonsOfRequestsInTable = []
    for (const url of urlsOfRequestsInTable) {
        const foundElement = document.getElementById(`blockCheckbox-ANR-${url}`)
        buttonsOfRequestsInTable.push(foundElement)
    }
    if (button.getAttribute('block')) {
        for (const blockButton of buttonsOfRequestsInTable) {
            blockButton.checked = true
        }
        addUrlsToBlock(thisTabUrl, urlsOfRequestsInTable)
        for (const url of urlsOfRequestsInTable) {
            nedit.urls.push(url)            
        }


        button.removeAttribute('block')
    } else {
        for (const blockButton of buttonsOfRequestsInTable) {
            blockButton.checked = false
        }
        removeUrlsToBlock(thisTabUrl, urlsOfRequestsInTable)
        for (const url of urlsOfRequestsInTable) {
            nedit.urls = nedit.urls.filter(blockedUrl => blockedUrl !== url)            
        }

        button.setAttribute('block', 'true')
    }
}

const makeBlockAllButton = () => {
    const headContent = document.createElement('th')
    headContent.style.borderLeftWidth = '0'
    const button = document.createElement('button')
    button.id = 'network-block_button'
    button.innerText = 'block'
    button.setAttribute('block', 'true')
    button.onclick = () => onBlockToggle(button)
    headContent.appendChild(button)
    // headContent.innerHTML = '<button id="network-block_button" class="toblock">block</button>'
    
    return headContent
}

const activateColumn = (columnType,) => {
    columnAggregator.value = ''
    let headContent
    if (columnType === 'block') {
        headContent = makeBlockAllButton()
    } else {
        headContent = document.createElement('th')
        const searchIcon = document.createElement('img')
        searchIcon.className = 'search_icon'
        searchIcon.src = '../../icons/search.svg'
        headContent.appendChild(searchIcon)
        const columnFilterInput = document.createElement('input')
        columnFilterInput.id = `${columnType}-input`
        columnFilterInput.className = 'head_inputs'
        columnFilterInput.placeholder = columnType
        columnFilterInput.style.width = `${((columnType.length + 1) * 8) + 20}px`
        columnFilterInput.addEventListener('input', () => {
            filters[columnType] = columnFilterInput.value
            filterTable()
        })
        headContent.appendChild(columnFilterInput)
    }

    networkTableHead.appendChild(headContent)
    const rows = document.getElementById('table_data').childNodes
    // catch empty string element error
    if (rows[0].id) {
        rows.forEach(row => {
            const rowRequest = allRequests.find(r => `row-${requestNavigator('url', r)}` === row.id )
            addCell(columnType, rowRequest, row)
        })
    }

}
columnAggregator.onchange = () => addColumn()

const filterTableData = document.getElementById('programs-table_data')
const addFilterTableRow = (filterText) => {
    const row = document.createElement('tr')
    row.id = `row-FNR-${filterText}`

    addCell('block', filterText, row, 'FNR')
    addCell('filter', filterText, row, 'FNR')

    filterTableData.appendChild(row)
}
const makeFilterTable = () => {
    filterTableData.innerHTML = ''
    for (const filterText of filtersToShow) {
        addFilterTableRow(filterText)
    }
}