package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/generative-ai-go/genai"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

type Transaction struct {
	Transaction string `json:"transaction"`
}

// AI response struct to store unmarshalled ai response JSON
type Response struct {
	ClarificationNeeded bool     `json:"clarificationNeeded"`
	Questions           []string `json:"questions"`
	Date                string   `json:"date"`
	AccountsAffected    []string `json:"accountsAffected"`
	JournalEntry        []struct {
		Account     string `json:"account"`
		Debit       string `json:"debit"`
		Credit      string `json:"credit"`
		Description string `json:"description"`
	} `json:"journalEntry"`
}

// AI response format
var responseFormat = `
{
  "clarificationNeeded":"", // can be either true or false, true if you need further clarification
  "questions":[], // a list of the questions you need answered for you to accurately record the transaction
  "date": "", // use the current date if no date is provided else use the provided date formated correctly (dd-mm-yyyy)
  "accountsAffected": [], //A list of the affected accounts
  "journalEntry": [ // For all the accounts affected
    {
      "account": "", // Account name
      "debit": "", // debit ammount
      "credit": "", // credit ammount
      "description": "", // Why the account was affected, and the action taken
    },
    {
      "account": "", // Account name
      "debit": "", // Debit ammount
      "credit": "", // Credit ammount
      "description": "", // Why the account was affected, and the action taken
    }
  ]
}
`

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
		log.Fatalf("Invalid transaction")
	}

	response := talkToGemini(prompt, GEMINI_API_KEY)

	value, err := sanitizeResponse(response)
	if err != nil {
		log.Fatalf("Error sanitizing response: %v", err)
	}

	if value.ClarificationNeeded == true {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": "More information is needed to accurately record the transaction",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Transaction recorded successfully",
	})
}

func talkToGemini(prompt string, apiKey string) *genai.GenerateContentResponse {
	ctx := context.Background()

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Fatalf("Error creating client: %v", err)
	}
	defer client.Close()

	// model := client.GenerativeModel("gemini-1.5-flash")
	model := client.GenerativeModel("gemini-1.5-pro")

	model.SetTemperature(1)
	model.SetTopK(40)
	model.SetTopP(0.95)
	model.SetMaxOutputTokens(8192)
	model.ResponseMIMEType = "text/plain"
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{genai.Text(
			fmt.Sprintf(`Your response should be in this format %s. 
      Do not make any assumptions.
	  If a date is not specified use the date this prompt was sent
	  If the accounts affected is not clear ask for clarification.
	  If the payment method is not clear ask for clarification.
	  If the prompt is not related to accounting or tasks an accountant would perform ask for clarification.
	  If more information to record the transaction accurately ask for clarification.
	  `, responseFormat),
		)},
	}

	session := model.StartChat()
	// session.History = []*genai.Content{
	// 	{
	// 		Role: "user",
	// 		Parts: []genai.Part{
	// 			genai.Text("Purchase inventory worth $5000"),
	// 		},
	// 	},
	// 	{
	// 		Role: "model",
	// 		Parts: []genai.Part{
	// 			genai.Text("```json\n{\n  \"query\": \"Purchase inventory worth $5000\",\n  \"clarifications_needed\": [\n    {\n      \"question\": \"What type of inventory is being purchased?\",\n      \"options\": [] \n    },\n    {\n      \"question\": \"From whom is the inventory being purchased?\",\n      \"options\": []\n    },\n    {\n      \"question\": \"What is the payment method?\",\n      \"options\": []\n    },\n    {\n      \"question\": \"Is there a purchase order number or other relevant identifier?\",\n      \"options\": []\n    },\n    {\n      \"question\": \"What is the date of the purchase?\",\n      \"options\": []\n    }\n\n  ]\n}\n```\n"),
	// 		},
	// 	},
	// }

	response, err := session.SendMessage(ctx, genai.Text(prompt))
	if err != nil {
		log.Fatalf("Error sending message: %v", err)
	}

	return response
}

// Sanitize transaction prompt
func generatePrompt(transaction string) (string, error) {
	if len(transaction) == 0 {
		return "", errors.New("Transaction cannot be empty")
	}
	prompt := fmt.Sprintf(`detemine the affected accounts and 
  create a journal entry of this transaction \" %s \"`, transaction)
	return prompt, nil
}

// Sanitize AI response
func sanitizeResponse(response *genai.GenerateContentResponse) (Response, error) {
	res := response.Candidates[0].Content.Parts[0]

	jsonData, err := json.Marshal(res)
	if err != nil {
		return Response{}, fmt.Errorf("Error marshalling JSON: %w", err)
	}

	jsonString := string(jsonData)

	// Remove the backticks
	cleanedString := strings.TrimPrefix(jsonString, "\"```json\\n")
	cleanedString = strings.TrimSuffix(cleanedString, "\\n```\\n\"")
	cleanedString = strings.TrimSuffix(cleanedString, "```\"")

	// Remove JSON formatting indicators
	cleanedString = strings.ReplaceAll(cleanedString, "\\n", "\n")
	cleanedString = strings.ReplaceAll(cleanedString, "\\t", "\t")
	cleanedString = strings.ReplaceAll(cleanedString, "\\\"", "\"")

	fmt.Println(cleanedString)

	var r Response

	// Unmarshal the cleaned string into the struct
	unMarshalErr := json.Unmarshal([]byte(cleanedString), &r)
	if unMarshalErr != nil {
		return Response{}, fmt.Errorf("error unmarshalling JSON: %w", unMarshalErr)
	}

	return r, nil
}
