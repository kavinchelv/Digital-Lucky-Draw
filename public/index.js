localStorage[0] = 0;
localStorage[1] = 0;
localStorage[2] = 0;
localStorage[3] = 0;
localStorage[4] = 0;
localStorage[5] = 0;
localStorage[6] = 0;
localStorage[7] = 0;
localStorage[8] = 0;
localStorage[9] = 0;
document.getElementById('registerForm').addEventListener('submit', submitForm);

function redirect() {
        document.location.href = "./lucky.html";
}

function submitForm(e) {
    e.preventDefault();
    var day = document.querySelector('input[name = "Lucky Draw"]:checked').value;
    console.log(day);
    localStorage[9] = day;
    console.log(localStorage[9]);
    redirect();
}