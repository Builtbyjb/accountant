import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }) => {
    // Access the wildcard segments through params["*"]
    return { path: params["*"] };
};

export default function CatchAll() {
    const { path } = useLoaderData<typeof loader>();
    return (
        <div>
            <h1>Catch-all Route</h1>
            <p>Matched path: {path}</p>
        </div>
    );
}