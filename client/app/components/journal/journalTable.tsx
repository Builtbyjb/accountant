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
import { Button } from "../ui/button";

type JournalProps = {
  journalEntries: JournalEntry[];
  handleAccountRef: (accountRef: string) => void;
};

export default function JournalTable({
  journalEntries,
  handleAccountRef,
}: JournalProps) {
  // console.log(journalEntries);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Account Name</TableHead>
          <TableHead>Account Reference</TableHead>
          <TableHead>Debit</TableHead>
          <TableHead>Credit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* TODO: Figure out a better way to represent the table */}
        {journalEntries.map((entry: JournalEntry) => (
          <React.Fragment key={uuidv4()}>
            <TableRow key={uuidv4()}>
              <TableCell className="min-w-[8rem]">{entry.date}</TableCell>
            </TableRow>
            {entry.debits.map((d: AccountDetails) => (
              <TableRow key={uuidv4()}>
                <TableCell></TableCell>
                <TableCell>{d.accountName}</TableCell>
                {/* TODO: should link to T account with this account ref  */}
                <TableCell>
                  <Button onClick={() => handleAccountRef(d.accountRef)}>
                    {d.accountRef}
                  </Button>
                </TableCell>
                <TableCell>{d.amount.toFixed(2)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
            {entry.credits.map((c: AccountDetails) => (
              <TableRow key={uuidv4()}>
                <TableCell></TableCell>
                <TableCell>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {c.accountName}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleAccountRef(c.accountRef)}>
                    {c.accountRef}
                  </Button>
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
        ))}
      </TableBody>
    </Table>
  );
}
