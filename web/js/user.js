//registration
document.getElementById("formRegistration").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("usernameReg").value;
    const surname = document.getElementById("surnameReg").value;
    const email = document.getElementById("emailReg").value;
    const password = document.getElementById("passwordReg").value;
    const role="cliente";
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
       //svuota i campi password in caso di password non corrispondenti
       document.getElementById("passwordReg").value = "";
       document.getElementById("confirmPassword").value = "";

       //mostra il messaggio di errore
       document.getElementById("messaggioerrore").textContent = "Le password non coincidono!";
       document.getElementById("messaggiosuccesso").textContent = "";
       return;
    }

    // !!!! DA VEDERE LOCALHOST !!!!
    fetch("http://localhost:8080/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, role , email, password })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            //pulisce i campi dopo la registrazione
            document.getElementById("usernameReg").value = "";
            document.getElementById("surnameReg").value="";
            document.getElementById("passwordReg").value = "";
            document.getElementById("emailReg").value="";
            document.getElementById("confirmPassword").value = "";

            //messaggio di successo
            document.getElementById("messaggiosuccesso").textContent = data.message;
            document.getElementById("messaggioerrore").textContent = "";
            window.setTimeout(function(){window.location.href="index.html"},5000);
})
        .catch(error => {
            document.getElementById("messaggioerrore").textContent = error.message;
            document.getElementById("messaggiosuccesso").textContent = "";
        });
});


//Login
// document.getElementById("formLogin").addEventListener("submit", function (event) {
//     event.preventDefault();
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;



// // !!!! DA VEDERE LA LOCALHOST !!!!
//     fetch("http://localhost:8080/loginuser", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//     })
//         .then(response => {
            
//                 if (!response.ok) {
//                     return response.json().then(data => {
//                         throw new Error(data.message);
//                     });
//                 }
//                 return response.json();
//         })
//         .then(data => {
//                 document.getElementById("messaggiosuccesso").textContent=data.message;
//                 document.getElementById("messaggioerrore").textContent = "";
//                 window.location.href="userdashboard.html"
//                 sessionStorage.setItem("email",email)
//         })
//         .catch(error => {
//             document.getElementById("messaggioerrore").textContent = error.message;
//             document.getElementById("messaggiosuccesso").textContent = "";
//         });
        
// });

document.getElementById("formLogin").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/loginuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message);
            });
        }
        return response.json();
    })
    .then(data => {
        // Se la risposta è ok, esegue il login
        document.getElementById("messaggioerrore").textContent = "";
        window.location.href = "userdashboard.html";
        sessionStorage.setItem("email", email);
    })
    .catch(error => {
        // Mostra il messaggio d'errore senza effettuare il redirect
        document.getElementById("messaggioerrore").textContent = error.message;
        document.getElementById("messaggiosuccesso").textContent = "";
    });
});


// Quando clicchi su "Registrati", mostra il form di registrazione e nascondi il login
document.getElementById("showRegistration").addEventListener("click", function() {
    document.getElementById("registrationContainer").style.display = "block";  // Mostra il form di registrazione
    document.getElementById("loginContainer").style.display = "none";  // Nascondi il form di login
});

// Quando clicchi su "Accedi", mostra il form di login e nascondi la registrazione
document.getElementById("showLogin").addEventListener("click", function() {
    document.getElementById("registrationContainer").style.display = "none";  // Nascondi il form di registrazione
    document.getElementById("loginContainer").style.display = "block";  // Mostra il form di login
});
