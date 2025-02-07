import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table"

// Mock data for demonstration
const journalEntries = [
    { id: 1, date: "2023-06-01", accountName: "Cash", accountType: "Asset", debit: 1000, credit: 0 },
    { id: 2, date: "2023-06-01", accountName: "Revenue", accountType: "Revenue", debit: 0, credit: 1000 },
    { id: 3, date: "2023-06-02", accountName: "Expense", accountType: "Expense", debit: 500, credit: 0 },
    { id: 4, date: "2023-06-02", accountName: "Cash", accountType: "Asset", debit: 0, credit: 500 },
    // Add more mock entries as needed
]

export default function JournalTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {journalEntries.map((entry) => (
                    <TableRow key={entry.id}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.accountName}</TableCell>
                        <TableCell>{entry.accountType}</TableCell>
                        <TableCell>{entry.debit.toFixed(2)}</TableCell>
                        <TableCell>{entry.credit.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

