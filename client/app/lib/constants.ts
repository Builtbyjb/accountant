import { UUIDTypes } from "uuid";

export type AccountDetails = {
  journalId: UUIDTypes;
  AccountId: UUIDTypes;
  accountName: string;
  accountRef: string;
  amount: number;
};

export type JournalEntry = {
  id: UUIDTypes;
  date: string;
  debits: AccountDetails[];
  credits: AccountDetails[];
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountEntry = {
  debit: number;
  credit: number;
};

export type TAccountEntry = {
  accountRef: string;
  accountName: string;
  entries: AccountEntry[] | null;
  totalCredit: number;
  totalDebit: number;
};

export type TrialBalanceEntry = {
  accountName: string;
  debit: number;
  credit: number;
};
