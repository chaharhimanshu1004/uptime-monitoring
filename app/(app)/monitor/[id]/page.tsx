"use client"
import WebsiteStats from "../website-stats";


export default function WebsiteDetailsPage({ params }: { params: { websiteId: number } }) {
    return (
        <div>
            <div className="container mx-auto py-8">
                <WebsiteStats websiteId={params.websiteId} />
            </div>
        </div>
    );
}