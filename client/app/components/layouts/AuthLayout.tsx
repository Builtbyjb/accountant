import NavTopbar from "~/components/navbar/NavTopbar";

export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavTopbar />
            <div className="flex h-screen">
                <main className="flex-1  p-8">
                    {children}
                </main>
            </div>
        </>
    );
}