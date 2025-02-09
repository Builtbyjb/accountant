package agents

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"server/utils"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func Gemini(prompt string, apiKey string) (utils.TransactionResponse, error) {
	ctx := context.Background()

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Fatalf("Error creating client: %v", err)
	}
	defer client.Close()

	// model := client.GenerativeModel("gemini-1.5-flash")
	model := client.GenerativeModel("gemini-1.5-pro")
	// model := client.GenerativeModel("gemini-2.0-flash-thinking-exp-01-21")

	model.SetTemperature(1)
	model.SetTopK(40)
	model.SetTopP(0.95)
	model.SetMaxOutputTokens(8192)
	model.ResponseMIMEType = "text/plain"
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{genai.Text(
			fmt.Sprintf(`Your response should be in this format %s. 
      Do not make any assumptions.
	  If the accounts affected is not clear ask for clarification.
	  If the payment method is not clear ask for clarification.
	  If the prompt is not related to accounting or tasks an accountant would perform ask for clarification.
	  If more information to record the transaction accurately ask for clarification.
	  `, utils.TransactionResponseFormat),
		)},
	}

	session := model.StartChat()

	response, err := session.SendMessage(ctx, genai.Text(prompt))
	if err != nil {
		return utils.TransactionResponse{}, fmt.Errorf("error sending message: %w", err)
	}

	// TODO: Retrying requests multiple times

	res, err := sanitizeResponse(response)
	if err != nil {
		return utils.TransactionResponse{}, fmt.Errorf("error sanitizing Gemini response: %w", err)
	}

	return res, nil
}

// Sanitize AI response
func sanitizeResponse(response *genai.GenerateContentResponse) (utils.TransactionResponse, error) {
	res := response.Candidates[0].Content.Parts[0]

	jsonData, err := json.Marshal(res)
	if err != nil {
		return utils.TransactionResponse{}, fmt.Errorf("error marshalling JSON: %w", err)
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
	cleanedString = strings.ReplaceAll(cleanedString, "\\", "")

	// fmt.Println(cleanedString)

	var r utils.TransactionResponse

	// Unmarshal the cleaned string into the struct
	unMarshalErr := json.Unmarshal([]byte(cleanedString), &r)
	if unMarshalErr != nil {
		return utils.TransactionResponse{}, fmt.Errorf("error unmarshaling JSON: %w", unMarshalErr)
	}

	return r, nil
}
