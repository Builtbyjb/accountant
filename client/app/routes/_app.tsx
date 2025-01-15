import { Outlet } from "@remix-run/react";
import { AppLayout } from "~/components/layouts/AppLayout";

export default function AppRoute() {
    return (
        <>
            <AppLayout>
                <Outlet />
            </AppLayout>
        </>
    );
}