package handlers

import "github.com/gofiber/fiber/v2"

func (h *Handler) HandleJournal(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Transaction recorded successfully",
	})
}
