package internal

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectDb() *gorm.DB {
	// Carica le variabili d'ambiente dal file .env
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Errore nel caricamento del file .env")
	}

	// Connessione al server MySQL senza specificare il database
	dsnWithoutDB := fmt.Sprintf("%s:%s@tcp(%s:%s)/?parseTime=true",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
	)

	dbNoDB, err := gorm.Open(mysql.Open(dsnWithoutDB), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("Errore di connessione al server MySQL: %v", err))
	}

	// Crea il database se non esiste
	dbName := os.Getenv("DB_NAME")
	createDBQuery := fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s;", dbName)
	err = dbNoDB.Exec(createDBQuery).Error
	if err != nil {
		panic(fmt.Sprintf("Errore nella creazione del database: %v", err))
	}

	// Connetti al database specifico
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		dbName,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	fmt.Println("Connessione al database riuscita!")
	return db
}

func Migrate(db *gorm.DB) {
	db.AutoMigrate(&Book{}, &User{}, &Reservation{})
}

// Seed popola il database con dati fittizi se le tabelle sono vuote
func Seed(db *gorm.DB) {
	// Seed per la tabella degli utenti
	var userCount int64
	db.Model(&User{}).Count(&userCount)
	if userCount == 0 {
		users := []User{
			{
				Name:     "Mario",
				Surname:  "Rossi",
				Role:     "admin",
				Email:    "mario.rossi@example.com",
				Password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
			},
			{
				Name:     "Luigi",
				Surname:  "Verdi",
				Role:     "user",
				Email:    "luigi.verdi@example.com",
				Password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
			},
		}
		for _, u := range users {
			db.Create(&u)
		}
	}

	// Seed per la tabella dei libri
	var bookCount int64
	db.Model(&Book{}).Count(&bookCount)
	if bookCount == 0 {
		books := []Book{
			{
				Isbn:             1234567890,
				Title:            "Il Signore degli Anelli",
				Genre:            "Fantasy",
				Author:           "J.R.R. Tolkien",
				Year:             1954,
				Copies_total:     10,
				Copies_available: 10,
			},
			{
				Isbn:             2345678901,
				Title:            "1984",
				Genre:            "Dystopian",
				Author:           "George Orwell",
				Year:             1949,
				Copies_total:     5,
				Copies_available: 5,
			},
		}
		for _, b := range books {
			db.Create(&b)
		}
	}

}
