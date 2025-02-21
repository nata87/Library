FROM golang:1.19

WORKDIR /app

# Copia i file di go.mod e go.sum
COPY go.mod go.sum ./

# Scarica le dipendenze
RUN go mod download

# Copia il codice sorgente
COPY . .

# Costruisci l'applicazione
RUN go build -o app .

# Esegui l'applicazione
CMD ["./app"]
