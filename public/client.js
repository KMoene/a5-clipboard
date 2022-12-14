// called when posting message
var myCodeMirror
var mLink = ''
var reader
let imageValid = false
const handleNewMessage = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()
    const password = document.querySelector('#password').value
    if (password === "") {
        document.querySelector('#warning').innerHTML =  "<span style='color: crimson; font-size:18px'>Warning: Password can not be empty!</span>"
        return console.log("password is empty!");
    }
    document.querySelector('#warning').innerText = ""
    document.querySelector('#addNewMessage').innerText = "Submitting..."
    reader = new FileReader()
    const image = document.querySelector('#newImage').files[0]
    reader.onload = () => {
        imageValid = true
        console.log("image valid")
        sendMessage();
        document.querySelector('#password').value = ""
    }
    try {
        reader.readAsArrayBuffer(image)
    } catch {
        console.log("invalid image")
        sendMessage();
        document.querySelector('#password').value = ""
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
            document.getElementById("msg-link").style.visibility = "visible"
            let link = ''
            if (location.protocol !== 'https:') {
                if (inclPasswd) {
                    link = "http://" + origin + "/s/?m=" + data.mid+"&p="+password
                } else {
                    link = "http://" + origin + "/s/?m=" + data.mid
                }
            } else {
                if (inclPasswd) {
                    link = "https://" + origin + "/s/?m=" + data.mid+"&p="+password
                } else {
                    link = "https://" + origin + "/s/?m=" + data.mid
                }
            }
            document.getElementById("msgLink").value = link
            document.getElementById("copy").onclick = () =>{
                navigator.clipboard.writeText(link)
            }
            document.querySelector('#addNewMessage').innerText = "Add"
            myCodeMirror.getDoc().setValue("")
            document.querySelector('#newImage').value = null
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