const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const signupMessage = document.getElementById("signupMessage");
const loginMessage = document.getElementById("loginMessage");


signupBtn.addEventListener("click", function () {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
        signupMessage.textContent = "Please complete all fields.";
        return;
    }

    if (!email.includes("@")) {
        signupMessage.textContent = "Please enter a valid email.";
        return;
    }

    if (password !== confirmPassword) {
        signupMessage.textContent = "Passwords do not match.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find(function (user) {
        return user.email === email;
    });

    if (existingUser) {
        signupMessage.textContent = "An account with this email already exists.";
        return;
    }

    const newUser = {name: name, email: email, password: password};
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    signupMessage.textContent = "Account created successfully!";

    document.getElementById("signupName").value = "";
    document.getElementById("signupEmail").value = "";
    document.getElementById("signupPassword").value = "";
    document.getElementById("confirmPassword").value = "";

});


loginBtn.addEventListener("click", function () {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;


    if (email === "" || password === "") {
        loginMessage.textContent = "Please enter your email and password.";
        return;
    }


    const users =
        JSON.parse(localStorage.getItem("users")) || [];


    const matchedUser = users.find(function (user) {

        return (
            user.email === email &&
            user.password === password
        );

    });


    if (!matchedUser) {
        loginMessage.textContent = "Incorrect email or password.";
        return;
    }


    localStorage.setItem(
        "currentUser",
        JSON.stringify(matchedUser)
    );


    loginMessage.textContent =
        "Login successful. Welcome " + matchedUser.name + "!";


    setTimeout(function () {
        window.location.href = "index.html";
    }, 1000);

});