var coords = []
var stop = false

var options = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 0
};

function success(pos) {
    var crd = [pos.coords.latitude, pos.coords.longitude]

    if (
        coords.length > 0 &&
        coords[coords.length-1][0] == crd[0] &&
        coords[coords.length-1][1] == crd[1]
    ) return

    coords.push(`[${crd}]`)
};

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
};

function stopLiveTraking() {
    stop = true
}

function getCoords(url) {
    setTimeout(function(){
        //navigator.geolocation.getCurrentPosition(success, error, options);
        
        //TEST
        coords.push(`[${Math.random()}, ${Math.random()}]`)
        console.log(url, coords[coords.length-1])
        
        document.getElementById("textarea").value = coords
        postToApi(url, coords[coords.length-1])
        
        if (!stop)
            getCoords(url)
        else
            stop = false
        
    }, 2000)
}

function postToApi(url, body) {
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    })
    .catch(err => console.log("Failed to post coordinates"))
}

function saveTextAsFile(textToWrite, fileNameToSaveAs) {
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'}); 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    
    downloadLink.click();
}