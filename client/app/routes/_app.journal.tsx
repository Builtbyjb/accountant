import JournalTable from "~/components/journal/journalTable"
import FilterControls from "~/components/journal/filterControls"

export default function Journal() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Journal Entries</h1>
            <FilterControls />
            <div className="overflow-x-auto">
                <JournalTable />
            </div>
        </div>
    )
}

