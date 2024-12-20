import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar"


import "./tailwind.css";
import { NavSidebar } from "./components/NavSidebar";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground">
        <div className="flex h-screen overflow-hidden">
          <SidebarProvider aria-describedby="sidebar">
            <NavSidebar />
            <SidebarInset>
              <SidebarTrigger className="m-4" />
              <main className="flex-1 overflow-y-auto p-8">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html >
  );
}

export default function App() {
  return <Outlet />;
}
