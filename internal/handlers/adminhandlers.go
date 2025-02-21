package handlers

import (
	"allyoucanread/internal/services"

	"github.com/gin-gonic/gin"

	"gorm.io/gorm"
)

func CrudHandlers(r *gin.Engine, db *gorm.DB) {

	r.POST("/create", services.CreateBook(db))

	r.GET("/readAll", services.ViewAllBooks(db))

	r.PUT("/update", services.UpdateBook(db))

	r.DELETE("/delete", services.DeleteBook(db))

	r.POST("/loginadmin", services.LoginAdmin(db))

	r.GET("/viewallusers", services.ViewAllUsers(db))

	r.GET("/inventoryuser", services.InventoryUser(db))

	r.PUT("/assignduedate", services.AssignDueDate(db))

	r.DELETE("/confirmrestore", services.ConfirmRestore(db))

}
