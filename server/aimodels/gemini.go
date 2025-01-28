package aimodels

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// AI response struct to store unmarshaled ai response JSON
type TransactionResponse struct {
	ClarificationNeeded bool     `json:"clarificationNeeded"`
	Questions           []string `json:"questions"`
	Date                string   `json:"date"`
	AccountsAffected    []string `json:"accountsAffected"`
	JournalEntry        []struct {
		Account string `json:"account"`
		Debit   string `json:"debit"`
		Credit  string `json:"credit"`
	} `json:"journalEntry"`
	Description string `json:"description"`
}

// AI response format
var transactionResponseFormat = `
{
	"clarificationNeeded":"", // can be either true or false, true if you need further clarification
	"questions":[], // a list of the questions you need answered for you to accurately record the transaction
	"date": "", // use the current date if no date is provided else use the provided date formatted correctly (dd-mm-yyyy)
	"accountsAffected": [], //A list of the affected accounts
	"journalEntry": [ // For all the accounts affected
		{
    		"account": "", // Account name
    		"debit": "", // debit amount
    		"credit": "", // credit amount
    	},
    	{
    		"account": "", // Account name
      		"debit": "", // Debit amount
      		"credit": "", // Credit amount
    	}
  	]
	"description": "", // Why the accounts were affected, and the actions taken
}
`

func TalkToGemini(prompt string, apiKey string) (TransactionResponse, error) {
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
	  `, transactionResponseFormat),
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

	// ToDo: Should be able to infer the date if no date is specified

	response, err := session.SendMessage(ctx, genai.Text(prompt))
	if err != nil {
		return TransactionResponse{}, fmt.Errorf("Error sending message: %w", err)
	}

	res, err := sanitizeResponse(response)
	if err != nil {
		return TransactionResponse{}, fmt.Errorf("Error sanitizing  Gemini response: %w", err)
	}

	return res, nil
}

// Sanitize AI response
func sanitizeResponse(response *genai.GenerateContentResponse) (TransactionResponse, error) {
	res := response.Candidates[0].Content.Parts[0]

	jsonData, err := json.Marshal(res)
	if err != nil {
		return TransactionResponse{}, fmt.Errorf("Error marshalling JSON: %w", err)
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

	var r TransactionResponse

	// Unmarshal the cleaned string into the struct
	unMarshalErr := json.Unmarshal([]byte(cleanedString), &r)
	if unMarshalErr != nil {
		return TransactionResponse{}, fmt.Errorf("error unmarshaling JSON: %w", unMarshalErr)
	}

	return r, nil
}
