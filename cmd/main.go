package main

import (
	"allyoucanread/internal"
	"allyoucanread/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()

	r.Use(internal.CorsMiddleware())

	db := internal.ConnectDb()

	internal.Migrate(db)

	handlers.CrudHandlers(r, db)

	handlers.UserHandlers(r, db)

	r.Run(":8080")

}
