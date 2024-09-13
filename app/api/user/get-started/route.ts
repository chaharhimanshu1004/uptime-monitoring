import { NextResponse } from "next/server";
import { emailSchema } from "@/zodSchemas/signupSchema";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const validateData = emailSchema.parse(body.email);
    const email = validateData;

    const user = await prisma.user.findUnique({where: {email: email}});

    if(!user){
        return NextResponse.redirect('/onboarding/signup', { status: 302 });
    }

    if(!user.isVerified){
        return NextResponse.redirect('/onboarding/verify-email', { status: 302 });
    }

    return NextResponse.redirect('/onboarding/login', { status: 302 });
    
   
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((error) => error.message);
      return NextResponse.json({ err: errorMessages }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
