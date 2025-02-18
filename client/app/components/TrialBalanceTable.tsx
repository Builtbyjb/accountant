import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TrialBalanceEntry } from "~/lib/constants";

type Props = {
  trialBalance: TrialBalanceEntry[];
};

export function TrialBalanceTable({ trialBalance }: Props) {
  const totalDebit = trialBalance.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = trialBalance.reduce(
    (sum, entry) => sum + entry.credit,
    0
  );

  return (
    <Card className="w-[40rem] max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Trial Balance
        </CardTitle>
        <CardDescription className="text-center">
          As of period end, December 25, 2025
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Account</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trialBalance.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.accountName}</TableCell>
                <TableCell className="text-right">
                  {entry.debit.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {entry.credit.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">
                {totalDebit.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </TableCell>
              <TableCell className="text-right">
                {totalCredit.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
