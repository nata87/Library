document.getElementById("deletebook").addEventListener("submit", function (event) {
    event.preventDefault();

    const Isbn = document.getElementById("isbn").value;

    fetch("http://localhost:8080/delete?isbn=" + Isbn, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);

        // Pulizia campi dopo aggiornamento
        document.getElementById("isbn").value = "";

        document.getElementById("messaggiosuccesso").textContent = data.message;
        document.getElementById("messaggioerrore").textContent = "";
    })
    .catch(error => {
        document.getElementById("messaggioerrore").textContent = error.message;
        document.getElementById("messaggiosuccesso").textContent = "";
    });
});
