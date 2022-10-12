// called when posting message
const handleNewMessage = function(e) {
        // prevent default form action from being carried out
        e.preventDefault()

        const message = document.querySelector('#newMessage').value,
            password = document.querySelector('#password').value,
            // encrypt the message
            ciphertext = CryptoJS.AES.encrypt(message, password).toString(),
            json = { message: ciphertext, action: "new" },
            body = JSON.stringify(json)

        fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body
            })
            .then(async function(response) {
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
    //form wave
const labels = document.querySelectorAll(".form-control label");

labels.forEach((label) => {
    label.innerHTML = label.innerText
        .split("")
        .map(
            (letter, idx) =>
            `<span style="transition-delay:${idx * 50}ms">${letter}</span>`
        )
        .join("");
});



window.onload = function() {
    const addMessage_btn = document.querySelector('#addNewMessage')
    addMessage_btn.onclick = handleNewMessage
}