package middleware

import (
    "strings"
    "github.com/gofiber/fiber/v2"
    "github.com/clerk/clerk-sdk-go"
)

var clerkClient clerk.Client

func InitClerk() {
    client, err := clerk.NewClient("your_clerk_secret_key")
    if err != nil {
        panic(err)
    }
    clerkClient = *client
}

func AuthMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        token := c.Get("Authorization")
        if token == "" {
            return c.Status(401).JSON(fiber.Map{
                "error": "Missing authorization header",
            })
        }

        // Remove Bearer prefix
        token = strings.TrimPrefix(token, "Bearer ")
        
        // Verify JWT
        claims, err := clerkClient.VerifyToken(token)
        if err != nil {
            return c.Status(401).JSON(fiber.Map{
                "error": "Invalid token",
            })
        }

        // Set claims in context
        c.Locals("claims", claims)
        return c.Next()
    }
}