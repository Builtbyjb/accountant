import JournalTable from "~/components/journal/journalTable";
import type { MetaFunction } from "@remix-run/node";
import FilterControls from "~/components/journal/filterControls";
import { Suspense } from "react";
import Loading from "~/components/Loading";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import api from "~/lib/api";
import { JournalEntry } from "~/lib/constants";
import { AxiosError } from "axios";

export const meta: MetaFunction = () => {
  return [
    { title: "Journal" },
    { name: "description", content: "Journal Entries" },
  ];
};

type LoaderResponse = Response & {
  data?: JournalEntry[];
  message?: string;
  error?: string;
  status?: number;
};

export const loader = async (): Promise<LoaderResponse | undefined> => {
  try {
    const response = await api.get("/api/journal");

    if (response.status === 200) {
      const data = await response.data;
      return Response.json({
        data: data.data,
      });
    } else if (response.status === 204) {
      return Response.json({
        message: "No journal entries found",
        status: 204,
      });
    } else {
      return Response.json({
        error: "Request error",
      });
    }
  } catch (error) {
    const err = error as AxiosError;

    if (err.status === 429) {
      console.log("Too many requests");
      return Response.json({
        error: "Too many requests, wait a few seconds before trying again",
      });
    } else {
      console.log("Internal server error");
      return Response.json({
        error: "Internal server error, we are working on the issue",
      });
    }
  }
};

export default function Journal() {
  const response = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  // console.log(response);

  const handleAccountRef = (accountRef: string) => {
    navigate(`/t-accounts?ref=${accountRef}`);
    // console.log(accountRef);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Journal Entries</h1>
      <FilterControls />
      <div className="overflow-x-auto">
        <p className="text-sm text-red-500 dark:text-red-400">
          {response?.error}
        </p>
        {response.data ? (
          <>
            <Suspense fallback={<Loading />}>
              <JournalTable
                handleAccountRef={handleAccountRef}
                journalEntries={response.data}
              />
            </Suspense>
          </>
        ) : null}
        {response.status === 204 ? (
          <div className="text-center mt-4">
            No journal entries at this time.{" "}
            <Link to="/" className="font-medium text-blue-400 hover:underline">
              Record a transaction
            </Link>{" "}
            to add journal entries
          </div>
        ) : null}
      </div>
    </div>
  );
}
