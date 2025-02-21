package services

import (
	"allyoucanread/internal"
	"encoding/json"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type date struct {
	Due_date string `json:"due_date"`
}

// MODIFICA MOMENTANEA
//
//	type Reservationuser struct {
//		Book  internal.Book
//		State string
//	}

// MODIFICA FUNZIONANTE
type Reservationuser struct {
	Book        internal.Book
	Reservation internal.Reservation
}

func CreateBook(db *gorm.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		body, err := c.GetRawData()
		if err != nil {
			panic(err)
		}
		Book := internal.Book{}
		err = json.Unmarshal(body, &Book)
		if err != nil {
			panic(err)
		}
		db.Create(&Book)
		c.JSON(200, gin.H{"message": "book created successfully"})
	}

	return gin.HandlerFunc(fn)
}

func ViewAllBooks(db *gorm.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		var Books []internal.Book
		db.Find(&Books)
		c.JSON(200, gin.H{"message": Books})
	}

	return gin.HandlerFunc(fn)
}

func UpdateBook(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		isbn := c.Query("isbn") // Corretto: prendere il parametro dalla URL

		var book internal.Book
		if err := db.Where("isbn = ?", isbn).First(&book).Error; err != nil {
			c.JSON(404, gin.H{"message": "Book not found"})
			return
		}

		var updatedData internal.Book
		if err := c.ShouldBindJSON(&updatedData); err != nil {
			c.JSON(400, gin.H{"message": "Invalid request", "error": err.Error()})
			return
		}

		// Aggiorna solo i campi modificabili
		db.Model(&book).Updates(map[string]interface{}{
			"title":            updatedData.Title,
			"genre":            updatedData.Genre,
			"author":           updatedData.Author,
			"year":             updatedData.Year,
			"copies_total":     updatedData.Copies_total,
			"copies_available": updatedData.Copies_total,
		})

		c.JSON(200, gin.H{"message": "Book updated successfully"})
	}
}

func DeleteBook(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		isbn := c.Query("isbn")
		result := db.Where("isbn = CAST(? AS UNSIGNED)", isbn).Delete(&internal.Book{})
		if result.Error != nil {
			c.JSON(500, gin.H{"message": "Rental in progress..."})
			return
		}
		if result.RowsAffected == 0 {
			c.JSON(404, gin.H{"message": "Book not found"})
			return
		}
		c.JSON(200, gin.H{"message": "Book deleted successfully"})
	}
}

func ViewAllUsers(db *gorm.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {
		var Users []internal.User
		db.Find(&Users)
		for i, user := range Users {
			if user.Role == "admin" {
				Users = append(Users[:i], Users[i+1:]...)
			}
		}
		c.JSON(200, gin.H{"message": Users})
	}

	return gin.HandlerFunc(fn)
}
func InventoryUser(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		Email := c.Query("email")
		var User internal.User
		var Reservations []internal.Reservation
		//var Book internal.Book
		var Reservationsusr []Reservationuser
		db.Where("email= ?", Email).Find(&User)
		db.Where("user_id=?", User.Id).Find(&Reservations)
		for _, reservation := range Reservations {
			var Book internal.Book //piccola modifica
			db.Where("isbn=?", reservation.Book_id).Find(&Book)
			//MODIFICA MOMENTANEA
			// reservationuser := Reservationuser{Book: Book, State: reservation.Status}
			// Reservationsusr = append(Reservationsusr, reservationuser)
			reservationsusr := Reservationuser{Book: Book, Reservation: reservation}
			Reservationsusr = append(Reservationsusr, reservationsusr)
		}
		c.JSON(200, gin.H{"message": Reservationsusr})
	}
}

func AssignDueDate(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user_id := c.Query("user_id")
		book_isbn := c.Query("book_isbn")
		datedue, err := c.GetRawData()
		if err != nil {
			panic(err)
		}
		var Date date
		err = json.Unmarshal(datedue, &Date)
		if err != nil {
			panic(err)
		}
		var Reservation internal.Reservation
		db.Where("user_id = ?", user_id).Where("book_id=?", book_isbn).Find(&Reservation)
		year, month, day := time.Now().Date()
		timenow := strconv.Itoa(year) + "-" + strconv.Itoa(int(month)) + "-" + strconv.Itoa(day)
		Due_date, _ := strconv.Atoi(strings.Replace(Date.Due_date, "-", "", -1))
		TimeNow, _ := strconv.Atoi(strings.Replace(timenow, "-", "", -1))
		if Due_date <= TimeNow {
			c.JSON(500, gin.H{"message": "Due date invalid because anterior or equal"})
		} else {
			db.Where("user_id = ?", user_id).Where("book_id=?", book_isbn).Find(&Reservation).Update("due_date", Date.Due_date)
			c.JSON(200, gin.H{"message": "Due date assigned"})
		}
	}
}

func ConfirmRestore(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user_id := c.Query("user_id")
		book_isbn := c.Query("book_isbn")
		db.Where("user_id = ?", user_id).Where("book_id = ?", book_isbn).Delete(&internal.Reservation{})
		db.Where("isbn = ?", book_isbn).Find(&internal.Book{}).UpdateColumn("copies_available", gorm.Expr("copies_available  + ?", 1))
		c.JSON(200, gin.H{"message": "Book returned"})
	}
}
