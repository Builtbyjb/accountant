package handlers

import (
	"errors"
	"fmt"
	"server/database"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type TrialBalanceEntry struct {
	AccountName string `json:"accountName"`
	Debit       int    `json:"debit"`
	Credit      int    `json:"credit"`
}

type TrialBalanceResponse struct {
	Message string              `json:"message"`
	Data    []TrialBalanceEntry `json:"data"`
}

func (h *Handler) HandleTrialBalance(c *fiber.Ctx) error {
	db := h.DB

	// TODO: rearrange trial balance in order according to the
	// trial balance rules
	trialBalance, err := generateTrialBalance(db)
	if err != nil {
		return c.Status(fiber.StatusOK).SendString("Trial Balance error")
	}

	response := TrialBalanceResponse{
		Message: "Trial Balance retrieved successfully",
		Data:    trialBalance,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func generateTrialBalance(db *gorm.DB) ([]TrialBalanceEntry, error) {
	var accounts []database.Account
	accountResult := db.Find(&accounts)
	if accountResult.Error != nil {
		return nil, fmt.Errorf("database error: %w", accountResult.Error)
	}

	if accountResult.RowsAffected == 0 {
		return nil, errors.New("no account found")
	}

	var trialBalance []TrialBalanceEntry

	for i := range accounts {
		a := accounts[i].AccountName

		var cAccounts []database.Credit
		var dAccounts []database.Debit

		cResult := db.Where("account_name = ?", a).Find(&cAccounts)
		if cResult.Error != nil {
			return nil, fmt.Errorf("database error: %w", cResult.Error)
		}

		dResult := db.Where("account_name = ?", a).Find(&dAccounts)
		if dResult.Error != nil {
			return nil, fmt.Errorf("database error: %w", dResult.Error)
		}

		var cList []int
		var dList []int

		for i := range cAccounts {
			cList = append(cList, cAccounts[i].Amount)
		}

		for i := range dAccounts {
			dList = append(dList, dAccounts[i].Amount)
		}

		tCredit := sumBal(cList)
		tDebit := sumBal(dList)

		var credit int
		var debit int

		bal, isDebitBal := balance(tCredit, tDebit)
		if isDebitBal {
			debit = bal
			credit = 0
		} else {
			credit = bal * -1
			debit = 0
		}

		trialBalance = append(trialBalance, TrialBalanceEntry{
			AccountName: a,
			Debit:       debit,
			Credit:      credit,
		})
	}

	return trialBalance, nil
}

func sumBal(amounts []int) int {
	var totalAmount int
	for i := range amounts {
		totalAmount += amounts[i]
	}
	return totalAmount
}

func balance(c int, d int) (int, bool) {
	bal := d - c
	isDebitBal := bal >= 0

	return bal, isDebitBal

}
