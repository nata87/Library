

//fetch Amministratore
document.getElementById("formLoginAmministratore").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("emailAmm").value;
    const password = document.getElementById("passwordAmm").value;

    // !!!! DA VEDERE LA LOCALHOST !!!!
    fetch("http://localhost:8080/loginadmin", {
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
        window.location.href = "admindashboard.html";
        sessionStorage.setItem("email", email);
    })
    .catch(error => {
        // Mostra il messaggio d'errore senza effettuare il redirect
        document.getElementById("messaggioerrore").textContent = error.message;
        document.getElementById("messaggiosuccesso").textContent = "";
    });
});
