package handlers

import (
	"fmt"
	"log"
	"server/database"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type Response struct {
	Message string                  `json:"message"`
	Data    []database.JournalEntry `json:"data"`
}

func (h *Handler) HandleJournal(c *fiber.Ctx) error {
	db := h.DB

	journalEntries, err := getJournalEntries(db)
	if err != nil {
		log.Fatalf("error fetching journal entries: %v", err)
	}

	// jsondata, err := json.MarshalIndent(journalEntries, "", "  ")
	// if err != nil {
	// 	log.Fatalf("error: %v", err)
	// }
	// fmt.Println(string(jsondata))

	response := Response{
		Message: "Journal entries retrieved successfully",
		Data:    journalEntries,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func getJournalEntries(db *gorm.DB) ([]database.JournalEntry, error) {

	// Raw journal entries from database
	var J []database.JournalEntry
	result := db.Find(&J)
	if result.Error != nil {
		return nil, fmt.Errorf("error fetching journal entries: %v", result.Error)
	}

	// sanitized journal entries
	var JournalEntries []database.JournalEntry

	for i := range len(J) {

		// Get credit accounts
		var creditAccounts []database.Credit
		creditResult := db.Where("journal_id = ?", J[i].Id).Find(&creditAccounts)
		if creditResult.Error != nil {
			return nil, fmt.Errorf("error fetching credit accounts: %v", creditResult.Error)
		}

		// Get debit accounts
		var debitAccounts []database.Debit
		debitResult := db.Where("journal_id = ?", J[i].Id).Find(&debitAccounts)
		if debitResult.Error != nil {
			return nil, fmt.Errorf("error fetching debit accounts: %v", debitResult.Error)
		}

		JournalEntries = append(JournalEntries, database.JournalEntry{
			Id:          J[i].Id,
			Date:        J[i].Date,
			Debits:      debitAccounts,
			Credits:     creditAccounts,
			Description: J[i].Description,
		})
	}
	return JournalEntries, nil
}
