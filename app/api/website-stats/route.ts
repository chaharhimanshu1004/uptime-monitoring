import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authoptions } from "../auth/[...nextauth]/options"


export async function GET(request: NextRequest) {
    const session = await getServerSession(authoptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    const searchParams = request.nextUrl.searchParams
    let websiteId : string | number | null = searchParams.get("websiteId")
    const period = searchParams.get("period") || "24h" ;

    websiteId = typeof websiteId === "string" ? parseInt(websiteId) : websiteId
  
    if (!websiteId) {
      return NextResponse.json({ error: "Website ID is required" }, { status: 400 })
    }
  
    const now = new Date()
    const startDate = new Date()
  
    switch (period) {
      case "24h":
        startDate.setHours(now.getHours() - 24)
        break
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      default:
        startDate.setHours(now.getHours() - 24)
    }
  
    const stats = await prisma.websiteStatus.findMany({
      where: {
        websiteId,
        timestamp: {
          gte: startDate,
          lte: now,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    })
  
    return NextResponse.json({ stats })
  }
  
  