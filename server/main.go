package main

import "github.com/gofiber/fiber/v2"

func main() {
	app := fiber.New()

	app.Get("/api/v0/transaction", handleTransaction)

	app.Listen("127.0.0.1:3000")
}

func handleTransaction(c *fiber.Ctx) error {
    return c.SendString("Successful")
}