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