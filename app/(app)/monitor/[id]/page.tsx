"use client"
import WebsiteStats from "../website-stats";
import { useParams } from "next/navigation";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";


export default function WebsiteDetailsPage() {
    const params = useParams();
    let websiteId: string = params.id as string;
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <WebsiteStats websiteId={websiteId} />
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}