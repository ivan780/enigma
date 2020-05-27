var mensaje = document.getElementById("texto")
var boton = document.getElementById("send")
var room = window.location.pathname;
var chat = document.getElementById("chat")

var socket = io.connect('https://enigma.ivan780.duckdns.org');
var socket = io.connect();
joinRoom();

boton.addEventListener('click', sendMessage);
window.addEventListener("beforeunload", function () {
    socket.emit('leave', room)
})

socket.on("receive", function (data) {
    console.log(data)
})

function joinRoom() {
    console.log(room)
    socket.emit('create', room);
}

function sendMessage() {
    socket.emit("send", {
        Room: room,
        Message: mensaje.value
    });
    setChat(mensaje.value, true)
}

function setChat(msg, local) {
    if (local) {
        let message = document.createElement("p");
        message.setAttribute("id", "ola")
        chat.appendChild(message)
    }else {
    }
}
