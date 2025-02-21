let users = []; // Variabile per memorizzare i libri

// Funzione per recuperare i dati dei libri
// function fetchusers() {
//     fetch('http://localhost:8080/readAll') // Sostituisci con il tuo endpoint API
//         .then(response => response.json())
//         .then(data => {
//             users = data; // Salva i libri nella variabile globale
//             displayusers(users); // Mostra tutti i libri
//         })
//         .catch(error => console.error("Errore nel recupero dei dati:", error));
// }
function fetchbooksuser() {
    fetch('http://localhost:8080/inventoryuserprofile?email='+sessionStorage.getItem('email')) 
        .then(response => response.json())
        .then(data => {
            console.log("Dati ricevuti dall'API:", data); // DEBUG
            if (data.message && Array.isArray(data.message)) {
                inventory = data.message;
                console.log(inventory) // Accede all'array dentro "message"
                displayinventoryuser(inventory);
            } else {
                console.error("Errore: L'API non restituisce un array valido!", data);
            }
        })
        .catch(error => console.error("Errore nel recupero dei dati:", error));
}

/*
// Funzione per visualizzare i libri
function displayinventoryuser(inventory) {
    const catalogo = document.getElementById('usercatalog');
    let table = document.createElement('table');
    catalogo.innerHTML = '';
                inventory.forEach(Reservation=>{
                    td=table.appendChild(document.createElement("td"))
                    td.appendChild(document.createTextNode(Reservation.Book.Isbn))
                    td=table.appendChild(document.createElement("td"))
                    td.appendChild(document.createTextNode(Reservation.Book.Title))
                    td=table.appendChild(document.createElement("td"))
                    td.appendChild(document.createTextNode(Reservation.Book.Genre))
                    td=table.appendChild(document.createElement("td"))
                    td.appendChild(document.createTextNode(Reservation.Book.Author))
                    td=table.appendChild(document.createElement("td"))
                    td.appendChild(document.createTextNode(Reservation.Book.Year))
                    td=table.appendChild(document.createElement("td"))
                    td.appendChild(document.createTextNode(Reservation.Due_date))
                    td=table.appendChild(document.createElement("td"))
                    td.appendChild(document.createTextNode(Reservation.State))
                    td=table.appendChild(document.createElement("td"))
                    buttonrestore=document.createElement("button")
                    buttonrestore.appendChild(document.createTextNode("Consegna"))
                    buttonrestore.id="buttonrestore"
                    td.appendChild(buttonrestore)
                })
                catalogo.append(table)
                inventory.forEach(Reservation=>{
                    document.getElementById("buttonrestore").addEventListener("click",function(){
                        fetch("http://localhost:8080/reservationuseroff",{method:"POST",
                        body:JSON.stringify({email:sessionStorage.getItem("email"),isbn:Reservation.Book.Isbn})
                    }).then(response=>response.json())
                    .then(data=>{
                        document.getElementById("messaggio").textContent=data.message
                    })
                    })
                    })
                }


// Esegui fetchbooksuser quando la pagina è caricata
window.onload = function() {
    fetchbooksuser(); // Richiama la funzione fetchusers quando la pagina è caricata

}
*/


// Funzione per visualizzare i libri
function displayinventoryuser(inventory) {
    const catalogo = document.getElementById('usercatalog');
    catalogo.innerHTML = ''; // Pulisce il catalogo prima di aggiungere nuovi elementi

    // Creazione della tabella
    let table = document.createElement('table');

    // Creazione dell'header della tabella
    let thead = document.createElement('thead');
    thead.innerHTML = `
        <tr class="white">
            <th>ISBN</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Author</th>
            <th>Year</th>
            <th>Due Date</th>
            <th>State</th>
            <th>Action</th>
        </tr>
    `;
    table.appendChild(thead);

    // Corpo della tabella
    let tbody = document.createElement('tbody');

    inventory.forEach(Reservation => {
        let row = document.createElement('tr');

        row.innerHTML = `
            <td>${Reservation.Book.Isbn}</td>
            <td>${Reservation.Book.Title}</td>
            <td>${Reservation.Book.Genre}</td>
            <td>${Reservation.Book.Author}</td>
            <td>${Reservation.Book.Year}</td>
            <td>${Reservation.Due_date}</td>
            <td>${Reservation.State}</td>
        `;

        // Creazione cella per il pulsante "Consegna"
        let tdButton = document.createElement('td');
        let buttonRestore = document.createElement('button');
        buttonRestore.textContent = "Consegna";
        buttonRestore.id = `buttonrestore-${Reservation.Book.Isbn}`;

        // Aggiunta evento per il pulsante
        buttonRestore.addEventListener("click", function () {
            fetch("http://localhost:8080/reservationuseroff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: sessionStorage.getItem("email"), isbn: Reservation.Book.Isbn })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById("messaggio").textContent = data.message;
            });
        });

        tdButton.appendChild(buttonRestore);
        row.appendChild(tdButton);

        // Aggiunge la riga al corpo della tabella
        tbody.appendChild(row);
    });

    // Aggiunge il corpo della tabella alla tabella
    table.appendChild(tbody);

    // Aggiunge la tabella al catalogo
    catalogo.appendChild(table);
}

// Esegui fetchbooksuser quando la pagina è caricata
window.onload = function() {
    fetchbooksuser();
}
