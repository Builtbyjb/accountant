import type { AccountEntry, TAccountEntry } from "~/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface TAccountProps {
  accountRef: string;
  accountName: string;
  entries: TAccountEntry;
}

export default function DisplayTAccount({
  accountName,
  accountRef,
  entries,
}: TAccountProps) {
  // console.log(entries);
  const balance = entries.totalDebit - entries.totalCredit;
  const isDebitBalance = balance >= 0;

  return (
    <Card className="w-[30rem] max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {accountName} ({accountRef})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.entries ? (
              <>
                {entries.entries.map((ent: AccountEntry, index) => (
                  <TableRow key={index}>
                    <TableCell>{ent.debit.toFixed(2)}</TableCell>
                    <TableCell>{ent.credit.toFixed(2) || ""}</TableCell>
                  </TableRow>
                ))}
              </>
            ) : null}
            <TableRow>
              <TableCell>
                Total: {entries.totalDebit.toFixed(2) || ""}
              </TableCell>
              <TableCell>
                Total: {entries.totalCredit.toFixed(2) || ""}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                {isDebitBalance ? `Balance: ${balance.toFixed(2)}` : ""}
              </TableCell>
              <TableCell>
                {!isDebitBalance
                  ? `Balance: ${Math.abs(balance).toFixed(2)}`
                  : ""}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
