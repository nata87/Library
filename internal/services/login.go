package services

import (
	"allyoucanread/internal"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// func LoginUser(db *gorm.DB) gin.HandlerFunc {
// 	fn := func(c *gin.Context) {
// 		var User internal.User

// 		body, err := c.GetRawData()
// 		if err != nil {
// 			panic(err)
// 		}

// 		json.Unmarshal(body, &User)

// 		email := User.Email
// 		password := User.Password

// 		hash := sha256.Sum256([]byte(password))
// 		if err := db.Where("email = ? AND password=?", email, hex.EncodeToString(hash[:])).First(&User).Error; err != nil {
// 			c.JSON(http.StatusUnauthorized, gin.H{"message": "Credenziali errate"})
// 			return
// 		}
// 		tokenString, err := internal.CreateToken(User.Email)
// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Errore nella generazione del token"})
// 			return
// 		}

// 		// Risposta di successo con il token JWT
// 		c.JSON(http.StatusOK, gin.H{"message": "Login effettuato con successo", "token": tokenString})

// 	}
// 	return gin.HandlerFunc(fn)
// }

// func LoginAdmin(db *gorm.DB) gin.HandlerFunc {
// 	fn := func(c *gin.Context) {
// 		var User internal.User

// 		body, err := c.GetRawData()
// 		if err != nil {
// 			panic(err)
// 		}

// 		json.Unmarshal(body, &User)

// 		email := User.Email
// 		password := User.Password

// 		var count int64
// 		hash := sha256.Sum256([]byte(password))
// 		db.Where("(email,password) = (?,?)", email, hex.EncodeToString(hash[:])).Find(&User).Count(&count)
// 		if count == 0 || (email != "diegomar2000@gmail.com" || password != "Mathesis00") {
// 			c.JSON(404, gin.H{"message": "Credenziali errate"})
// 		} else {
// 			tokenString, err := internal.CreateToken(email)
// 			if err != nil {
// 				panic(err)
// 			} else {
// 				c.JSON(200, gin.H{"message": "Login effettuato con successo", "token": tokenString})
// 			}

// 		}

//		}
//		return gin.HandlerFunc(fn)
//	}
func LoginUser(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var reqUser internal.User

		body, err := c.GetRawData()
		if err != nil {
			panic(err)
		}

		if err = json.Unmarshal(body, &reqUser); err != nil {
			c.JSON(400, gin.H{"message": "Errore nella richiesta"})
			return
		}

		email := reqUser.Email
		password := reqUser.Password

		// Calcola l'hash della password fornita
		hash := sha256.Sum256([]byte(password))
		hashedPassword := hex.EncodeToString(hash[:])

		// Recupera l'utente dal database
		var user internal.User
		if err := db.Where("email = ? AND password = ?", email, hashedPassword).First(&user).Error; err != nil {
			c.JSON(404, gin.H{"message": "This account does not exist!"})
			return
		}

		// Controlla che l'utente non abbia il ruolo di amministratore
		if user.Role == "admin" {
			c.JSON(403, gin.H{"message": "Access denied!"})
			return
		}

		// Crea il token se tutto va bene
		tokenString, err := internal.CreateToken(email)
		if err != nil {
			panic(err)
		}
		c.JSON(200, gin.H{"message": "Login successfully!", "token": tokenString})
	}
}

func LoginAdmin(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user internal.User

		body, err := c.GetRawData()
		if err != nil {
			panic(err)
		}

		if err = json.Unmarshal(body, &user); err != nil {
			c.JSON(400, gin.H{"message": "Errore nella richiesta"})
			return
		}

		email := user.Email
		password := user.Password

		// Calcola l'hash della password fornita
		hash := sha256.Sum256([]byte(password))
		hashedPassword := hex.EncodeToString(hash[:])

		// Effettua una query per recuperare l'utente
		var adminUser internal.User
		if err := db.Where("email = ? AND password = ?", email, hashedPassword).First(&adminUser).Error; err != nil {
			c.JSON(404, gin.H{"message": "Account not found"})
			return
		}

		// Verifica che l'utente abbia il ruolo di amministratore
		if adminUser.Role != "admin" {
			c.JSON(403, gin.H{"message": "Access denied: you are not an admin"})
			return
		}

		// Se tutto va bene, crea il token e rispondi
		tokenString, err := internal.CreateToken(email)
		if err != nil {
			panic(err)
		}
		c.JSON(200, gin.H{"message": "Login succesfully", "token": tokenString})
	}
}
