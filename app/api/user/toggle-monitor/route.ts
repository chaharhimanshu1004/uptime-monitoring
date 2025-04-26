import { getServerSession } from "next-auth";
import { authoptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { User } from "next-auth";
import { pauseWebsiteMonitoring, resumeWebsiteMonitoring } from "@/lib/queue";

export async function POST(request: Request) {
    const session = await getServerSession(authoptions);
    const user: User = session?.user as User;
    
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "You need to be logged in to modify monitors"
        }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { websiteId, action } = body;
        
        if (!websiteId) {
            return Response.json({ 
                success: false, 
                message: "Website ID is required" 
            }, { status: 400 });
        }
        
        if (!action || (action !== "pause" && action !== "resume")) {
            return Response.json({ 
                success: false, 
                message: "Valid action (pause or resume) is required" 
            }, { status: 400 });
        }

        const dbUserId = parseInt(user.id as string);
        if (isNaN(dbUserId)) {
            return Response.json({ 
                success: false, 
                message: "Invalid user ID" 
            }, { status: 400 });
        }
        
        // Verify the website exists and belongs to this user
        const website = await prisma.website.findFirst({
            where: {
                id: Number(websiteId),
                userId: dbUserId
            }
        });
        
        if (!website) {
            return Response.json({ 
                success: false, 
                message: "Website not found or you don't have permission to modify it" 
            }, { status: 404 });
        }

        // updating isPaused based on action
        const updatedWebsite = await prisma.website.update({
            where: {
                id: Number(websiteId),
            },
            data: {
                isPaused: action === "pause",
                updatedAt: new Date()
            }
        });

        // if paused : remove from redis else add in redis 
        if (action === "pause") {
            const isPaused = await pauseWebsiteMonitoring(websiteId);
            if (!isPaused) {
                throw new Error("Failed to pause website monitoring from queue");
            }
        } else {
            const isResumed = await resumeWebsiteMonitoring(websiteId);
            if (!isResumed) {
                throw new Error("Failed to resume website monitoring from queue");
            }
        }

        return Response.json({ 
            success: true, 
            message: action === "pause" ? "Monitor paused successfully" : "Monitor resumed successfully",
            website: updatedWebsite
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error toggling monitor:", error);
        return Response.json({ 
            success: false, 
            message: error.message || "An error occurred while toggling the monitor" 
        }, { status: 500 });
    }
}