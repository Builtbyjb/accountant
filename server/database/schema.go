package database

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Journal struct {
	gorm.Model
	Id          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Date        string    `gorm:"type:text;not null"`
	Description string    `gorm:"type:text;not null"`
	Accounts    []Account // One to many relationship
}

type Account struct {
	gorm.Model
	Id          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Name        string    `gorm:"type:text;not null"`
	JournalId   uuid.UUID `gorm:"type:uuid;foreignKey"` // Foreign key
	Amount      int       `gorm:"type:integer;not null"`
	AccountType string    `gorm:"type:text;not null"`
}
