export default {
    createList: function (tree) {
        // create the list element
        var list = document.createElement('ul');
        list.setAttribute('role', 'group')

        let treeKeys = Object.keys(tree).sort();

        // iterate over the array
        for (const key of treeKeys) {

            let item = tree[key]

            // create the list item
            var li = document.createElement('li');

            li.setAttribute('role', 'treeitem')
            li.setAttribute('aria-expanded', 'false')
            li.setAttribute('aria-selected', 'false')

            let text = document.createElement('span')
            text.textContent = key
            li.appendChild(text)

            if (key === 'vendor') {
                li.classList.add('vendor')
            }

            // check if the item is an object
            if (typeof item === 'object') {

                // if it is, call the function recursively to create a nested list
                li.appendChild(this.createList(item));
            } else {

                let matches = key.match(/#(\d+)/);

                // otherwise, set the text content of the list item
                li.textContent = key;
                li.setAttribute('id', 'stack-'+matches[1])
                li.classList.add('file')
            }

            // add the list item to the list
            list.appendChild(li);
        }

        // return the list
        return list;
    }
}

