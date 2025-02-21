//update book
document.getElementById("updatebook").addEventListener("submit", function (event) {
    event.preventDefault();

    const Isbn = document.getElementById("isbn").value;  // Mantenere come stringa
    const Title = document.getElementById("Title").value;
    const Genre = document.getElementById("Genre").value;
    const Author = document.getElementById("author").value;
    const Year = parseInt(document.getElementById("year").value);
    const Copies_total = parseInt(document.getElementById("totcopies").value);
    const Copies_available = Copies_total;


    console.log(Isbn),
    fetch("http://localhost:8080/update?isbn=" + Isbn , {  // Corretto template string
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Title, Genre, Author, Year, Copies_total, Copies_available })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        

        // Pulizia campi dopo aggiornamento
        document.getElementById("isbn").value = "";
        document.getElementById("Title").value = "";
        document.getElementById("Genre").value = "";
        document.getElementById("author").value = "";
        document.getElementById("year").value = "";
        document.getElementById("totcopies").value = "";

        document.getElementById("messaggiosuccesso").textContent = data.message;
        document.getElementById("messaggioerrore").textContent = "";
    })
    .catch(error => {
        document.getElementById("messaggioerrore").textContent = error.message;
        document.getElementById("messaggiosuccesso").textContent = "";
    });
});
