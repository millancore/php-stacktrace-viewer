export default  {

    createTable: function (stacks, tbody) {

        tbody.innerHTML = ''
        stacks = stacks.reverse();

        stacks.forEach(stack => {
            let tr = document.createElement('tr')
            let important = false

            for (let field in stack) {
                let td = document.createElement('td')
                let value = stack[field]

                if (field === 'path' && !value.includes('vendor')) {
                    important = true
                }

                td.innerHTML = value
                tr.appendChild(td)
            }

            if (important) {
                tr.classList.add('important')
            }

            tbody.appendChild(tr)
        })

       return tbody;
    }
}