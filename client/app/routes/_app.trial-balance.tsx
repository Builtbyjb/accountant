import { useLoaderData } from "@remix-run/react";
import { TrialBalanceTable } from "~/components/TrialBalanceTable";
import { TrialBalanceEntry } from "~/lib/constants";
import api from "~/lib/api";
import { Suspense, useEffect, useState } from "react";
import Loading from "~/components/Loading";

type LoaderResponse = Response & {
  data?: TrialBalanceEntry[];
  message?: string;
  error?: string;
  status?: number;
};

export async function loader(): Promise<LoaderResponse | undefined> {
  try {
    const response = await api.get("/api/trial-balance");
    if (response.status === 200) {
      const data = await response.data;
      return Response.json({
        data: data.data,
      });
    } else {
      return Response.json({
        error: "Request error",
      });
    }
  } catch (error) {
    // console.log(error);
    console.log("Internal server error");
    return Response.json({
      error: "Internal server error. We are resolving the issue",
    });
  }
}

export default function TrialBalance() {
  const [trialBalance, setTrialBalance] = useState<TrialBalanceEntry[] | null>(
    null
  );
  const loaderData = useLoaderData<typeof loader>();
  //   console.log(loaderData.data);

  useEffect(() => {
    if (loaderData.data) {
      setTrialBalance(loaderData.data);
    }
  }, [loaderData.data]);

  // if (trialBalance === null) {
  //   return <Loading />;
  // }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">True Ledger</h1>
      {trialBalance ? (
        <TrialBalanceTable trialBalance={trialBalance} />
      ) : (
        <>
          <p>No trial balance at this time</p>
        </>
      )}
    </div>
  );
}
