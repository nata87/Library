package handlers

import (
	"allyoucanread/internal"
	"allyoucanread/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UserHandlers(r *gin.Engine, db *gorm.DB) {

	r.POST("/registration", services.Register(db))

	r.POST("/loginuser", services.LoginUser(db))

	r.POST("/protected", internal.ProtectedMiddleware())

	r.GET("/viewallbooks", services.ViewAllBooks(db))

	r.GET("/inventoryuserprofile", services.InventoryUserProfile(db))

	r.POST("/reservationuseron", services.ReservationUserOn(db))

	r.POST("/reservationuseroff", services.ReservationUserOff(db))

}
