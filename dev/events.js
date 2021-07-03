async function hashChange() {
    equationInput.focus()
    equationInput.value = decodeURIComponent(location.hash.slice(1))
    //document.getElementById("inputOutput").innerText = decodeURIComponent(location.hash.slice(1))
    if (decodeURIComponent(location.hash.slice(1)).replace(" ", '') == "") {
        //document.getElementById("inputOutput").innerText = "Enter what you want to calculate or know about"
        goHome()
    }
}

function parse() {
    Array.prototype.slice.call(document.getElementsByTagName('pre')).forEach((item) => {
        try {
            item.remove();
        } catch {
            console.warn("An error occured while removing the following item")
            console.log(item)
        }
    });
    Array.prototype.forEach.call(document.getElementById("pod").getElementsByTagName("h2"), (item) => {
        try {
            item.classList.add("pod-header")
        } catch {
            console.warn("An error occured while setting the pod-header with the following item")
            console.log(item)
        }
    });
    Array.prototype.forEach.call(document.getElementById("pod").getElementsByTagName("img"), (item) => {
        try {
            if (item.parentNode.tagName == "SUBPOD" && item.parentNode.getAttribute("title") == "") {
                item.setAttribute("onclick", "document.getElementById('equationInput').value = this.getAttribute('alt'); inputSubmit();")
                item.classList.add("clickable-result")
            }
        } catch {
            console.warn("An error occured while setting the direct query for the following item")
            console.log(item)
        }
    });
    Array.prototype.forEach.call(document.getElementById("pod").getElementsByTagName("info"), (item) => {
        try {
            item.querySelector("img").setAttribute("onclick", "window.open(this.parentNode.querySelector('link').getAttribute('url'), '_blank')")
        } catch {
            console.warn("An error occured while setting the info linking for the following item")
            console.log(item)
        }
    });
    document.getElementById("pod-height").style.height = document.getElementById("pod").offsetHeight + 50 + "px"
    document.getElementById('equationFooter').style.display = "block"
}

async function inputSubmit() {
    try {
        document.querySelectorAll("relatedqueries").forEach((item) => {
            item.remove()
        })
        document.querySelectorAll("related-height").forEach((item) => {
            item.remove()
        })
    } catch {
        console.info("No Related Queries Container to remove")
    }
    document.getElementById("pod").setAttribute("home-type", "")
    createSkeleton()
    document.getElementById('equationFooter').style.display = "none"
    if (document.getElementById("equationInput").value.replace(" ", '') == "") {
        goHome();
        return;
    }
    window.location.hash = encode(document.getElementById("equationInput").value)
    states.currentEquation++;
    let equationNumber = states.currentEquation
    document.getElementById("equationInput").focus()
    document.getElementById("equationInput").blur()
    document.querySelector("title").innerText = document.getElementById("equationInput").value + " - Wolfram|Alpha"
    request(QUERY_URL.format({
            question: encode(document.getElementById("equationInput").value),
            timeout: String(TIMEOUT)
        }))
        .then((xml) => {
            if (xml) {
                if (states.currentEquation == equationNumber) {
                    store.xml = xml
                    store.equation = document.getElementById("equationInput").value
                    if (store.xml.includes('input parameter not present in query')) {
                        goHome()
                    } else {
                        states.home = false
                        document.getElementById("pod").innerHTML = xml.replace(/plaintext/g, 'pre').replace(/<pod title../g, '<h2>').replace(/.......scanner/gs, '</h2><!')
                        parse()
    
                        if (document.querySelector("didyoumeans")) {
                            document.querySelector("didyoumeans").lastElementChild.style.marginBottom = "20px"
                            document.querySelectorAll("didyoumean").forEach((item) => {
                                item.setAttribute("onclick", "document.getElementById('equationInput').value = this.innerText; inputSubmit();")
                            })
                        }
    
                        if (document.querySelector("tips")) {
                            document.querySelector("tips").lastElementChild.style.marginBottom = "20px"
                        }
    
                        // related queries
                        if (document.getElementById("pod").querySelector("queryresult").getAttribute("related") != "") {
                            url = new URL(document.getElementById("pod").querySelector("queryresult").getAttribute("related"))
                            request(RELATEDQUERIES_URL.format({
                                    domain: url.host,
                                    id: url.searchParams.get("id")
                                }))
                                .then((response) => {
                                    if (response) {
                                        let tempRelated = document.createElement("temp")
                                        tempRelated.innerHTML = response
                                        if (tempRelated.querySelector("relatedqueries").getAttribute("count") != "0") {
                                            document.getElementById("pod-height").parentNode.appendChild(tempRelated.querySelector("relatedqueries"))
                                            document.querySelector("relatedqueries").lastElementChild.style.marginBottom = "20px"
                                            let newRelatedHeight = document.createElement("related-height")
                                            newRelatedHeight.style.height = document.querySelector("relatedqueries").offsetHeight + 50 + "px"
                                            newRelatedHeight.style.display = "block"
                                            document.getElementById("pod-height").parentNode.appendChild(newRelatedHeight)
                                            document.querySelectorAll("relatedquery").forEach((item) => {
                                                item.setAttribute("onclick", "document.getElementById('equationInput').value = this.innerText; inputSubmit();")
                                            })
                                        }
                                    }
                                })
                        }
    
                        // WolframAlpha's "lazy" loading of queryresult
                        if (document.getElementById("pod").querySelector("queryresult").getAttribute("recalculate") != "") {
                            url = new URL(document.getElementById("pod").querySelector("queryresult").getAttribute("recalculate"))
                            request(RECALCULATION_URL.format({
                                    domain: url.host,
                                    id: url.searchParams.get("id")
                                }))
                                .then((response) => {
                                    if (response) {
                                        let tempElem = document.createElement("temp")
                                        store.xml += response
                                        tempElem.innerHTML = response.replace(/plaintext/g, 'pre').replace(/<pod title../g, '<h2>').replace(/.......scanner/gs, '</h2><!') // same stuff as above
                                        document.getElementById("pod").querySelector("queryresult").innerHTML += tempElem.querySelector("queryresult").innerHTML
                                        parse() // reparse everything to format
    
                                        // retry once more, just to be sure
                                        if (tempElem.querySelector("queryresult").getAttribute("recalculate") != "") {
                                            url = new URL(tempElem.querySelector("queryresult").getAttribute("recalculate"))
                                            request(RECALCULATION_URL.format({
                                                    domain: url.host,
                                                    id: url.searchParams.get("id")
                                                }))
                                                .then((response) => {
                                                    if (response) {
                                                        tempElem = document.createElement("temp")
                                                        store.xml += response
                                                        tempElem.innerHTML = response.replace(/plaintext/g, 'pre').replace(/<pod title../g, '<h2>').replace(/.......scanner/gs, '</h2><!')
                                                        document.getElementById("pod").querySelector("queryresult").innerHTML += tempElem.querySelector("queryresult").innerHTML
                                                        parse()
                                                    }
                                                })
                                        }
                                    }
                                })
                        }
                    }
                }
            } else { // xml is null
                console.warn("Couldn't get any result")
                let newQueryResult = document.createElement("queryresult")
                let newTips = document.createElement("tips")
                let newTip = document.createElement("tip")
                newTip.style.marginBottom = "20px"
                newTip.setAttribute("text", "We are very sorry but an error occured on the server or the connection timed out.")
                newTips.appendChild(newTip)
                newQueryResult.appendChild(newTips)
                document.getElementById("pod").innerHTML = ""
                document.getElementById("pod").appendChild(newQueryResult)
                document.getElementById("pod-height").style.height = document.getElementById("pod").offsetHeight + 50 + "px"
            }
        })
}

async function resizeHandler() {
    if (window.innerWidth <= 700) {
        try {
            if (document.getElementById('extendedKeyboardContainer').getAttribute('keyboard-type') != 'responsive') {
                if (caches.responsiveKeyboard) {
                    html = caches.responsiveKeyboard
                } else {
                    response = await fetch('/parts/extendedKeyboardResponsive.html')
                    html = await response.text()
                    caches.responsiveKeyboard = html
                }
                document.getElementById('extendedKeyboardContainer').innerHTML = html
                document.getElementById('extendedKeyboardContainer').setAttribute('keyboard-type', 'responsive')
            }
        } catch {
            console.warn("Error while handling responsive for the extended keyboard")
        }
        try {
            if (document.getElementById('footerContainer').getAttribute('footer-type') != "responsive") {
                if (caches.responsiveFooter) {
                    html = caches.responsiveFooter
                } else {
                    response = await fetch("/parts/footerResponsive.html")
                    html = await response.text()
                    caches.responsiveFooter = html
                }
                document.getElementById('footerContainer').innerHTML = html
                document.getElementById('footerContainer').setAttribute('footer-type', 'responsive')
            }
        } catch {
            console.warn("Error while handling responsive for the footer")
        }
        try {
            if (states.home && document.getElementById('pod').getAttribute('home-type') != "responsive") {
                if (caches.responsiveHome) {
                    html = caches.responsiveHome
                } else {
                    response = await fetch("/parts/homeResponsive.html")
                    html = await response.text()
                    caches.responsiveHome = html
                }
                document.getElementById('pod').innerHTML = html
                document.getElementById('pod').setAttribute('home-type', 'responsive')
            }
            document.getElementById("pod-height").style.height = document.getElementById("pod").offsetHeight + 50 + "px"
        } catch {
            console.warn("Error while handling responsive for the home")
        }
    } else {
        try {
            if (document.getElementById('extendedKeyboardContainer').getAttribute('keyboard-type') != 'normal') {
                if (caches.keyboard) {
                    html = caches.keyboard
                } else {
                    response = await fetch('/parts/extendedKeyboard.html')
                    html = await response.text()
                    caches.keyboard = html
                }
                document.getElementById('extendedKeyboardContainer').innerHTML = html
                document.getElementById('extendedKeyboardContainer').setAttribute('keyboard-type', 'normal')
            }
        } catch {
            console.warn("Error while handling responsive for the extended keyboard")
        }
        try {
            if (document.getElementById('footerContainer').getAttribute('footer-type') != 'normal') {
                if (caches.footer) {
                    html = caches.footer
                } else {
                    response = await fetch('/parts/footer.html')
                    html = await response.text()
                    caches.footer = html
                }
                document.getElementById('footerContainer').innerHTML = html
                document.getElementById('footerContainer').setAttribute('footer-type', 'normal')
            }
        } catch {
            console.warn("Error while handling responsive for the footer")
        }
        try {
            if (states.home && document.getElementById('pod').getAttribute('home-type') != 'normal') {
                if (caches.home) {
                    html = caches.home
                } else {
                    response = await fetch('/parts/home.html')
                    html = await response.text()
                    caches.home = html
                }
                document.getElementById('pod').innerHTML = html
                document.getElementById('pod').setAttribute('home-type', 'normal')
            }
            document.getElementById("pod-height").style.height = document.getElementById("pod").offsetHeight + 50 + "px"
        } catch {
            console.warn("Error while handling responsive for the home")
        }
    }
}

window.addEventListener("load", resizeHandler)
window.addEventListener("load", () => {
    hashChange()
        .then(() => {
            inputSubmit()
            resizeHandler()
        })
    document.getElementById("equationForm").addEventListener("submit", (e) => {
        e.preventDefault(); // prevents it from reloading
        inputSubmit()
    })
    document.getElementById("equationInput").addEventListener("keydown", () => {
        setTimeout(() => {
            autocomplete()
        }, 50);
    })
    document.getElementById("equationInput").addEventListener("focus", () => {
        document.getElementById("autocompletionContainer").classList.add("autocompletion-container-shown")
    })
    document.getElementById("equationInput").addEventListener("blur", () => {
        setTimeout(() => {
            if (document.activeElement !== document.getElementById("equationInput")) {
                document.getElementById("autocompletionContainer").classList.remove("autocompletion-container-shown")
            }
        }, 100);
    })
})
window.addEventListener("hashchange", hashChange)
window.addEventListener("resize", resizeHandler)