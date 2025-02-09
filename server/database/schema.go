package database

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AccountDetail struct {
	AccountName string `gorm:"type:text;not null"`
	Amount      int    `gorm:"type:integer;not null"`
}

type Credit struct {
	gorm.Model
	JournalId uuid.UUID `gorm:"type:uuid;foreignKey"` // Foreign key
	Id        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Account   AccountDetail
}

type Debit struct {
	gorm.Model
	JournalId uuid.UUID `gorm:"type:uuid;foreignKey"` // Foreign key
	Id        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Account   AccountDetail
}

type JournalEntry struct {
	gorm.Model
	Id          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Date        string    `gorm:"type:text;not null"`
	Description string    `gorm:"type:text;not null"`
	Credits     []Credit  // One to many relationship
	Debits      []Debit   // One to many relationship
}
