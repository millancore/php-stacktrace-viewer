function createHTMLFolderTree(tree, vendor = false) {
    // create the list element
    var list = document.createElement('ul');
    list.setAttribute('role', 'group')

    let treeKeys = Object.keys(tree).sort();

    // iterate over the array
    for (const key of treeKeys) {

        let item = tree[key]
        // create the list item
        var li = document.createElement('li');

        let expanded = !vendor;
        li.setAttribute('role', 'treeitem')
        li.setAttribute('aria-expanded', expanded)
        li.setAttribute('aria-selected', 'false')

        let text = document.createElement('span')
        text.textContent = key
        li.appendChild(text)

        if (key === 'vendor') {
            li.classList.add('vendor')
            vendor = true
        }

        // check if the item is an object
        if (typeof item === 'object') {

            // if it is, call the function recursively to create a nested list
            li.appendChild(createHTMLFolderTree(item, vendor));
        } else {

            let matches = key.match(/#(\d+)/);

            // otherwise, set the text content of the list item
            li.textContent = key;
            li.setAttribute('id', 'stack-' + matches[1])
            li.classList.add('file')
        }

        // add the list item to the list
        list.appendChild(li);
    }

    // return the list
    return list;
}


function getStructureFolderFromStack(stack) {
    let filePath = stack.path

    // Extract the folder names from each file path
    let folders = filePath.split('/').slice(1, -1);
    let file = filePath.split('/').slice(-1)[0];

    return {folders, file: stack.index + " " + file}
}


function createFolderHierarchy(stacks) {
    const stackTree = {};

     stacks.map(stack => {
        let parent = stackTree
        let structure = getStructureFolderFromStack(stack)
        structure.folders.forEach(folderName => {
            if (!parent[folderName]) {
                parent[folderName] = {};
            }
            parent = parent[folderName];
        });

        parent[structure.file] = true
    })

    return stackTree;
}

function createHtmlTreeFolderFromStacks(stacks) {
    let folderHierarchy = createFolderHierarchy(stacks)

    return createHTMLFolderTree(folderHierarchy)
}

export default  {
    createHTMLFolderTree,
    createFolderHierarchy,
    createHtmlTreeFolderFromStacks
}

