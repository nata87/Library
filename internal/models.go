package internal

type User struct {
	Id       int    `gorm:"primaryKey;autoincrement;not null" json:"Id"`
	Name     string `gorm:"not null" json:"Name"`
	Surname  string `gorm:"not null" json:"Surname"`
	Role     string `gorm:"not null" json:"Role"`
	Email    string `gorm:"not null" json:"Email"`
	Password string `gorm:"not null" json:"Password"`
}

type Book struct {
	Isbn             int    `gorm:"primaryKey;not null;autoincrement:false" json:"Isbn"`
	Title            string `gorm:"not null" json:"Title"`
	Genre            string `gorm:"not null" json:"Genre"`
	Author           string `gorm:"not null" json:"Author"`
	Year             int    `gorm:"not null" json:"Year"`
	Copies_total     int    `gorm:"not null" json:"Copies_total"`
	Copies_available int    `gorm:"not null" json:"Copies_available"`
}

type Reservation struct {
	Id               int    `gorm:"primaryKey;autoincrement;not null" json:"Id"`
	User_id          int    `gorm:"not null;constraint:OnDelete:CASCADE" json:"User_id"`
	Book_id          int    `gorm:"not null;constraint:OnDelete:CASCADE" json:"Book_id"`
	Reservation_date string `gorm:"not null" json:"Reservation_date"`
	Due_date         string `gorm:"not null" json:"Due_date"`
	Status           string `gorm:"not null" json:"Status"`
	User             User   `gorm:"foreignkey:User_id;references:Id"`
	Book             Book   `gorm:"foreignkey:Book_id;references:Isbn"`
}
