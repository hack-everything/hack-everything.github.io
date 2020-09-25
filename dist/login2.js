
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {

    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "sourfruit" && password === "sourfruit99") {
        console.log(username);
        alert("You have successfully logged in.");
        location.reload();
        window.location.href = "https://def-not-hacking-the.net/ExtensionScripts/dashboard/files/65849687584939856765904.html";
    }

    else {
      
    }
})
