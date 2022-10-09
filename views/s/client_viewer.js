// called when viewing message
const handleViewing = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()

    const mid = window.location.search.replace(/[^0-9]/g,""),
        password = document.querySelector('#password').value,
        json = { mid:mid },
        body = JSON.stringify(json)

    fetch('/getmessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })
    .then(async function (response) {
        let data = await response.json()
        data = data[0]
        console.log(data.message);
        // Decrypt
        var bytes  = CryptoJS.AES.decrypt(data.message, password);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        console.log(data.mid);
        console.log(data.message);
        console.log(originalText);

        // showing info
        document.getElementById("msgContent").textContent =  originalText
    })
}

window.onload = function () {
    const viewMessage_btn = document.querySelector('#viewMessage')
    viewMessage_btn.onclick = handleViewing
}