import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/app/hooks/sendTestAlert";

export async function POST(req: Request) {
    const body = await req.json();
    const { websiteUrl, userEmail } = body;

    try {
        await sendNotificationEmail(websiteUrl, userEmail);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
