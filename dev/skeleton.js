async function createSkeleton() {
    let newElem = document.createElement("queryresult")
    let newHeader = document.createElement("h2")
    newHeader.classList.add("pod-header")
    newHeader.classList.add("skeleton-box")
    newHeader.style.borderRadius = "8px 8px 0 0"
    newElem.appendChild(newHeader)
    let newSubPod = document.createElement("subpod")
    newSubPod.style.height = "25px"
    newElem.appendChild(newSubPod)
    
    newHeader = document.createElement("h2")
    newHeader.classList.add("pod-header")
    newHeader.classList.add("skeleton-box")
    newElem.appendChild(newHeader)
    newSubPod = document.createElement("subpod")
    newSubPod.style.height = "150px"
    newElem.appendChild(newSubPod)
    
    newHeader = document.createElement("h2")
    newHeader.classList.add("pod-header")
    newHeader.classList.add("skeleton-box")
    newElem.appendChild(newHeader)
    newSubPod = document.createElement("subpod")
    newSubPod.style.height = "35px"
    newElem.appendChild(newSubPod)
    
    newHeader = document.createElement("h2")
    newHeader.classList.add("pod-header")
    newHeader.classList.add("skeleton-box")
    newElem.appendChild(newHeader)
    newSubPod = document.createElement("subpod")
    newSubPod.style.height = "120px"
    newElem.appendChild(newSubPod)


    for (var i = 0; i < 5; i++) {
        newHeader = document.createElement("h2")
        newHeader.classList.add("pod-header")
        newHeader.classList.add("skeleton-box")
        newElem.appendChild(newHeader)
        newSubPod = document.createElement("subpod")
        newSubPod.style.height = (Math.random() * 200 + 15).toString() + "px"
        newElem.appendChild(newSubPod)
    }
    

    document.getElementById("pod").innerHTML = ""
    document.getElementById("pod").appendChild(newElem)
    document.getElementById("pod-height").style.height = document.getElementById("pod").offsetHeight + 50 + "px"
}