import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authoptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authoptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    
    await prisma.user.delete({
      where: { 
        email: session.user.email 
      },
    });
    
    return NextResponse.json({ 
      message: "Account deleted successfully" 
    }, { status: 200 });

  } catch (err) {
    console.error("Error deleting account:", err);
    return NextResponse.json(
      { error: "Internal Server Error. Failed to delete account." },
      { status: 500 }
    );
  }
}