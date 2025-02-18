import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Suspense, useEffect, useState } from "react";
import Loading from "~/components/Loading";
import { useLoaderData, useSearchParams, useFetcher } from "@remix-run/react";
import api from "~/lib/api";
import { AxiosError } from "axios";
import SelectAccountNames from "~/components/tAccounts/SelectAccountNames";
import DisplayTAccount from "~/components/tAccounts/DisplayTAccount";
import type { TAccountEntry } from "~/lib/constants";

export const meta: MetaFunction = () => {
  return [
    { title: "T-Accounts" },
    { name: "description", content: "General Ledger T-accounts" },
  ];
};

type Data = {
  message: string;
  accountEntries: TAccountEntry;
  names: string[];
};

type LoaderResponse = Response & {
  data?: Data;
  error?: string;
  success?: string;
  status?: number;
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<LoaderResponse | undefined> => {
  const url = new URL(request.url);
  const accountName = url.searchParams.get("name") || "";
  const accountRef = url.searchParams.get("ref") || "";

  try {
    const response = await api.get(
      `/api/t-accounts?name=${accountName}&ref=${accountRef}`
    );

    if (response.status === 200) {
      const data = await response.data;
      // console.log(data);
      return Response.json({ data: data });
    } else if (response.status === 204) {
      return Response.json({ success: "No account entries", status: 204 });
    } else {
      return Response.json({ error: "Request error" });
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
        status: err.status,
      });
    }
  }
};

export default function TAccounts() {
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  // console.log(loaderData.data);

  const [accountName, setAccountName] = useState<string | null>(null);

  const handleTAccount = (accountName: string) => {
    setAccountName(accountName);
  };

  useEffect(() => {
    if (accountName) {
      setSearchParams({ name: accountName });
    }
  }, [accountName]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">T-Accounts</h1>
      <p className="text-sm text-red-500 dark:text-red-400">
        {loaderData.data?.error}
      </p>
      <>
        {loaderData.data.names ? (
          <Suspense fallback={<Loading />}>
            <SelectAccountNames
              sendData={handleTAccount}
              accountName={loaderData.data.accountEntries.accountName}
              accountNames={loaderData.data.names}
            />
          </Suspense>
        ) : null}
      </>
      <>
        {loaderData.status === 204 ? (
          <div>
            <p>
              No Accounts available. Access T-Accounts by recording a
              transaction{" "}
            </p>
          </div>
        ) : null}
      </>
      {loaderData.data.accountEntries &&
      loaderData.data.accountEntries.accountName ? (
        <DisplayTAccount
          accountName={loaderData.data.accountEntries.accountName}
          accountRef={loaderData.data.accountEntries.accountRef}
          entries={loaderData.data.accountEntries}
        />
      ) : (
        <div className="mt-8">
          <p>Select an account to view the account details</p>
        </div>
      )}
    </div>
  );
}
