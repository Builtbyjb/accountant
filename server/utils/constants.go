package utils

type AccountDetail struct {
	AccountName string `json:"accountName"`
	Amount      string `json:"amount"`
}

type JournalEntry struct {
	Date        string          `json:"date"`
	Description string          `json:"description"`
	Credits     []AccountDetail `json:"credits"`
	Debits      []AccountDetail `json:"debits"`
}

// AI response struct to store unmarshaled AI response
type TransactionResponse struct {
	ClarificationNeeded bool         `json:"clarificationNeeded"`
	Questions           []string     `json:"questions"`
	JournalEntry        JournalEntry `json:"journalEntry"`
}

var TransactionResponseFormat = `
{
	clarificationNeeded:"", // can be either true or false, true if you need further clarification
	questions:[], // a list of the questions you need answered in order to accurately record the transaction
	journalEntry: {
		date: "", // In (dd-mm-yyyy) format
		credits: [ // For all the accounts credited
			{
  		  		"accountName": "", // Account name
  		  		"amount": "", // Amount 
  		  	},
		],
		debits: [ // For all the accounts debited
			{
  		  		"accountName": "", // Account name
  		  		"amount": "", // Amount 
  		  	},
		]
		description: "", // Why the accounts were affected, and the actions taken
	}
}
`
