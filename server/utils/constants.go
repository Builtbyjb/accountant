package utils

type JournalEntry struct {
	AccountName string `json:"accountName"`
	AccountType string `json:"AccountType"`
	Amount      string `json:"amount"`
}

// AI response struct to store unmarshaled AI response
type TransactionResponse struct {
	ClarificationNeeded bool           `json:"clarificationNeeded"`
	Questions           []string       `json:"questions"`
	Date                string         `json:"date"`
	AccountsAffected    []string       `json:"accountsAffected"`
	JournalEntry        []JournalEntry `json:"journalEntry"`
	Description         string         `json:"description"`
}

var TransactionResponseFormat = `
{
	"clarificationNeeded":"", // can be either true or false, true if you need further clarification
	"questions":[], // a list of the questions you need answered in order to accurately record the transaction
	"date": "", // (dd-mm-yyyy)
	"accountsAffected": [], //A list of the affected accounts
	"journalEntry": [ // For all the accounts affected
		{
    		"accountName": "", // Account name
    		"accountType": "", // Account type, credit or debit
    		"amount": "", // Amount 
    	},
  	]
	"description": "", // Why the accounts were affected, and the actions taken
}
`
