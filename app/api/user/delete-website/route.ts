import { getServerSession } from "next-auth"
import { authoptions } from "../../auth/[...nextauth]/options"
import prisma from "@/lib/prisma"
import type { User } from "next-auth"
import { unregisterWebsite } from "@/lib/queue"
export async function DELETE(request: Request) {
    const session = await getServerSession(authoptions)
    const user: User = session?.user as User

    if (!session || !user) {
        return Response.json(
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
            return Response.json({ success: false, message: "Website ID is required" }, { status: 400 })
        }

        const websiteId = Number.parseInt(websiteIdStr)

        const dbUserId = Number.parseInt(user.id as string)
        if (isNaN(dbUserId)) {
            return Response.json({ success: false, message: "Invalid user ID" }, { status: 400 })
        }

        const website = await prisma.website.findFirst({
            where: {
                id: websiteId,
                userId: dbUserId,
            },
        })

        if (!website) {
            return Response.json(
                { success: false, message: "Website not found or you don't have permission to delete it" },
                { status: 404 },
            )
        }

        await unregisterWebsite(websiteId); 

        await prisma.website.delete({
            where: {
                id: websiteId,
            },
        })

        return Response.json(
            {
                success: true,
                message: "Website deleted successfully and monitoring stopped",
            },
            { status: 200 },
        )
    } catch (error: any) {
        console.error("Error deleting website:", error)
        return Response.json({ success: false, message: error.message }, { status: 500 })
    }
}



