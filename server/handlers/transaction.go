package handlers

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"

	"server/agents"
	"server/database"
	"server/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type Transaction struct {
	Transaction string `json:"transaction"`
}

func (h *Handler) HandleTransaction(c *fiber.Ctx) error {

	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// Get gemini api key
	GEMINI_API_KEY := os.Getenv("GEMINI_API_KEY")

	// Get transaction record from the client
	var t Transaction
	if err := c.BodyParser((&t)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	prompt, err := generatePrompt(t.Transaction)
	if err != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": "Invalid transaction",
		})
	}

	response, err := agents.Gemini(prompt, GEMINI_API_KEY)
	if err != nil {
		log.Fatalf("AI response error: %v", err)
	}

	if response.ClarificationNeeded {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": "More information is needed to accurately record the transaction",
			"info":  response.Questions,
		})
	}

	// Add response to database
	db := h.DB

	journal := database.Journal{
		Id:          uuid.New(),
		Date:        response.Date,
		Description: response.Description,
	}

	// create journal entry
	journalResult := db.Create(&journal)
	if journalResult.Error != nil {
		log.Fatalf("Could not create journal entry: %v", journalResult.Error)
	}

	accountErr := addAccounts(journal.Id, db, response.JournalEntry)
	if accountErr != nil {
		log.Fatalf("Count not create account: %v", accountErr)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Transaction recorded successfully",
	})
}

// Sanitize transaction prompt
func generatePrompt(transaction string) (string, error) {
	if len(transaction) == 0 {
		return "", errors.New("Transaction cannot be empty")
	}

	prompt := fmt.Sprintf(`determine the affected accounts and 
  		create a journal entry of this transaction "%s"`, transaction)

	return prompt, nil
}

// Add journal entry accounts to the database
func addAccounts(journalId uuid.UUID, db *gorm.DB, journalEntries []utils.JournalEntry) error {

	var r *gorm.DB

	for i := range len(journalEntries) {

		amount, err := strconv.Atoi(journalEntries[i].Amount)
		if err != nil {
			log.Fatalf("unable to convert amount string to int: %v", err)
		}

		account := database.Account{
			Id:          uuid.New(),
			Name:        journalEntries[i].AccountName,
			JournalId:   journalId,
			AccountType: journalEntries[i].AccountType,
			Amount:      amount,
		}

		r = db.Create(&account)
		if r.Error != nil {
			return fmt.Errorf("Count not add account to database: %w", r.Error)
		} else {
			continue
		}
	}
	return nil
}
