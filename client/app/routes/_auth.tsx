import { Outlet } from "@remix-run/react";
import { AuthLayout } from "~/components/layouts/AuthLayout";

export default function AuthRoute() {
    return (
        <>
            <AuthLayout>
                <Outlet />
            </AuthLayout>
        </>
    );
}