package services

import (
	"allyoucanread/internal"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Register(db *gorm.DB) gin.HandlerFunc {
	fn := func(c *gin.Context) {

		body, err := c.GetRawData()
		if err != nil {
			panic(err)
		}

		var UserReg internal.User

		err = json.Unmarshal(body, &UserReg)
		if err != nil {
			panic(err)
		}
		var count int64
		hash := sha256.Sum256([]byte(UserReg.Password))
		db.Where("email=?", UserReg.Email).Find(&UserReg).Count(&count)
		if count > 0 {
			c.JSON(401, gin.H{"message": "Email already in use"})
		} else {
			User := internal.User{Name: UserReg.Name, Surname: UserReg.Surname, Role: "cliente", Email: UserReg.Email, Password: hex.EncodeToString(hash[:])}
			db.Create(&User)
			c.JSON(200, gin.H{"message": "Successful registration!"})
		}

	}

	return gin.HandlerFunc(fn)

}
