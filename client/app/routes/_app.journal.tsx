import JournalTable from "~/components/journal/journalTable";
import type { MetaFunction } from "@remix-run/node";
import FilterControls from "~/components/journal/filterControls";
import { Suspense } from "react";
import Loading from "~/components/Loading";
import { UUIDTypes } from "uuid";
import { useLoaderData } from "@remix-run/react";
import api from "~/lib/api";
import { JournalEntry } from "~/lib/constants";

export const meta: MetaFunction = () => {
  return [
    { title: "Journal" },
    { name: "description", content: "Journal Entries" },
  ];
};

type LoaderResponse = Response & JournalEntry;

type LoaderError = {
  error: String;
};

export const loader = async (): Promise<LoaderResponse | LoaderError> => {
  try {
    const response = await api.get("/api/journal");
    const data = await response.data;
    if (response.status === 200) {
      return data.data;
    } else {
      return { error: "Request error" };
    }
  } catch (error) {
    console.log(error);
    return { error: "Internal server error, we are working on the issue" };
  }
};

export default function Journal() {
  const journalEntries = useLoaderData<typeof loader>();
  // console.log(journalEntries);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Journal Entries</h1>
      <FilterControls />
      <div className="overflow-x-auto">
        {journalEntries.error ? (
          <>
            <p className="text-sm text-red-500 dark:text-red-400">
              {journalEntries.error}
            </p>
          </>
        ) : (
          <>
            <Suspense fallback={<Loading />}>
              <JournalTable journalEntries={journalEntries} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
