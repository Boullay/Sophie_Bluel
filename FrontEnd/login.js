const email = document.querySelector('#email');
const password = document.querySelector('#password');
const form = document.querySelector('form');
form.addEventListener("submit", (e) => {
    e.preventDefault();

    fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    })
        .then((response) => {
            if(response.ok && response.status === 200){
                return response.json();
            } else {
                const alert = document.createElement('p');
                const mail = document.querySelector('form');
                alert.innerHTML = "Adresse mail/mot de passe incorrecte";
                alert.className = 'alert';
                mail.appendChild(alert);
                return false
            }
        })
        .then((user) => {
            console.log(user);
            if(user.token){
                window.localStorage.setItem("accessToken", user.token);
                const fullUrl = window.location.pathname;
                const split = window.location.pathname.split('/');
                const newUrl = fullUrl.replace(split[split.length - 1], '') + 'index.html';
                console.log(fullUrl, split, newUrl);
                document.location.href= newUrl;
            }
        })
        .catch((err) => {
            console.log(err);
        });
        if(email.value == ""){
            email.focus();
            return false;
        }
        if(password.value == ""){
            password.focus();
            return false;
        }
});