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

	journal := database.JournalEntry{
		Id:          uuid.New(),
		Date:        response.JournalEntry.Date,
		Description: response.JournalEntry.Description,
	}

	// create journal entry
	journalResult := db.Create(&journal)
	if journalResult.Error != nil {
		log.Fatalf("Error creating journal entry: %v", journalResult.Error)
	}

	// INFO: Can use channels to run the functions concurrently

	// Add credit accounts
	creditAccountErr := addCreditAccounts(journal.Id, db, response.JournalEntry.Credits)
	if creditAccountErr != nil {
		log.Fatalf("Error creating accounts: %v", creditAccountErr)
	}

	// Add debit accounts
	debitAccountErr := addDebitAccounts(journal.Id, db, response.JournalEntry.Debits)
	if debitAccountErr != nil {
		log.Fatalf("Error creating accounts: %v", debitAccountErr)
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

	prompt := fmt.Sprintf(`Create a journal entry for this transaction "%s"`, transaction)

	return prompt, nil
}

// Add journal entry credit accounts to the database
func addCreditAccounts(journalId uuid.UUID, db *gorm.DB, credits []utils.AccountDetail) error {

	var r *gorm.DB

	for i := range len(credits) {

		amount, err := strconv.Atoi(credits[i].Amount)
		if err != nil {
			return fmt.Errorf("unable to convert credit amount string to int: %v", err)
		}

		credit := database.Credit{
			Id:        uuid.New(),
			JournalId: journalId,
			Account: database.AccountDetail{
				AccountName: credits[i].AccountName,
				Amount:      amount,
			},
		}

		r = db.Create(&credit)
		if r.Error != nil {
			return fmt.Errorf("count not add credit account to database: %w", r.Error)
		} else {
			continue
		}
	}
	return nil
}

// Add journal entry debit accounts to the database
func addDebitAccounts(journalId uuid.UUID, db *gorm.DB, debits []utils.AccountDetail) error {

	var r *gorm.DB

	for i := range len(debits) {

		amount, err := strconv.Atoi(debits[i].Amount)
		if err != nil {
			return fmt.Errorf("unable to convert amount string to int: %v", err)
		}

		debit := database.Debit{
			Id:        uuid.New(),
			JournalId: journalId,
			Account: database.AccountDetail{
				AccountName: debits[i].AccountName,
				Amount:      amount,
			},
		}

		r = db.Create(&debit)
		if r.Error != nil {
			return fmt.Errorf("count not add account to database: %w", r.Error)
		} else {
			continue
		}
	}
	return nil
}
