import { useLoaderData } from "@remix-run/react";
import { TrialBalanceTable } from "~/components/TrialBalanceTable";
import { TrialBalanceEntry } from "~/lib/constants";
import api from "~/lib/api";

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
    console.log(error);
    console.log("Internal server error");
    return Response.json({
      error: "Internal server error. We are resolving the issue",
    });
  }
}

export default function TrialBalance() {
  const loaderData = useLoaderData<typeof loader>();
  //   console.log(loaderData.data);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">True Ledger</h1>
      <TrialBalanceTable trialBalance={loaderData.data} />
    </div>
  );
}
