async function autocompleteClickHandler(elem) {
    document.getElementById("equationInput").value = elem.innerText
    inputSubmit()
}

function createAutocompleteElement(complete, query) {
    let newListElement = document.createElement("li")
    newListElement.classList.add("autocomplete-list-element")
    let newAnchor = document.createElement("a")
    newAnchor.setAttribute("onclick", 'autocompleteClickHandler(this)')
    newAnchor.classList.add("autocomplete-anchor")
    let newSpan = document.createElement("span")
    let bold = ""
    let nonBold = ""
    let checkingBold = true
    for (var index = 0; index < complete.length; index++) {
        if (index < query.length && complete[index].toLowerCase() == query[index].toLowerCase() && checkingBold) {
            bold += complete[index]
        } else {
            checkingBold = false
            nonBold += complete[index]
        }
    }
    if (bold.length > 0) {
        let newBoldSpan = document.createElement("span")
        newBoldSpan.classList.add("autocomplete-bold-span")
        newBoldSpan.innerText = bold
        newSpan.appendChild(newBoldSpan)
    }
    newSpan.innerHTML += nonBold
    newAnchor.appendChild(newSpan)
    newListElement.appendChild(newAnchor)
    return newListElement
}

async function autocomplete() {
    result = await request(AUTOCOMPLETE_URL.format({question: encode(document.getElementById("equationInput").value)}))
    if (result) {
        let newAutocompleteList = document.createElement("ul")
        newAutocompleteList.classList.add("autocomplete-list")
        for (index in result.results) {
            newAutocompleteList.appendChild(createAutocompleteElement(result.results[index].input, result.query))
        }
        while (document.getElementById("autocompleteResults").firstElementChild != null) {
            document.getElementById("autocompleteResults").firstElementChild.remove()
        }
        document.getElementById("autocompleteResults").appendChild(newAutocompleteList)
    }
}