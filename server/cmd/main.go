package main

import (
	"log"

	"server/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	// "server/middleware"

	"server/handlers"
)

func main() {
	app := fiber.New()

	// Setup CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Connect to database and create database engine
	db := database.DB()
	handler := &handlers.Handler{DB: db}

	// TODO: refactor api endpoints

	// health check
	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"ping": "pong!",
		})
	})

	// api := app.Group("/api", middleware.AuthMiddleware())
	api := app.Group("/api")

	// Protected routes group
	api.Post("/transaction", handler.HandleTransaction)
	api.Get("/journal", handler.HandleJournal)

	auth := app.Group("/auth")
	auth.Post("/register", handlers.Register)
	auth.Post("/login", handlers.Login)

	log.Fatal(app.Listen("0.0.0.0:3000"))
}
