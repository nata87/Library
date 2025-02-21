package internal

import (
	"testing"
)

// TestConnectDb verifica che la connessione al database non sia nil.
func TestConnectDb(t *testing.T) {
	db := ConnectDb()
	if db == nil {
		t.Error("La connessione al database non dovrebbe essere nil")
	}
}

// TestDatabaseMigration verifica che le tabelle siano state create correttamente.
func TestDatabaseMigration(t *testing.T) {
	db := ConnectDb()
	Migrate(db)

	if !db.Migrator().HasTable(&User{}) {
		t.Error("La tabella 'users' non è stata creata")
	}
	if !db.Migrator().HasTable(&Book{}) {
		t.Error("La tabella 'books' non è stata creata")
	}
	if !db.Migrator().HasTable(&Reservation{}) {
		t.Error("La tabella 'reservations' non è stata creata")
	}
}
