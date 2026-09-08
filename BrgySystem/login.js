const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const loginError =
        document.getElementById("loginError");

    const adminUsername = "Konsehal JM";
    const adminPassword = "kurakotako";


    if (
        username === adminUsername &&
        password === adminPassword
    ) {

        sessionStorage.setItem(
            "loggedIn",
            "true"
        );

        sessionStorage.setItem(
            "userRole",
            "Administrator"
        );

        sessionStorage.setItem(
            "username",
            username
        );


        window.location.href = "index.html";

    } else {

        loginError.textContent =
            "Invalid username or password.";

    }

});