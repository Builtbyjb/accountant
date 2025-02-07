import { NavSidebar } from "~/components/navbar/NavSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
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
    );
}