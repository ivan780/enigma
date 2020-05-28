console.log("init")
var socket = io.connect('https://enigma.ivan780.duckdns.org');

var submitBtt = document.getElementById("submitBtt");
submitBtt.disabled = true;

var username = document.getElementById("username").innerText;

var inputEmail = document.getElementById("email");

if (inputEmail){
    inputEmail.addEventListener('input', updateEmail);
}

function updateEmail(e) {
    if(e.target.value === username){
        return disabled(true);
    }
    socket.emit('checkEmail', {
        payload: e.target.value

    }, function (responseData) {
        emailCheck = responseData;
        disabled();
    })
}

function disabled() {
    submitBtt.disabled = !(userCheck && emailCheck && passCheck);

}
