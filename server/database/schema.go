package database

import (
	"time"

	"github.com/google/uuid"
)

type Credit struct {
	JournalId   uuid.UUID `gorm:"type:uuid;foreignKey" json:"journalId"` // Foreign key
	Id          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	AccountName string    `gorm:"type:text;not null" json:"accountName"`
	Amount      int       `gorm:"type:integer;not null" json:"amount"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Debit struct {
	JournalId   uuid.UUID `gorm:"type:uuid;foreignKey" json:"journalId"` // Foreign key
	Id          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	AccountName string    `gorm:"type:text;not null" json:"accountName"`
	Amount      int       `gorm:"type:integer;not null" json:"amount"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type JournalEntry struct {
	Id          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Date        string    `gorm:"type:text;not null" json:"date"`
	Description string    `gorm:"type:text;not null" json:"description"`
	Credits     []Credit  `gorm:"foreignKey:JournalId" json:"credits"` // One to many relationship
	Debits      []Debit   `gorm:"foreignKey:JournalId" json:"debits"`  // One to many relationship
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
