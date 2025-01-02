package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"server/middleware"
)

func main() {
	app := fiber.New()
	middleware.InitClerk()	

	// Setup CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	app.Get("/api/v0/transaction", handleTransaction)

	// Protected routes group
	api := app.Group("/api", middleware.AuthMiddleware())
	api.Get("/protected", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Protected route accessed successfully",
		})
	})

	app.Listen("127.0.0.1:3000")
}

func handleTransaction(c *fiber.Ctx) error {
    return c.SendString("Successful")
}