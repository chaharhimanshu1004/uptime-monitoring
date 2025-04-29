import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authoptions } from "@/app/api/auth/[...nextauth]/options"
import { acknowledgeWebsite } from "@/lib/queue"

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authoptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const filter = searchParams.get('status') || 'all'

        let whereCondition = {}

        if (filter === 'resolved') {
            whereCondition = { isResolved: true }
        } else if (filter === 'unresolved') {
            whereCondition = { isResolved: false }
        }

        const incidents = await prisma.incident.findMany({
            where: whereCondition,
            include: {
                website: {
                    select: {
                        url: true,
                        isUp: true,
                        isPaused: true
                    }
                }
            },
            orderBy: {
                startTime: 'desc'
            }
        })
        
        return NextResponse.json({ incidents })
    } catch (error) {
        console.error("Error fetching incidents:", error)
        return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authoptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { incidentId, websiteId } = body

        if (!incidentId) {
            return NextResponse.json({ error: "Incident ID is required" }, { status: 400 })
        }

        const updatedIncident = await prisma.incident.update({
            where: {
                id: incidentId,
            },
            data: {
                isAcknowledged: true,
            },
        })

        await acknowledgeWebsite(websiteId)
        return NextResponse.json({ success: true, incident: updatedIncident })
    } catch (error) {
        console.error("Error acknowledging incident:", error)
        return NextResponse.json({ error: "Failed to acknowledge incident" }, { status: 500 })
    }
}
