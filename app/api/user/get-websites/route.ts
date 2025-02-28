import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request:Request){
    try{
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        
        if(!userId){
            return {
                success: false,
                message: "User ID is required"
            }
        }
        const dbUserId = parseInt(userId as string);

        if (isNaN(dbUserId)) {
            return {
                success: false,
                message: "Invalid user ID"
            }
        }
        const websites = await prisma.website.findMany({
            where: {
                userId: dbUserId
            }
        });
        return NextResponse.json({ success: true, websites });

    }catch(err:any){
        console.log('Error in get-websites', err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: 500 }
          );
      

    }
    
}