package handlers

import (
	"errors"
	"fmt"
	"log"
	"os"

	"server/aimodels"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

type Transaction struct {
	Transaction string `json:"transaction"`
}

func HandleTransaction(c *fiber.Ctx) error {

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

	response, err := aimodels.Gemini(prompt, GEMINI_API_KEY)
	if err != nil {
		log.Fatalf("Error sanitizing response: %v", err)
	}

	if response.ClarificationNeeded == true {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"error": "More information is needed to accurately record the transaction",
			"info":  response.Questions,
		})
	}

	// TODO: Add response to a database

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
  		create a journal entry of this transaction \" %s \"`, transaction)

	return prompt, nil
}
