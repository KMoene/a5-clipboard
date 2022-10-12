let cryptMessage = ""
let cryptImage = ""
let sender = ""

console.log("Loading data...")
const mid = window.location.search.replace(/[^0-9]/g,""),
    json = { mid:mid },
    body = JSON.stringify(json)
fetch('/getmessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
})
.then(async function (response) {
    console.log(response)
    let data = await response.json()
    console.log(data)
    if (data.length>0) {
        cryptMessage = data[0].message
        cryptImage = data[0].image
        sender = data[0].name
        if (sender!="") {
            document.getElementById("sender-name").textContent=sender
        }else{
            document.getElementById("sender-name").textContent="Anonymous"
        }
    }else{
        document.title = "Message Not Found | Moene's Secret Clipboard"
        document.getElementById("header2").textContent="404 Message Not Found"
        document.getElementById("text").textContent="We can not find the message you are looking for."
        document.getElementById("decrypt-form").style.visibility="hidden"
    }
})
// called when viewing message
const handleViewing = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()
    const password = document.querySelector('#password').value
    // Decrypt
    var bytes  = CryptoJS.AES.decrypt(cryptMessage, password);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    // Decrypt image
    console.log('cryptImage')
    console.log(cryptImage)
    var decryptedImage = CryptoJS.AES.decrypt(cryptImage, password)
    console.log(decryptedImage)
    var typedArray = convertWordArrayToUint8Array(decryptedImage)
    var fileDec = new Blob([typedArray])
    var img = document.createElement("img")
    var url = window.URL.createObjectURL(fileDec)
    img.src = url
    document.body.appendChild(img)

    // showing info
    document.getElementById("msgContent").textContent =  originalText
}

window.onload = function () {
    const viewMessage_btn = document.querySelector('#viewMessage')
    viewMessage_btn.onclick = handleViewing
}

function convertWordArrayToUint8Array(wordArray) {
    const arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : []
    const length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4
    let uInt8Array = new Uint8Array(length), index=0, word, i
    for (i=0; i<length; i++) {
        word = arrayOfWords[i]
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff
        uInt8Array[index++] = (word >> 8) & 0xff
        uInt8Array[index++] = word & 0xff
    }
    return uInt8Array;
}