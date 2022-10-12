// called when posting message
var myCodeMirror
var mLink = ''
var reader
let imageValid = false
const handleNewMessage = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()
    reader = new FileReader()
    const image = document.querySelector('#newImage').files[0]
    try {
        reader.readAsArrayBuffer(image)
    }catch{
        console.log("invalid image")
        sendMessage();
    }
    reader.onload = () => {
        imageValid = true
        console.log("image valid")
        sendMessage();
    }
}
function sendMessage() {
    console.log("Sending message...")
    const message = myCodeMirror.getDoc().getValue(),
        password = document.querySelector('#password').value,
        // encrypt the message
        ciphertext = CryptoJS.AES.encrypt(message, password).toString()
    // Image Encryption
    let encryptedImage = ''
    let isAnonymous = document.getElementById("is-anonymous").checked;
    let inclPasswd = document.getElementById("incl-password").checked;
    const wordArray = CryptoJS.lib.WordArray.create(reader.result)
    let json = {}
    if (imageValid) {
        encryptedImage = CryptoJS.AES.encrypt(wordArray, password).toString()
        json = { message: ciphertext, image: encryptedImage, action: "new", anonymous: isAnonymous }
    } else {
        json = { message: ciphertext, image: '', action: "new", anonymous: isAnonymous }
    }
    body = JSON.stringify(json)

    // Send data to server
    fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })
        .then(async function (response) {
            let data = await response.json()

            // DEGUB: Decrypt 
            var bytes = CryptoJS.AES.decrypt(data.msg, password);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            console.log(data.mid);
            console.log(data.msg);
            console.log(originalText);
            // end of DEBUG

            // adding info
            const origin = window.location.host
            document.getElementById("msg-link").style.visibility = "visible";
            if (location.protocol !== 'https:') {
                document.getElementById("msgLink").value = "http://" + origin + "/s/?m=" + data.mid
            } else {
                document.getElementById("msgLink").value = "https://" + origin + "/s/?m=" + data.mid
            }

        })
}

const labels = document.querySelectorAll(".form-control label");

labels.forEach((label) => {
    label.innerHTML = label.innerText
        .split("")
        .map(
            (letter, idx) =>
                `<span style="transition-delay:${idx * 50}ms">${letter}</span>`
        )
        .join("")
})

window.onload = function () {
    const addMessage_btn = document.querySelector('#addNewMessage')
    addMessage_btn.onclick = handleNewMessage
    myCodeMirror = CodeMirror.fromTextArea(document.getElementById("newMessage"), {
        lineNumbers: true,
        gutter: true,
        lineWrapping: true,
        theme: "monokai",
        styleActiveLine: { nonEmpty: true },
        styleActiveSelected: true,
    });
}