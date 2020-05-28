console.log("init")
var socket = io.connect('https://enigma.ivan780.duckdns.org');

var userCheck = false;
var emailCheck = false;
var passCheck = false;

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
var passReg = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
var pass = document.getElementById("pass");
pass.addEventListener('input', (e)=>{
    console.log(e.target.value+"//"+passReg.test(e.target.value))
    if (passReg.test(e.target.value)){
        passCheck = true;
        disabled()
    }
});

function updateUsername(e) {
    socket.emit('checkUsername', {
        payload: e.target.value
    }, function (responseData) {
        userCheck = responseData;
        disabled();
    })
}

function updateEmail(e) {
    if(e.target.value === username){
        return disabled(true);
    }
    socket.emit('checkEmail', {
        payload: e.target.value

    }, function (responseData) {
        emailCheck = !responseData;
        disabled();
    })
}

function disabled() {
    submitBtt.disabled = !(userCheck && emailCheck && passCheck);

}
