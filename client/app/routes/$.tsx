import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
// import AutoRedirect from '~/components/AutoRedirect'
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
// import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
// import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  // Access the wildcard segments through params["*"]
  return { path: params["*"] };
};
// export async function action({ request }: ActionFunctionArgs) {
//   const formData = await request.formData();
//   // Process form data here...
//   return redirect("/");
// }

export default function CatchAll() {
  const { path } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Redirects when countdown gets to zero
    if (countdown === 0) {
      navigate("/");
    }

    return () => clearInterval(timer);
  }, [navigate, countdown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-400 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button
          asChild
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105"
        >
          <Link to="/">Go to Homepage</Link>
        </Button>
        <p className="mt-4 text-sm text-gray-400">
          Redirecting to homepage in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
