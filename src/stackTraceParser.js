class Stack {
    constructor(index, path, line, method) {
        this.index = index
        this.path = path
        this.line = line
        this.method = method
    }
}

function cleanAndSplitStackTrace(stackString) {
    return stackString
        .split(/\r?\n/)
        .map(stack => stack.trim())
}

function getErrorMessage(stackString) {
    return cleanAndSplitStackTrace(stackString)
        .filter(stackLine => !stackLine.startsWith("#"))
}

function getStackArray(stackString) {
    return cleanAndSplitStackTrace(stackString)
        .filter(stackLine => stackLine.startsWith("#"))
}

function removeRootFolderPath(path, stackArray) {
    let emptyString = ""
    return stackArray.map(stackLine => {
        return stackLine.replace(
            new RegExp(path + "?", "g"),
            emptyString
        )
    })
}

function stackLinesToObjects(stackArray) {
    return stackArray
        .filter(stackLine => stackLine !== "")
        .map(stackLine => {
            let items = stackLine.split(" ")

            let matches = items[1].match(/\((\d+)\):/)
            let path = items[1].replace(matches[0], '')

            path = !path.startsWith("/")
                ? "/" + path
                : path

            return new Stack(items[0], path, matches[1], items[2])

        });
}

export default {
    Stack,
    getErrorMessage,
    getStackArray,
    removeRootFolderPath,
    stackLinesToObjects
}

