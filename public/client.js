// called when posting message
const handleNewMessage = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()

    const message = document.querySelector('#newMessage').value,
        image = document.querySelector('#newImage').files[0],
        password = document.querySelector('#password').value,
        // encrypt the message
        ciphertext = CryptoJS.AES.encrypt(message, password).toString(),
        reader = new FileReader()

    reader.onload = () => {
        // Image Encryption
        let encryptedImage = ''
        console.log(reader.result)
        const wordArray = CryptoJS.lib.WordArray.create(reader.result)
        console.log(wordArray)
        encryptedImage = CryptoJS.AES.encrypt(wordArray, password).toString()
        console.log(encryptedImage)
        const json = { message: ciphertext, image: encryptedImage, action: "new" },
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
            var bytes  = CryptoJS.AES.decrypt(data.msg, password);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            console.log(data.mid);
            console.log(data.msg);
            console.log(originalText);
            // end of DEBUG

            // adding info
            const origin = window.location.host
            document.getElementById("msg-link").style.visibility="visible";
            if (location.protocol !== 'https:') {
                document.getElementById("msgLink").value =  "http://"+origin+"/s/?m=" + data.mid
            }else{
                document.getElementById("msgLink").value =  "https://"+origin+"/s/?m=" + data.mid
            }
            
        })
    }
    reader.readAsArrayBuffer(image)
}


window.onload = function () {
    const addMessage_btn = document.querySelector('#addNewMessage')
    addMessage_btn.onclick = handleNewMessage
}

