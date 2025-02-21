package services

import (
	"allyoucanread/internal"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Reservation struct {
	Email string `json:"email"`
	Isbn  int    `json:"isbn"`
}

type Reservationuserprofile struct {
	Book     internal.Book
	Due_date string
	State    string
}

func ReservationUserOn(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		body, err := c.GetRawData()
		if err != nil {
			panic(err)
		}
		fmt.Println("Raw JSON ricevuto:", string(body))
		var Reserve Reservation
		var User internal.User
		var Book internal.Book
		err = json.Unmarshal(body, &Reserve)
		if err != nil { ///modifica gestione errori
			c.JSON(400, gin.H{"error": "Dati JSON non validi"})
			return
		}
		Email := Reserve.Email
		Isbn := Reserve.Isbn
		db.Where("email=?", Email).Find(&User)
		db.Where("isbn=?", Isbn).Find(&Book)
		year, month, day := time.Now().Date()
		timenow := strconv.Itoa(year) + "-" + strconv.Itoa(int(month)) + "-" + strconv.Itoa(day)
		NewReservation := internal.Reservation{User_id: User.Id, Book_id: Isbn, Reservation_date: timenow, Status: "noleggiato"}
		var count int64
		db.Where("user_id = ?", User.Id).Where("book_id=?", Isbn).Find(&internal.Reservation{}).Count(&count)
		if Book.Copies_available == 0 {
			c.JSON(404, gin.H{"message": "Book not available"})
		} else if count > 0 {
			c.JSON(401, gin.H{"message": "Book already reserved"})
		} else {
			db.Create(&NewReservation)
			db.Where("isbn=?", Isbn).Find(&Book).UpdateColumn("copies_available", gorm.Expr("copies_available  - ?", 1))
			c.JSON(200, gin.H{"message": "Book reserved"}) //modifica
		}
	}
}

func InventoryUserProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		Email := c.Query("email")
		var User internal.User
		var Reservations []internal.Reservation
		var Reservationsusr []Reservationuserprofile
		db.Where("email= ?", Email).Find(&User)
		db.Where("user_id=?", User.Id).Find(&Reservations)
		for _, reservation := range Reservations {
			var Book internal.Book
			db.Where("isbn=?", reservation.Book_id).Find(&Book)
			reservationuser := Reservationuserprofile{Book: Book, Due_date: reservation.Due_date, State: reservation.Status}
			Reservationsusr = append(Reservationsusr, reservationuser)
			year, month, day := time.Now().Date()
			timenow := strconv.Itoa(year) + "-" + strconv.Itoa(int(month)) + "-" + strconv.Itoa(day)
			Due_date, _ := strconv.Atoi(strings.Replace(reservation.Due_date, "-", "", -1))
			TimeNow, _ := strconv.Atoi(strings.Replace(timenow, "-", "", -1))
			isbn := reservation.Book_id
			if TimeNow >= Due_date {
				c.JSON(403, gin.H{"message": "Expired lecture for book with isbn=" + strconv.Itoa(isbn)})
			}
		}
		c.JSON(200, gin.H{"message": Reservationsusr})
	}
}

func ReservationUserOff(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		body, err := c.GetRawData()
		if err != nil {
			panic(err)
		}
		var Reservation Reservation
		var User internal.User
		var Book internal.Book
		err = json.Unmarshal(body, &Reservation)
		if err != nil {
			panic(err)
		}
		Email := Reservation.Email
		Isbn := Reservation.Isbn
		db.Where("email=?", Email).Find(&User)
		db.Where("isbn=?", Isbn).Find(&Book)
		db.Where("user_id= ?", User.Id).Where("book_id=?", Book.Isbn).Find(&internal.Reservation{}).UpdateColumn("status", "restituito")
		c.JSON(200, gin.H{"message": "Book restored"})
	}
}
