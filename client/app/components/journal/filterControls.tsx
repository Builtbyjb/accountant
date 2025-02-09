import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "~/components/ui/select"
// import { Calendar } from "~/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Download, Filter } from "lucide-react"
// import { CalendarIcon } from "lucide-react"
// import { format } from "date-fns"

export default function FilterControls() {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [accountType, setAccountType] = useState("")
    const [accountName, setAccountName] = useState("")
    // const [date, setDate] = useState<Date>()

    const handleFilter = () => {
        // Implement filtering logic here
        console.log("Filtering with:", { startDate, endDate, accountType, accountName })
    }

    const handleDownload = () => {
        // Implement download logic here
        console.log("Downloading entries")
    }

    return (
        <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    {/* <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                    </Popover> */}
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select onValueChange={setAccountType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asset">Asset</SelectItem>
                            <SelectItem value="liability">Liability</SelectItem>
                            <SelectItem value="equity">Equity</SelectItem>
                            <SelectItem value="revenue">Revenue</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                        type="text"
                        id="accountName"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="Enter account name"
                    />
                </div>
            </div>
            <div className="flex justify-between">
                <Button onClick={handleFilter}>
                    <Filter className="w-4 h-4 mr-2" />
                    Apply Filters
                </Button>
                <Button onClick={handleDownload} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Excel
                </Button>
            </div>
        </div>
    )
}

