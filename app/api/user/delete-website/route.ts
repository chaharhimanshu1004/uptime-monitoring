import { getServerSession } from "next-auth"
import { authoptions } from "../../auth/[...nextauth]/options"
import prisma from "@/lib/prisma"
import type { User } from "next-auth"
import { unregisterWebsite } from "@/lib/queue"
import { NextResponse } from "next/server"
export async function DELETE(request: Request) {
    const session = await getServerSession(authoptions)
    const user: User = session?.user as User

    if (!session || !user) {
        return NextResponse.json(
            {
                success: false,
                message: "You need to be logged in to delete a website",
            },
            { status: 401 },
        )
    }

    try {
        const { searchParams } = new URL(request.url)
        const websiteIdStr = searchParams.get("websiteId")

        if (!websiteIdStr) {
            return NextResponse.json({ success: false, message: "Website ID is required" }, { status: 400 })
        }

        const websiteId = Number.parseInt(websiteIdStr)

        const dbUserId = Number.parseInt(user.id as string)
        if (isNaN(dbUserId)) {
            return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 })
        }

        const website = await prisma.website.findFirst({
            where: {
                id: websiteId,
                userId: dbUserId,
            },
        })

        if (!website) {
            return NextResponse.json(
                { success: false, message: "Website not found or you don't have permission to delete it" },
                { status: 404 },
            )
        }

        const response = await unregisterWebsite(websiteId); 

        if (!response) {
            throw new Error("Failed to unregister website from monitoring queue");
        }

        await prisma.website.delete({
            where: {
                id: websiteId,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: "Website deleted successfully and monitoring stopped",
            },
            { status: 200 },
        )
    } catch (error: any) {
        console.error("Error deleting website:", error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}



