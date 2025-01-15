import NavTopbar from "~/components/NavTopbar";

export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavTopbar />
            <div className="flex h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </>
    );
}