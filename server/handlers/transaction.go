package handlers

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

type Transaction struct {
	Transaction string `json:"transaction"`
}

func HandleTransaction(c *fiber.Ctx) error {
	var transaction Transaction
	if err := c.BodyParser((&transaction)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	jsonData, err := json.Marshal(transaction)
	if err != nil {
		log.Fatalf("Error marshalling JSON: %v", err)
	}

	fmt.Println(string(jsonData))

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"Success": "Transaction Recorded successfully",
	})
}
