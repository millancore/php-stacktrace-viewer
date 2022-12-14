import './css/styles.css'
import tree from './src/tree'
import folderTree from "./src/folderTree";
import table from "./src/table"
// import treeItemClick from './src/treeItemClick'

let stacks;

// Error Log
const logEl = document.getElementById('log-error')
const errorEl = document.getElementById('error-view')

// Stack Detail
const folderEl = document.getElementById('tree-container')
const indexEl = document.getElementById('stack-index')
const pathEl = document.getElementById('stack-path')
const methodEl = document.getElementById('stack-method')
const lineEl = document.getElementById('stack-line')
const treeTab = document.getElementById('tree-tab')

// Stack Table
const tableContainer = document.getElementById('table')
const tableEl = document.getElementById('stack-table')
const tableTab = document.getElementById('table-tab')

document.addEventListener('submit', function (event) {
    event.preventDefault();

    stacks = null
    let data = Object.fromEntries(new FormData(event.target));

    let stackArray = data.stacktrace
        .split(/\r?\n/)
        .map(stack => stack.trim())

    let errorLog = stackArray.filter(stack => !stack.startsWith("#"))

    // Only Take lines that start with #
     stackArray =  stackArray.filter(stack => stack.startsWith("#"))

    if (errorLog.length && errorLog[0] !== '') {
        errorLog.push('<br><strong>Thrown from: ' + stackArray[0] + '</strong>')
        logEl.innerHTML = errorLog.toString()
        errorEl.classList.add('is-visible')
    }

    // Remove root folder
    if(data.root_path !== "") {
        let rootPathRegex = new RegExp(data.root_path.trim() + "?", "g");
        stackArray = stackArray.map(el => el.replace(rootPathRegex, ""));
    }

    stacks = stackArray
        .filter(el => el !== "")
        .map(el => {
            let items = el.split(" ")

            let matches = items[1].match(/\((\d+)\):/)
            let path = items[1].replace(matches[0], '')

            if (!path.startsWith("/")) {
                path =  "/" + path
            }

            return {
                index: items[0],
                path: path,
                line: matches[1],
                method: items[2]
            }
        });


    const folders = stacks.map(stack => {

        let filePath = stack.path

        // Extract the folder names from each file path
        let folders = filePath.split('/').slice(1, -1);
        let file = filePath.split('/').slice(-1)[0];

        return {folders, file: stack.index + " " + file}
    });

    const stackTree = {};

    folders.forEach(folder => {
        let parent = stackTree;
        folder.folders.forEach(folderName => {
            if (!parent[folderName]) {
                parent[folderName] = {};
            }
            parent = parent[folderName];
        });
        parent[folder.file] = true
    });

    let listContainer = document.getElementById('first-element')
    let list = folderTree.createList(stackTree);

    listContainer.innerHTML = ''
    listContainer.appendChild(list)
    showTree()

    tree.initializeTree()
    addClickEventToFiles()

})


tableTab.addEventListener('click', showTable)
treeTab.addEventListener('click', showTree)


function showTable() {
    let tbody = tableEl.getElementsByTagName('tbody')[0]
    table.createTable(stacks, tbody);

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


function addClickEventToFiles() {
    const files = document.querySelectorAll('.file')

    files.forEach(file => {
        file.addEventListener('click', function (e) {

            let id = (e.target.id).replace('stack-', '#')
            const stack = stacks.find(obj => obj['index'] === id);

            indexEl.innerHTML = stack.index
            pathEl.innerHTML = stack.path
            lineEl.innerHTML = stack.line
            methodEl.innerHTML = stack.method
        })
    })
}
