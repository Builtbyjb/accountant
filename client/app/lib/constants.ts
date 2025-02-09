import { UUIDTypes } from "uuid";

export type AccountDetails = {
  accountName: String;
  amount: Number;
};

export type JournalEntry = {
  id: UUIDTypes;
  date: String;
  debit: AccountDetails[];
  credit: AccountDetails[];
  description: String;
};
