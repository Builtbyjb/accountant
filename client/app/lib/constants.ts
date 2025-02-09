import { UUIDTypes } from "uuid";

export type AccountDetails = {
  journalId: UUIDTypes;
  id: UUIDTypes;
  accountName: String;
  amount: Number;
  createdAt: String;
  updatedAt: String;
};

export type JournalEntry = {
  id: UUIDTypes;
  date: String;
  debits: AccountDetails[];
  credits: AccountDetails[];
  description: String;
  createdAt: String;
  updatedAt: String;
};
