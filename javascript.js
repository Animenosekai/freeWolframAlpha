'use strict'

var xmlDownloadStore = ""
var equationStore = ""

const appid = [
    '26LQEH-YT3P6T3YY9',
    'K49A6Y-4REWHGRWW6',
    'J77PG9-UY8A3WQ2PG',
    'P3WLYY-2G9GA6RQGE',
    'P7JH3K-27RHWR53JQ',
    'L349HV-29P5JV8Y7J',
    '77PP56-XLQK5GKUAA',
    '59EQ3X-HE26TY2W64',
    '8Q68TL-QA8W9GEXAA',
    'KQRKKJ-8WHPY395HA',
    'AAT4HU-Q3RETTGY93',
    '7JKH84-T648HW2UV9',
    'WYEQU3-2T55JP3WUG',
    'T2XT8W-57PJW3L433',
    '2557YT-52JEY65G9K',
]

const corsProxy = 'https://cors-anywhere.herokuapp.com/'

const fixedEncodeURIComponent = str => 
    encodeURIComponent(str)
    .replace(/[-_.!~*'()]/g, char => '%' + char.charCodeAt(0).toString(16))


function goHome() {
    fetch(('/home.html'))
    .then(function(response) {
        return response.text();
    })
    .then(function(html) {
        document.getElementById('pod').innerHTML = html
    })
    fetch(('/homeResponsive.html'))
    .then(function(response) {
        return response.text();
    })
    .then(function(html) {
        document.getElementById('pod').innerHTML = document.getElementById('pod').innerHTML + html
    })
    document.getElementById('equationFooter').style.display = "none"
    title.innerText = "Wolfram|Alpha: Computational Intelligence"
}

window.onhashchange = _ => {
    equationInput.focus()
    equationInput.value = decodeURIComponent(location.hash.slice(1))
    document.getElementById("inputOutput").innerText = decodeURIComponent(location.hash.slice(1))
    if (decodeURIComponent(location.hash.slice(1)).replace(" ", '') == "") {
        document.getElementById("inputOutput").innerText = "Enter what you want to calculate or know about"
        goHome()
    }
}

window.onhashchange()

equationForm.onsubmit = async event => {
    //details.open = false
    if (event)
        event.preventDefault()
    progressBar.hidden = false
    const url =
    `
        ${corsProxy} api.wolframalpha.com/v2/query?
        &appid = ${appid[Date.now() % appid.length]}
        &input = ${location.hash = fixedEncodeURIComponent(equationInput.value)}
        &podstate = Step-by-step+solution
        &podstate = Step-by-step
        &podstate = Show+all+steps
        &scantimeout = 20
    `
    const response = await fetch(url.replace(/ /g, ''))
    const xml = await response.text()
    xmlDownloadStore = xml
    equationStore = equationInput.value
    progressBar.hidden = true
    if (xmlDownloadStore.includes('input parameter not present in query')) {
        goHome()
    } else {
        pod.innerHTML = xml.replace(/plaintext/g, 'pre')
                        .replace(/<pod title../g, '<h2>')
                        .replace(/.......scanner/gs, '</h2><!')
        document.getElementById('equationFooter').style.display = "block"
        Array.prototype.slice.call(document.getElementsByTagName('pre')).forEach(
            function(item) {
                item.replaceWith(document.createElement("hr"))
                item.remove();
                // or item.parentNode.removeChild(item); for older browsers (Edge-)
            });
        pod.querySelector('h2').style.marginTop = "10px"
        var HRs = pod.querySelectorAll('hr')
        HRs[HRs.length - 1].remove()
        title.innerText = equationInput.value + " - Wolfram|Alpha"
    }
}

if (equationInput.value)
    equationForm.onsubmit()


function download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(xmlDownloadStore));
    element.setAttribute('download', equationStore + " - Wolfram|Alpha Result.xml");
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
}


window.onresize = function() {
    if (window.innerWidth <= 700) {
        if (document.getElementById('extendedKeyboardContainer').getAttribute('keyboard-type') == 'normal') {
            fetch(('/extendedKeyboardResponsive.html'))
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                document.getElementById('extendedKeyboardContainer').innerHTML = html
            })
            document.getElementById('extendedKeyboardContainer').setAttribute('keyboard-type', 'responsive')
        }
        if (document.getElementById('footerContainer').getAttribute('footer-type') == "normal") {
            fetch(('/footerResponsive.html'))
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                document.getElementById('footerContainer').innerHTML = html
            })
            document.getElementById('footerContainer').setAttribute('footer-type', 'responsive')
        }
    } else {
        if (document.getElementById('extendedKeyboardContainer').getAttribute('keyboard-type') == 'responsive') {
            fetch(('/extendedKeyboard.html'))
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                document.getElementById('extendedKeyboardContainer').innerHTML = html
            })
            document.getElementById('extendedKeyboardContainer').setAttribute('keyboard-type', 'normal')
        }
        if (document.getElementById('footerContainer').getAttribute('footer-type') == 'responsive') {
            fetch(('/footer.html'))
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                document.getElementById('footerContainer').innerHTML = html
            })
            document.getElementById('footerContainer').setAttribute('footer-type', 'normal')
        }
    }
}

window.onload = function() {
    if (window.innerWidth <= 700) {
        fetch(('/extendedKeyboardResponsive.html'))
        .then(function(response) {
            return response.text();
        })
        .then(function(html) {
            document.getElementById('extendedKeyboardContainer').innerHTML = html
        })
        document.getElementById('extendedKeyboardContainer').setAttribute('keyboard-type', 'responsive')
        fetch(('/footerResponsive.html'))
        .then(function(response) {
            return response.text();
        })
        .then(function(html) {
            document.getElementById('footerContainer').innerHTML = html
        })
        document.getElementById('footerContainer').setAttribute('footer-type', 'responsive')
        
    } else {
        document.getElementById('extendedKeyboardContainer').setAttribute('keyboard-type', 'normal')
        fetch(('/footer.html'))
        .then(function(response) {
            return response.text();
        })
        .then(function(html) {
            document.getElementById('footerContainer').innerHTML = html
        })
        document.getElementById('footerContainer').setAttribute('footer-type', 'normal')
        
    }
}

function addSpecial(specialCharButton) {
    equationInput.value = equationInput.value + specialCharButton.getAttribute("value")
    document.getElementById("inputOutput").innerText = equationInput.value
}


function addInput() {
    document.getElementById("inputOutput").innerText = document.getElementById("equationInput").value
    if (equationInput.value.replace(" ", '') == "") {
        document.getElementById("inputOutput").innerText = "Enter what you want to calculate or know about"
    }
}
