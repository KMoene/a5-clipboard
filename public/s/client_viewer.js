let cryptMessage = ""
let cryptImage = ""
let sender = ""
const myCodeMirror = CodeMirror.fromTextArea(document.getElementById("msgContent"), {
    lineNumbers: true,
    gutter: true,
    lineWrapping: true,
    theme: "monokai",
    styleActiveLine: { nonEmpty: true },
    styleActiveSelected: true,
});
console.log("Loading data...")
const params = new URLSearchParams(window.location.search);
mid = params.get('m')
let passwd = params.get('p')
console.log(passwd)
fetch('/getmessage?mid=' + mid, {
    method: 'GET'
})
    .then(async function (response) {
        console.log(response)
        let data = await response.json()
        console.log(data)
        if (data.length > 0) {
            cryptMessage = data[0].message
            cryptImage = data[0].image
            sender = data[0].name
            if (sender != "") {
                document.getElementById("sender-name").textContent = sender
            } else {
                document.getElementById("sender-name").textContent = "Anonymous"
            }
            document.getElementById("decrypt-form").style.visibility = "visible"
            document.getElementById("msg").style.visibility = "visible"
            if (passwd != null) {
                // Decrypt
                var bytes = CryptoJS.AES.decrypt(cryptMessage, passwd);
                var originalText = bytes.toString(CryptoJS.enc.Utf8);
                // Decrypt image
                if (cryptImage != '' && originalText != "") {
                    var decryptedImage = CryptoJS.AES.decrypt(cryptImage, passwd)
                    try {
                        var typedArray = convertWordArrayToUint8Array(decryptedImage)
                        var fileDec = new Blob([typedArray])
                        var img = document.createElement("img")
                        var url = window.URL.createObjectURL(fileDec)
                        img.src = url
                        img.style = "width:100%;"
                        container = document.getElementById('container')
                        container.appendChild(img)
                    } catch (error) {
                    }
                }
                if(originalText!=""){
                    document.getElementById("decrypt-form").style.visibility = "hidden"
                }
                // showing info
                myCodeMirror.getDoc().setValue(originalText)
            }
        } else {
            document.title = "Message Not Found | Moene's Secret Clipboard"
            document.getElementById("header2").textContent = "404 Message Not Found"
            document.getElementById("text").textContent = "We can not find the message you are looking for."
        }
    })

// called when viewing message
const handleViewing = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()
    const password = document.querySelector('#password').value
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(cryptMessage, password);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    // Decrypt image
    if (cryptImage != '' && originalText != "") {
        var decryptedImage = CryptoJS.AES.decrypt(cryptImage, password)
        try {
            var typedArray = convertWordArrayToUint8Array(decryptedImage)
            var fileDec = new Blob([typedArray])
            var img = document.createElement("img")
            var url = window.URL.createObjectURL(fileDec)
            img.src = url
            container = document.getElementById('container')
            container.appendChild(img)
        } catch (error) {

        }
    }

    // showing info
    myCodeMirror.getDoc().setValue(originalText)
}

window.onload = function () {
    const viewMessage_btn = document.querySelector('#viewMessage')
    viewMessage_btn.onclick = handleViewing
}

function convertWordArrayToUint8Array(wordArray) {
    const arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : []
    const length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4
    let uInt8Array = new Uint8Array(length), index = 0, word, i
    for (i = 0; i < length; i++) {
        word = arrayOfWords[i]
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff
        uInt8Array[index++] = (word >> 8) & 0xff
        uInt8Array[index++] = word & 0xff
    }
    return uInt8Array;
}