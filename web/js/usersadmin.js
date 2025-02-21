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


function fetchusers() {
    fetch('http://localhost:8080/viewallusers') 
        .then(response => response.json())
        .then(data => {
            console.log("Dati ricevuti dall'API:", data); // DEBUG
            if (data.message && Array.isArray(data.message)) {
                users = data.message;
                console.log(users) // Accede all'array dentro "message"
                displayusers(users);
            } else {
                console.error("Errore: L'API non restituisce un array valido!", data);
            }
        })
       // .catch(error => console.error("Errore nel recupero dei dati:", error));
}


/*
// Funzione per visualizzare i libri
/*function displayusers(usersToDisplay) {
    const Users = document.getElementById('Users');
    Users.innerHTML = ''; // Pulisce il catalogo prima di aggiungere nuovi elementi
    let table = document.createElement('table');
    usersToDisplay.forEach(user => {
        let userDiv = document.createElement('div');
        let button = document.createElement('button');
        button.appendChild(document.createTextNode("Inventario"));
        button.id=user.Email
        userDiv.innerHTML = `
            <p>Name: ${user.Name}</p>
            <p>Surname: ${user.Surname}</p>
            <p>Email: <strong>${user.Email}</strong></p>
        `;
        Users.appendChild(userDiv);
        Users.appendChild(button);
        document.getElementById(user.Email).addEventListener("click",function(){
            fetch("http://localhost:8080/inventoryuser?email="+user.Email)
            .then(response => response.json())
            .then(data =>{
                inventory=data.message
                console.log(inventory)
                let table=document.createElement("table");
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
                    td.appendChild(document.createTextNode(Reservation.Reservation.Status))
                    console.log(Reservation.Reservation.Status)
                    td=table.appendChild(document.createElement("td"))
                    td.appendChild(document.createTextNode("Data di scadenza: "+Reservation.Reservation.Due_date))
                    td=table.appendChild(document.createElement("td"))
                    buttondate=document.createElement('input')
                    buttondate.id="duedate"
                    buttondate.type="date"
                    

                    td.appendChild(buttondate)
                    buttonDue=document.createElement('button')
                    buttonDue.appendChild(document.createTextNode('Update due date'))
                    td=table.appendChild(document.createElement("td"))
                    if (Reservation.Reservation.Status=="noleggiato"){
                        buttonDue.disabled = false
                    } else if(Reservation.ReservationStatus=="restituito"){
                        buttonDue.disabled = true
                    }
                    buttonDue.id="DueDate"
                    td.appendChild(buttonDue)
                    buttonconfirmrestore=document.createElement('button')
                    buttonconfirmrestore.id="confirm"
                    buttonconfirmrestore.appendChild(document.createTextNode("Confirm"))
                    if (Reservation.Reservation.Status=="noleggiato"){
                        buttonconfirmrestore.disabled = true
                    } else if(Reservation.Reservation.Status=="restituito"){
                        buttonconfirmrestore.disabled = false
                    }
                    td=table.appendChild(document.createElement("td"))
                    td.appendChild(buttonconfirmrestore)
                Users.appendChild(table)
                inventory.forEach(Reservation=>{
                document.getElementById("DueDate").addEventListener("click",function(){
                        fetch("http://localhost:8080/assignduedate?user_id="+user.Id+"&book_isbn="+Reservation.Book.Isbn,{method:"PUT",
                            body:JSON.stringify({due_date:document.getElementById("duedate").value})
                        })
                        .then(response => response.json())
                        .then(data=>{
                            console.log(data.message)
                            document.getElementById("Messaggioamministratore").textContent=data.message
                            
                            

                        })
                    })
                    document.getElementById("confirm").addEventListener("click",function(){
                        fetch("http://localhost:8080/confirmrestore?user_id="+user.Id+"&book_isbn="+Reservation.Book.Isbn,{method:"DELETE"})
                        .then(response => response.json())
                        .then(data=>{
                            document.getElementById("Messaggioamministratore").textContent=data.message
                        })
                    })
                })
                })
            })
        })
        
    });
} */

   /* function displayusers(usersToDisplay) {
        const Users = document.getElementById('Users');
        Users.innerHTML = ''; // Pulisce il catalogo prima di aggiungere nuovi elementi
    
        usersToDisplay.forEach(user => {
            let userDiv = document.createElement('div');
            let button = document.createElement('button');
            button.appendChild(document.createTextNode("Inventario"));
            button.id = user.Email;
    
            userDiv.innerHTML = `
                <p>Name: ${user.Name}</p>
                <p>Surname: ${user.Surname}</p>
                <p>Email: <strong>${user.Email}</strong></p>
            `;
    
            Users.appendChild(userDiv);
            Users.appendChild(button);
    
            document.getElementById(user.Email).addEventListener("click", function () {
                button.disabled=true;
                fetch("http://localhost:8080/inventoryuser?email=" + user.Email)
                    .then(response => response.json())
                    .then(data => {
                        let inventory = data.message;
                        console.log(inventory);
    
                        let table = document.createElement("table");
    
                        // Creazione dell'**intestazione** della tabella
                        let headerRow = document.createElement("tr");
                        let headers = ["ISBN", "Title", "Genre", "Author", "Year", "State", "Due Date", "Actions"];
                        headers.forEach(headerText => {
                            let th = document.createElement("th");
                            th.appendChild(document.createTextNode(headerText));
                            headerRow.appendChild(th);
                        });
                        table.appendChild(headerRow);
    
                        // Creazione delle **righe della tabella**
                        inventory.forEach(Reservation => {
                            let row = document.createElement("tr");
    
                            let cellIsbn = document.createElement("td");
                            cellIsbn.appendChild(document.createTextNode(Reservation.Book.Isbn));
                            row.appendChild(cellIsbn);
    
                            let cellTitle = document.createElement("td");
                            cellTitle.appendChild(document.createTextNode(Reservation.Book.Title));
                            row.appendChild(cellTitle);
    
                            let cellGenre = document.createElement("td");
                            cellGenre.appendChild(document.createTextNode(Reservation.Book.Genre));
                            row.appendChild(cellGenre);
    
                            let cellAuthor = document.createElement("td");
                            cellAuthor.appendChild(document.createTextNode(Reservation.Book.Author));
                            row.appendChild(cellAuthor);
    
                            let cellYear = document.createElement("td");
                            cellYear.appendChild(document.createTextNode(Reservation.Book.Year));
                            row.appendChild(cellYear);
    
                            let cellState = document.createElement("td");
                            cellState.appendChild(document.createTextNode(Reservation.Reservation.Status));
                            row.appendChild(cellState);
    
                            let cellDueDate = document.createElement("td");
                            let buttondate = document.createElement('input');
                            buttondate.type = "date";
                            buttondate.value = Reservation.Reservation.Due_date || ""; // Precompila con la data attuale se esiste
                            cellDueDate.appendChild(buttondate);
                            row.appendChild(cellDueDate);
    
                            let cellActions = document.createElement("td");
    
                            // Bottone per aggiornare la data di restituzione
                            let buttonDue = document.createElement('button');
                            buttonDue.appendChild(document.createTextNode('Update due date'));
                            //buttonDue.disabled = Reservation.Reservation.Status !== "noleggiato";
                            // if (Reservation.Reservation.Status=="noleggiato"){
                            //     buttonDue.disabled = true
                            // } else if(Reservation.Reservation.Status=="restituito"){
                            //     buttonDue.disabled = false
                            // }
                            buttonDue.disabled = Reservation.State == "noleggiato";
                            buttonDue.addEventListener("click", function () {
                                fetch("http://localhost:8080/assignduedate?user_id=" + user.Id + "&book_isbn=" + Reservation.Book.Isbn, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ due_date: buttondate.value })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data.message);
                                    document.getElementById("Messaggioamministratore").textContent = data.message;
                                });
                            });
    
                            cellActions.appendChild(buttonDue);
    
                            // Bottone per confermare la restituzione
                            let buttonConfirmRestore = document.createElement('button');
                            buttonConfirmRestore.appendChild(document.createTextNode("Confirm"));
                            buttonConfirmRestore.disabled = Reservation.Reservation.Status !== "restituito";
                            buttonConfirmRestore.addEventListener("click", function () {
                                fetch("http://localhost:8080/confirmrestore?user_id=" + user.Id + "&book_isbn=" + Reservation.Book.Isbn, { method: "DELETE" })
                                .then(response => response.json())
                                .then(data => {
                                    document.getElementById("Messaggioamministratore").textContent = data.message;
                                });
                            });
    
                            cellActions.appendChild(buttonConfirmRestore);
                            row.appendChild(cellActions);
    
                            // Aggiunge la riga alla tabella
                            table.appendChild(row);
                        });
    
                        // Aggiunge la tabella all'elemento Users
                        Users.appendChild(table);
                    });
            });
        });
    }*/
        function displayusers(usersToDisplay) {
            const Users = document.getElementById('Users');
            Users.innerHTML = ''; // Pulisce il contenuto prima di aggiornare
        
            // Creazione della tabella utenti
            let table = document.createElement('table');
            table.border = "1"; // Aggiunge un bordo alla tabella per visibilità
        
            let thead = document.createElement('thead');
            let headerRow = document.createElement('tr');
        
            // Intestazione della tabella
            ["Name", "Surname", "Email", "Action"].forEach(text => {
                let th = document.createElement('th');
                th.textContent = text;
                headerRow.appendChild(th);
            });
        
            thead.appendChild(headerRow);
            table.appendChild(thead);
        
            let tbody = document.createElement('tbody');
        
            // Aggiunta delle righe per ogni utente
            usersToDisplay.forEach(user => {
                let row = document.createElement('tr');
        
                let tdName = document.createElement('td');
                tdName.textContent = user.Name;
                row.appendChild(tdName);
        
                let tdSurname = document.createElement('td');
                tdSurname.textContent = user.Surname;
                row.appendChild(tdSurname);
        
                let tdEmail = document.createElement('td');
                tdEmail.innerHTML = `<strong>${user.Email}</strong>`;
                row.appendChild(tdEmail);
        
                // Creazione della cella per il bottone
                let tdButton = document.createElement('td');
                let button = document.createElement('button');
                button.textContent = "Inventario";
                button.id = "btn-" + user.Email;
        
                // Aggiunta dell'evento click al bottone
                button.addEventListener("click", function () {
                    button.disabled = true;
        
                    fetch("http://localhost:8080/inventoryuser?email=" + user.Email)
                        .then(response => response.json())
                        .then(data => {
                            let inventory = data.message;
                            console.log("Inventario ricevuto:", inventory);
        
                            // Verifica se la riga dell'inventario già esiste
                            let existingRow = document.getElementById("inventory-" + user.Email);
                            if (existingRow) {
                                existingRow.remove(); // Se esiste, la rimuove
                            }
        
                            // Creazione della riga per la tabella dell'inventario
                            let inventoryRow = document.createElement("tr");
                            inventoryRow.id = "inventory-" + user.Email;
        
                            let inventoryCell = document.createElement("td");
                            inventoryCell.colSpan = 4; // Occupa l'intera larghezza della tabella
        
                            // Creazione della tabella dell'inventario
                            let inventoryTable = document.createElement("table");
                            inventoryTable.border = "1";
        
                            let inventoryHeader = document.createElement("tr");
                            let headers = ["ISBN", "Title", "Genre", "Author", "Year", "State", "Due Date", "Actions"];
                            headers.forEach(headerText => {
                                let th = document.createElement("th");
                                th.appendChild(document.createTextNode(headerText));
                                inventoryHeader.appendChild(th);
                            });
                            inventoryTable.appendChild(inventoryHeader);
        
                            // Creazione delle righe della tabella dell'inventario
                            inventory.forEach(Reservation => {
                                let inventoryRow = document.createElement("tr");
        
                                let cellIsbn = document.createElement("td");
                                cellIsbn.appendChild(document.createTextNode(Reservation.Book.Isbn));
                                inventoryRow.appendChild(cellIsbn);
        
                                let cellTitle = document.createElement("td");
                                cellTitle.appendChild(document.createTextNode(Reservation.Book.Title));
                                inventoryRow.appendChild(cellTitle);
        
                                let cellGenre = document.createElement("td");
                                cellGenre.appendChild(document.createTextNode(Reservation.Book.Genre));
                                inventoryRow.appendChild(cellGenre);
        
                                let cellAuthor = document.createElement("td");
                                cellAuthor.appendChild(document.createTextNode(Reservation.Book.Author));
                                inventoryRow.appendChild(cellAuthor);
        
                                let cellYear = document.createElement("td");
                                cellYear.appendChild(document.createTextNode(Reservation.Book.Year));
                                inventoryRow.appendChild(cellYear);
        
                                let cellState = document.createElement("td");
                                cellState.appendChild(document.createTextNode(Reservation.Reservation.Status));
                                inventoryRow.appendChild(cellState);
        
                                let cellDueDate = document.createElement("td");
                                let dueDateInput = document.createElement('input');
                                dueDateInput.type = "date";
                                dueDateInput.value = Reservation.Reservation.Due_date || "";
                                cellDueDate.appendChild(dueDateInput);
                                inventoryRow.appendChild(cellDueDate);
        
                                let cellActions = document.createElement("td");
        
                                // Bottone per aggiornare la data di restituzione
                                let buttonDue = document.createElement('button');
                                buttonDue.appendChild(document.createTextNode('Update due date'));
                                buttonDue.disabled = Reservation.Reservation.Status !== "noleggiato";
                                buttonDue.addEventListener("click", function () {
                                    fetch("http://localhost:8080/assignduedate?user_id=" + user.Id + "&book_isbn=" + Reservation.Book.Isbn, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ due_date: dueDateInput.value })
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(data.message);
                                        document.getElementById("Messaggioamministratore").textContent = data.message;
                                    });
                                });
        
                                cellActions.appendChild(buttonDue);
        
                                // Bottone per confermare la restituzione
                                let buttonConfirmRestore = document.createElement('button');
                                buttonConfirmRestore.appendChild(document.createTextNode("Confirm"));
                                buttonConfirmRestore.disabled = Reservation.Reservation.Status !== "restituito";
                                buttonConfirmRestore.addEventListener("click", function () {
                                    fetch("http://localhost:8080/confirmrestore?user_id=" + user.Id + "&book_isbn=" + Reservation.Book.Isbn, { method: "DELETE" })
                                    .then(response => response.json())
                                    .then(data => {
                                        document.getElementById("Messaggioamministratore").textContent = data.message;
                                    });
                                });
        
                                cellActions.appendChild(buttonConfirmRestore);
                                inventoryRow.appendChild(cellActions);
        
                                // Aggiunge la riga dell'inventario alla tabella
                                inventoryTable.appendChild(inventoryRow);
                            });
        
                            inventoryCell.appendChild(inventoryTable);
                            inventoryRow.appendChild(inventoryCell);
        
                            // Inserisce la riga dell'inventario sotto la riga dell'utente
                            row.parentNode.insertBefore(inventoryRow, row.nextSibling);
                        })
                        .catch(error => console.error("Errore nel fetch:", error));
                });
        
                tdButton.appendChild(button);
                row.appendChild(tdButton);
                tbody.appendChild(row);
            });
        
            table.appendChild(tbody);
            Users.appendChild(table);
        }
        
        
    

// Funzione per filtrare i libri in base alla ricerca
function filterusers() {
    let input = document.getElementById('search').value.toLowerCase();//mette tutto in minuscolo quello che scrivo nella barra di riscerca
    
     // Filtra i libri che contengono il testo nella stringa del titolo o dell'autore o dell'isbn
     let filteredusers = users.filter(user => 
        (user.Name && user.Name.toLowerCase().includes(input)) || 
        (user.Surname && user.Surname.toLowerCase().includes(input)) ||
        (user.Email && user.Email.toString().toLowerCase().includes(input))
    );
    console.log("Libri filtrati:", filteredusers); // DEBUG

    // Mostra i libri filtrati
    displayusers(filteredusers);
}

// Esegui fetchusers quando la pagina è caricata
window.onload = function() {
    fetchusers(); // Richiama la funzione fetchusers quando la pagina è caricata

    // Aggiungi l'evento click al pulsante di ricerca
    document.getElementById('searchBtn').addEventListener('click', function() {
        filterusers(); // Chiama la funzione di filtro quando viene cliccato il pulsante
    });
}
