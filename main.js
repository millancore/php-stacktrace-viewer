import './css/styles.css'
import tree from './src/tree'
import folderTree from "./src/folderTree";
import table from "./src/table"
// import treeItemClick from './src/treeItemClick'

let stacks;

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

    let data = Object.fromEntries(new FormData(event.target));

    let rootPathRegex = new RegExp(data.root_path + "?", "g");

    let stackArray = data.stacktrace
        .split(/\r?\n/)
        .map(el => el.trim())
        .map(el => el.replace(rootPathRegex, ""));


    stacks = stackArray
        .filter(el => el !== "")
        .map(el => {
            let items = el.split(" ")

            let matches = items[1].match(/\((\d+)\):/)
            let path = items[1].replace(matches[0], '')


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
}

function showTree() {
    tableContainer.classList.remove('is-visible')
    folderEl.classList.add('is-visible')
}


function addClickEventToFiles() {
    const files = document.querySelectorAll('.file')

    files.forEach(file => {
        file.addEventListener('click', function (e) {

            let id = (e.target.id).replace('stack-', '#')
            const stack = stacks.find(obj => obj['index'] === id);


            console.log(stack)

            indexEl.innerHTML = stack.index
            pathEl.innerHTML = stack.path
            lineEl.innerHTML = stack.line
            methodEl.innerHTML = stack.method

            file.setAttribute('style', 'background-color: yellow;');
        })
    })
}