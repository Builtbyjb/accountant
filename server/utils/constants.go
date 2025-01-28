package utils

// AI response struct to store unmarshaled AI response
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

var TransactionResponseFormat = `
{
	"clarificationNeeded":"", // can be either true or false, true if you need further clarification
	"questions":[], // a list of the questions you need answered in order to accurately record the transaction
	"date": "", // (dd-mm-yyyy)
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
