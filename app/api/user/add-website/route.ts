
import { getServerSession } from "next-auth";
import { authoptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { User } from "next-auth";
import { registerWebsite } from "@/lib/queue";
export async function POST(request:Request){
    const session = await getServerSession(authoptions)
    const user : User = session?.user as User;
    
    if(!session || !session.user ){
        return Response.json({
            success: false,
            message: "You need to be logged in to add a website"
        })
    }

    try{
        const body = await request.json();
        const { url } = body;
        if(!url){
            return Response.json({ success: false, message: "URL is required" }, { status: 400 })
        }
        const dbUserId = parseInt(user.id as string);
        if (isNaN(dbUserId)) {
            return Response.json({ success: false, message: "Invalid user ID" }, { status: 400 });
        }
        const existingWebsite = await prisma.website.findFirst({
            where: {
                url: url,
                userId: dbUserId
            }
        });
        
        if (existingWebsite) {
            return Response.json({ 
                success: false, 
                message: "You are already monitoring this website",
                website: existingWebsite,
                code: "DUPLICATE_WEBSITE"
            }, { status: 409 });
        }
        const website = await prisma.website.create({
            data: {
                url,
                userId: dbUserId
            }
        });
        await registerWebsite(url, user.id as string,user.email as string, website.id); 
        return Response.json({ success: true , website:website }, { status: 200 });
    }catch(error : any){
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}



