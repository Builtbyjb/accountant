import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import React from "react";
import type { JournalEntry, AccountDetails } from "~/lib/constants";
import { v4 as uuidv4 } from "uuid";

type JournalProps = {
  journalEntries?: JournalEntry[];
};

export default function JournalTable({ journalEntries }: JournalProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Account Name</TableHead>
          <TableHead>Debit</TableHead>
          <TableHead>Credit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* TODO: Figure out a better way to represent the table */}
        {journalEntries ? (
          journalEntries.map((entry: JournalEntry) => (
            <React.Fragment key={uuidv4()}>
              <TableRow key={uuidv4()}>
                <TableCell>{entry.date}</TableCell>
              </TableRow>
              {entry.debit.map((d: AccountDetails) => (
                <TableRow key={uuidv4()}>
                  <TableCell></TableCell>
                  <TableCell>{d.accountName}</TableCell>
                  <TableCell>{d.amount.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
              {entry.credit.map((c: AccountDetails) => (
                <TableRow key={uuidv4()}>
                  <TableCell></TableCell>
                  <TableCell>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {c.accountName}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>{c.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow key={uuidv4()}>
                <TableCell></TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow key={uuidv4()}>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </React.Fragment>
          ))
        ) : (
          <>
            <p className="text-sm text-red-500 dark:text-red-400">
              No journal entries at this time. Record a transaction to view
              journal entries
            </p>
          </>
        )}
      </TableBody>
    </Table>
  );
}
