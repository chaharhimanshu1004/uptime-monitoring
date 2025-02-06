"use client"
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react'
import axios from 'axios'


export default function WebsiteDetailsPage() {
    const params = useParams();
    const { id } = params;
    // console.log('>>>id is here brother',id);
    const [websiteDetails, setWebsiteDetails] = useState<any>(null);

    if (!websiteDetails) return <div>Loading...</div>

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white p-6">
            <h1 className="text-2xl font-bold mb-4">{websiteDetails.url}</h1>
        </div>
    )
}