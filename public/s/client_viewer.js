let cryptMessage = ""
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
    let data = await response.json()
    console.log(data)
    if (data.length>0) {
        cryptMessage = data[0].message
        sender = data[0].name
        if (sender!="") {
            document.getElementById("sender-name").textContent=sender
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
    var bytes  = CryptoJS.AES.decrypt(data.message, password);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log(data.mid);
    console.log(data.message);
    console.log(originalText);

    // showing info
    document.getElementById("msgContent").textContent =  originalText
    
}

window.onload = function () {
    const viewMessage_btn = document.querySelector('#viewMessage')
    viewMessage_btn.onclick = handleViewing
}