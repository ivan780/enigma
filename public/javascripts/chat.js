var mensaje = document.getElementById("texto")
var room = window.location.pathname;
var chat = document.getElementById("chat")

var socket = io.connect('https://enigma.ivan780.duckdns.org');
var socket = io.connect();
joinRoom();

mensaje.addEventListener("keyup", sendMessage);

window.addEventListener("beforeunload", function () {
    socket.emit('leave', room)
})

socket.on("receive", function (data) {
    setChat(data.Message, false, data.Time)
})

function joinRoom() {
    console.log(room)
    socket.emit('create', room);
}

function sendMessage() {
    var d = new Date();
    var hour = d.getHours().toString() + ":" +(d.getMinutes()<10?'0':'') + d.getMinutes().toString();
    if (event.keyCode === 13) {
        socket.emit("send", {
            Room: room,
            Message: mensaje.value,
            Time: hour
        });
        setChat(mensaje.value, true, hour)
        mensaje.value = "";
    }

}

/**
 * let message = document.createElement("p");
 message.setAttribute("id", "ola");
 message.appendChild(document.createTextNode(msg));
 chat.appendChild(message);
 */
function setChat(msg, local, time_) {
    let delivery;
    if (local) {
        delivery = "self"
    }else {
        delivery = "other"
    }
    let li = document.createElement("li");
    li.setAttribute("class", delivery);

    let div = document.createElement("div");
    div.setAttribute("class", "msg");

    let p = document.createElement("p")
    p.appendChild(document.createTextNode(msg));

    let time = document.createElement("time")
    time.appendChild(document.createTextNode(time_))


    div.appendChild(time);
    div.appendChild(p);
    li.appendChild(div)
    chat.appendChild(li)
}
