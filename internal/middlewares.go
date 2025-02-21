package internal

import (
	"github.com/gin-gonic/gin"
)

func CorsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS, GET, PUT,DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func ProtectedMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(401, gin.H{"message": "unauthorized"})
			return
		}

		tokenString = tokenString[len("Bearer "):]

		token, err := VerifyToken(tokenString)
		if err != nil {
			c.JSON(401, gin.H{"message": "unauthorized"})
			return
		} else {
			c.JSON(200, gin.H{"message": "protecred area", "token": token})
		}

	}
}
