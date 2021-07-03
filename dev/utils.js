String.prototype.format = function () {
    /* C / Python like string formatter --> "Hello {name}".format("world") */
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments) :
            arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};


async function download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(store.xml));
    element.setAttribute('download', store.equation + " - Wolfram|Alpha Result.xml");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

async function addSpecial(specialCharButton) {
    equationInput.value = equationInput.value + specialCharButton.getAttribute("value")
    //document.getElementById("inputOutput").innerText = equationInput.value
}

/*
async function addInput() {
    document.getElementById("inputOutput").innerText = document.getElementById("equationInput").value
    if (equationInput.value.replace(" ", '') == "") {
        document.getElementById("inputOutput").innerText = "Enter what you want to calculate or know about"
    }
}
*/

function encode(value) {
    return encodeURIComponent(String(value)).replace(/[-_.!~*'()]/g, char => '%' + char.charCodeAt(0).toString(16))
}