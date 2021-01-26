const networkTableData = document.getElementById('table_data')

const networkTableColumn = ['block', 'url']

// navigates the request Object
const requestNavigator = (lookingFor, request) => {
    if (lookingFor === 'type') {
        return request.response.content.mimeType
    } else if (lookingFor === 'url') {
        return request.request.url
    } else if (lookingFor === 'priority') {
        return request._priority
    } else if (lookingFor === 'time') {
        return request.time
    } else if (lookingFor === 'headers(amount)') {
        return request.request.headers.length
    } else if (lookingFor === 'size') {
        return request.response.content.size
    } else {
        return ''
    }
}

const makeCellContent = (type, request) => {
    if (type === 'block') {
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.className = 'blockCheckbox'
        return checkbox
    } else if (type === 'url' || type === 'type' || type === 'priority' || type === 'time' || type === 'headers(amount)' || type === 'size') {
        const div = document.createElement('div')
        div.innerText = requestNavigator(type, request)
        return div
    }
}

const addRowToTable = (columns, tableData, request) => {
    const row = document.createElement('tr')

    for (const type of columns) {
        const cell = document.createElement('td')
        cell.appendChild(makeCellContent(type, request))
        row.appendChild(cell) 
    }

    tableData.appendChild(row)
}


