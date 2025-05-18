import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authoptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function GET(request:Request){
    try{
        const session = await getServerSession(authoptions);
        const user: User = session?.user as User;

        if (!session || !session.user) {
            return NextResponse.json({
                success: false,
                message: "You need to be logged in to view websites"
            }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        
        if(!userId){
            return NextResponse.json({
                success: false,
                message: "User ID is required"
            }, { status: 400 });
        }
        const dbUserId = parseInt(userId as string);

        if (isNaN(dbUserId)) {
            return NextResponse.json({
                success: false,
                message: "Invalid user ID"
            }, { status: 400 });
        }

        // user can only request their own data
        if (dbUserId !== parseInt(user.id as string)) {
            return NextResponse.json({
                success: false,
                message: "You can only view your own websites"
            }, { status: 403 });
        }

        const websites = await prisma.website.findMany({
            where: {
                userId: dbUserId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        return NextResponse.json({ success: true, websites });

    } catch (err: any) {
        console.log('Error in get-websites', err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
    
}