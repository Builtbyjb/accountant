package main

import (
	"fmt"
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	// "server/middleware"
)

type User struct {
	Firstname string `json:"firstname"`
	Lastname string `json:"lastname"`
	Email string `json:"email"`
	Password string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
}

func main() {
	app := fiber.New()
	// middleware.InitClerk()	

	// Setup CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	api := app.Group("/api")

	v0 := api.Group("/v0")
	v0.Get("/transaction", handleTransaction)
	v0.Post("/register", registerUser)

	// Protected routes group
	// api := app.Group("/api", middleware.AuthMiddleware())
	// api.Get("/protected", func(c *fiber.Ctx) error {
	// 	return c.JSON(fiber.Map{
	// 		"message": "Protected route accessed successfully",
	// 	})
	// })

	log.Fatal(app.Listen("127.0.0.1:3000"))
}

func apiHandler(c *fiber.Ctx) error {
    return c.SendString("ApiSuccessful")
}

func v0Handler(c *fiber.Ctx) error {
    return c.SendString("v0Successful")
}

func handleTransaction(c *fiber.Ctx) error {
    return c.SendString("Successful")
}

func registerUser(c *fiber.Ctx) error {
	var u User
	if err := c.BodyParser(&u); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	fmt.Println(u)
	return c.Status(fiber.StatusOK).JSON(fiber.Map {
		"success": "User registered",
	})
}