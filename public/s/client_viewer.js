let cryptMessage = ""
let sender = ""
var myCodeMirror
console.log("Loading data...")
const mid = window.location.search.replace(/[^0-9]/g,"")
fetch('/getmessage?mid='+mid, {
    method: 'GET'
})
.then(async function (response) {
    let data = await response.json()
    console.log(data)
    if (data.length>0) {
        cryptMessage = data[0].message
        sender = data[0].name
        if (sender!="") {
            document.getElementById("sender-name").textContent=sender
        }else{
            document.getElementById("sender-name").textContent="Anonymous"
        }
        myCodeMirror = CodeMirror.fromTextArea(document.getElementById("msgContent"),{
            lineNumbers: true,
            gutter: true,
            lineWrapping: true,
            theme:"monokai",
            styleActiveLine: {nonEmpty: true},
            styleActiveSelected: true,
        });
    }else{
        document.title = "Message Not Found | Moene's Secret Clipboard"
        document.getElementById("header2").textContent="404 Message Not Found"
        document.getElementById("text").textContent="We can not find the message you are looking for."
        document.getElementById("decrypt-form").style.visibility="hidden"
        document.getElementById("msg").style.visibility="hidden"
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
    // showing info
    myCodeMirror.getDoc().setValue(originalText)
}

window.onload = function () {
    const viewMessage_btn = document.querySelector('#viewMessage')
    viewMessage_btn.onclick = handleViewing
}