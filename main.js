import './css/styles.css'
import {stacktrace} from '/tests/stacktrace'
import tree from './src/tree'
import folderTree from "./src/folderTree";
import table from "./src/table"
import parser from "./src/stackTraceParser"

let stacks;

// Folder Tree
let listContainer = document.getElementById('first-element')

// Error Log
const logEl = document.getElementById('log-error')
const errorEl = document.getElementById('error-view')

// Stack Detail
const folderEl = document.getElementById('tree-container')
const treeTab = document.getElementById('tree-tab')
const previousEl = document.getElementById('previous')

// Stack Table
const tableContainer = document.getElementById('table')
const tableEl = document.getElementById('stack-table')
const tableTab = document.getElementById('table-tab')

// Options
const form = document.getElementById('stack-form')
const textarea = document.getElementById('textarea')
const rootPath = document.getElementById('root-path')
const clearButton = document.getElementById('clear')
const loadButton = document.getElementById('load-example')

document.addEventListener('submit', processStackTrace)
clearButton.addEventListener('click', clear)
loadButton.addEventListener('click', loadStackTraceExample)
tableTab.addEventListener('click', showTable)
treeTab.addEventListener('click', showTree)

function processStackTrace(event) {
    event.preventDefault();

    stacks = null
    let data = Object.fromEntries(new FormData(form));
    let stacktrace = data.stacktrace;
    let rootPath = data.root_path.trim()

    let stackArray = parser.getStackArray(stacktrace)
    let errorLog = parser.getErrorMessage(stacktrace)

    if (rootPath !== "") {
        stackArray = parser.removeRootFolderPath(data.root_path, stackArray);
    }
    stacks = parser.stackLinesToObjects(stackArray);

    showErrorBanner(errorLog, stackArray[0])
    addTreeFolderToDom(stacks)
}

function addTreeFolderToDom(stack) {
    listContainer.innerHTML = ''
    listContainer.appendChild(folderTree.createHtmlTreeFolderFromStacks(stacks))

    tree.initializeTree()
    addClickEventToFiles()

    showTree()
}

function showTable() {
    let tbody = tableEl.getElementsByTagName('tbody')[0]
    table.createTable(stacks, tbody);

    new simpleDatatables.DataTable("#stack-table", {
        searchable: true,
        sortable: false,
        paging: false
    })

    tableContainer.classList.add('is-visible')
    folderEl.classList.remove('is-visible')
    tableTab.classList.add('is-active')
    treeTab.classList.remove('is-active')
}

function showTree() {
    tableContainer.classList.remove('is-visible')
    folderEl.classList.add('is-visible')
    treeTab.classList.add('is-active')
    tableTab.classList.remove('is-active')
}


function showErrorBanner(errorLog, firstStack) {
    if (errorLog.length && errorLog[0] === '') {
        // Nothing to show
        return
    }

    errorLog.push('<br><strong>Thrown from: ' + firstStack + '</strong>')
    logEl.innerHTML = errorLog.toString()
    errorEl.classList.add('is-visible')
}

function findStackLine(orderIndex) {
    return stacks.find(obj => obj['index'] === orderIndex);
}

function addClickEventToFiles() {
    const files = document.querySelectorAll('.file')

    files.forEach(file => {
        file.addEventListener('click', function (e) {

            let id = (e.target.id).replace('stack-', '#')
            let stackLine = findStackLine(id)

            if (stackLine instanceof parser.Stack) {
                showLineDetail(stackLine)
                addPreviousStackLines(id)
            }
        })
    })
}

function addPreviousStackLines(fromId, count = 3) {
    previousEl.innerHTML = ''

    let i = parseInt(fromId.replace("#", '')) + 1
    count = i + count;

    for (i; i < count; i++) {
       let stackLine = findStackLine('#'+ i)
        console.log(stackLine)
        if (stackLine instanceof parser.Stack) {
            previousEl.appendChild(createSimpleStackHTML(stackLine))
        }
    }
}

function createSimpleStackHTML(stackLine) {
    let li = document.createElement('li')
        li.classList.add('previous-stack')

    let index = document.createElement('p')
    index.innerHTML = stackLine.index

    let path = document.createElement('p')
    path.innerHTML = stackLine.path

    let line = document.createElement('p')
    line.innerHTML = 'Line: ' + stackLine.line

    let method = document.createElement('p')
    method.classList.add('strong')
    method.innerHTML = 'Method: ' + stackLine.method

    li.appendChild(index)
    li.appendChild(path)
    li.appendChild(line)
    li.appendChild(method)

    return li;
}

function showLineDetail(stackLine) {
    document.getElementById('stack-index').innerHTML = stackLine.index
    document.getElementById('stack-path').innerHTML = stackLine.path
    document.getElementById('stack-method').innerHTML = stackLine.method
    document.getElementById('stack-line').innerHTML = stackLine.line
}

function clear() {
    stacks = null
    listContainer.innerHTML = ''
    let tbody = tableEl.getElementsByTagName('tbody')[0]
    tbody.innerHTML = ''
    showLineDetail(new parser.Stack('', '', '', ''))
    previousEl.innerHTML = ''
    rootPath.value = ''
    textarea.value = ''
    logEl.innerHTML = ''
    errorEl.classList.remove('is-visible')
}

function loadStackTraceExample() {
    rootPath.value = '/var/www/html'
    textarea.value = stacktrace
    processStackTrace(event)
}