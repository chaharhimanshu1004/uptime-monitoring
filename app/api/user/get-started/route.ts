import { NextResponse } from "next/server";
import { emailSchema } from "@/zodSchemas/signupSchema";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validateData = emailSchema.parse(body.email);
    const email = validateData;
    const user = await prisma.user.findUnique({where: { email: email }});

    if(!user){
      return NextResponse.redirect(new URL('/onboarding/sign-up', request.url));
    }
    if(!user.isVerified){
        return NextResponse.redirect(new URL('/onboarding/verify-email', request.url));
    }
    return NextResponse.redirect(new URL('/onboarding/sign-in', request.url));
    
   
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((error) => error.message);
      return NextResponse.json({ err: errorMessages }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error, Failed to get-started" },
      { status: 500 }
    );
  }
}
