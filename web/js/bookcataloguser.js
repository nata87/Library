let books = []; // Variabile per memorizzare i libri

// Funzione per recuperare i dati dei libri
// function fetchBooks() {
//     fetch('http://localhost:8080/readAll') // Sostituisci con il tuo endpoint API
//         .then(response => response.json())
//         .then(data => {
//             books = data; // Salva i libri nella variabile globale
//             displayBooks(books); // Mostra tutti i libri
//         })
//         .catch(error => console.error("Errore nel recupero dei dati:", error));
// }
function fetchBooks() {
    fetch('http://localhost:8080/readAll') 
        .then(response => response.json())
        .then(data => {
            console.log("Dati ricevuti dall'API:", data); // DEBUG
            if (data.message && Array.isArray(data.message)) {
                books = data.message;
                console.log(books) // Accede all'array dentro "message"
                displayBooks(books);
            } else {
                console.error("Errore: L'API non restituisce un array valido!", data);
            }
        })
        .catch(error => console.error("Errore nel recupero dei dati:", error));
}

// Funzione per visualizzare i libri
function displayBooks(booksToDisplay) {
    const catalogo = document.getElementById('catalogo');
    catalogo.innerHTML = ''; // Pulisce il catalogo prima di aggiungere nuovi elementi

    booksToDisplay.forEach(book => {
        let bookDiv = document.createElement('div');
        bookDiv.classList.add('prodotto');
        bookDiv.setAttribute('data-nome', book.Title.toLowerCase());
//<img src="${book.immagine || 'placeholder.jpg'}" alt="${book.titolo}"></img>
        bookDiv.innerHTML = `
             <p>Isbn: ${book.Isbn}</p>
             <p>Genere: ${book.Genre}</p>
            <p>Title: <strong>${book.Title}</strong></p>
            <p>Autore: ${book.Author}</p>
            
            <p>Copies_available: ${book.Copies_available}</p>
            <p><button class="prenota-btn" data-isbn="${book.Isbn}">Prenota</button>
            <div id="messaggioerrore"></div>
            <div id="messaggiosuccesso"></div></p>
        `;

        catalogo.appendChild(bookDiv);
    });
}

// Funzione per filtrare i libri in base alla ricerca
function filterBooks() {
    let input = document.getElementById('search').value.toLowerCase();//mette tutto in minuscolo quello che scrivo nella barra di riscerca
    
     // Filtra i libri che contengono il testo nella stringa del titolo o dell'autore o dell'isbn
     let filteredBooks = books.filter(book => 
        (book.Title && book.Title.toLowerCase().includes(input)) || 
        (book.Author && book.Author.toLowerCase().includes(input)) ||
        (book.Isbn && book.Isbn.toString().toLowerCase().includes(input)) ||
        (book.Genre && book.Genre.toLowerCase().includes(input)) 
        
    );
    console.log("Libri filtrati:", filteredBooks); // DEBUG

    // Mostra i libri filtrati
    displayBooks(filteredBooks);
}

// Esegui fetchBooks quando la pagina è caricata
window.onload = function() {
    fetchBooks(); // Richiama la funzione fetchBooks quando la pagina è caricata

    // Aggiungi l'evento click al pulsante di ricerca
    document.getElementById('searchBtn').addEventListener('click', function() {
        filterBooks(); // Chiama la funzione di filtro quando viene cliccato il pulsante
    });
    
}
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("prenota-btn")) {
        let isbn = parseInt(event.target.getAttribute("data-isbn"));
        let email = sessionStorage.getItem("email"); //recupera l'email dalla sessione

        // Controlla se l'email è definita
        if (!email) {
            console.error("Errore: l'email non è presente nel sessionStorage!");
            alert("Errore: devi prima effettuare il login per prenotare un libro.");
            return; // Esce dalla funzione se l'email non è disponibile
        }

        console.log("Prenotazione richiesta per ISBN:", isbn, "con email:", email);
        
        const requestBody = { email, isbn };
        console.log("Dati inviati al backend:", JSON.stringify(requestBody)); // DEBUG
        // Recupera i div specifici per messaggio di errore e successo
        let messaggioErrore = event.target.closest('.prodotto').querySelector('#messaggioerrore');
        let messaggioSuccesso = event.target.closest('.prodotto').querySelector('#messaggiosuccesso');

        // Pulisce i messaggi precedenti
        messaggioErrore.innerHTML = '';
        messaggioSuccesso.innerHTML = '';

        // Chiamata all'API per effettuare la prenotazione
        fetch("http://localhost:8080/reservationuseron", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
            
        })
        .then(response => response.json())
        .then(data => {
            console.log("Risposta API:", data.message);
            
            messaggioSuccesso.innerHTML = data.message;
            setTimeout(() => {
                messaggioSuccesso.innerHTML = '';
            }, 5000);
        })
        .catch(error => {
            console.log(error);
            messaggioErrore.innerHTML = error.message;
            setTimeout(() => {
                messaggioErrore.innerHTML = '';
            }, 5000);
        });
    }
});



