var mensaje = document.getElementById("texto")
var boton = document.getElementById("send")
var room = window.location.pathname;

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
}
