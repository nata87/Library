# Stage 1: Build
FROM golang:1.19 AS builder

WORKDIR /app

# Copia i file di go.mod e go.sum e scarica le dipendenze
COPY go.mod go.sum ./
RUN go mod download

# Copia tutto il codice sorgente
COPY . .

# Compila l’applicazione; se il file main.go si trova in "cmd", specifica il percorso corretto
RUN CGO_ENABLED=0 GOOS=linux go build -o app ./cmd/main.go

# Stage 2: Immagine finale
FROM alpine:latest
RUN apk --no-cache add ca-certificates

WORKDIR /root/
# Copia il file binario compilato dal builder
COPY --from=builder /app/app .

# Espone la porta su cui l’app è in ascolto (in questo caso 8080)
EXPOSE 8080

# Comando di avvio
CMD ["./app"]
