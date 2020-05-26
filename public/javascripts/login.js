console.log("init")
var socket = io.connect('https://enigma.ivan780.duckdns.org');

var submitBtt = document.getElementById("submitBtt");
submitBtt.disabled = true;

var username = document.getElementById("username").innerText;

var inputUsername = document.getElementById("username");
var inputEmail = document.getElementById("email");

if (inputEmail){
    inputEmail.addEventListener('input', updateEmail);
}
if (inputUsername){
    inputUsername.addEventListener('input', updateUsername);
}

function updateUsername(e) {
    socket.emit('checkUsername', {
        payload: e.target.value
    }, function (responseData) {
        disabled(responseData)
    })
}

function updateEmail(e) {
    if(e.target.value === username){
        return disabled(true);
    }
    socket.emit('checkEmail', {
        payload: e.target.value

    }, function (responseData) {
        disabled(responseData)
    })
}

function disabled(state) {
    submitBtt.disabled = !state
}
