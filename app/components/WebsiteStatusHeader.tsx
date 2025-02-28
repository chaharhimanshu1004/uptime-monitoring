import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function WebsiteStatusHeader() {
    const { data: session } = useSession();

    return (
        <header className="bg-[rgb(15,16,18)] text-white flex justify-between items-center p-4 shadow-md">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Monitor</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    );
}