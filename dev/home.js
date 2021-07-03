async function goHome() {
    states.home = true;
    resizeHandler()
    window.location.hash = ""
    document.getElementById('equationFooter').style.display = "none"
    title.innerText = "Wolfram|Alpha: Computational Intelligence"
}