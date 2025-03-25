import { NextResponse } from "next/server";
import { signupSchema } from "@/zodSchemas/signupSchema";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validateData = signupSchema.parse(body);
    const { name, email, password, phone } = validateData;
    const user = await prisma.user.findUnique({where: { email: email }});
    const userExistButNotVerified = await prisma.user.findUnique({where: { email: email, isVerified: false }});
    const userExistAndVerified = await prisma.user.findUnique({where: { email: email, isVerified: true }});
    if(user && user.isVerified){
      return NextResponse.json({ error: "User already exists with the email" }, { status: 400 });
    }

    if(userExistButNotVerified){
        return NextResponse.redirect(new URL('/onboarding/verify-email', request.url),{ status: 302 });
    }

    if(userExistAndVerified){
        return NextResponse.redirect(new URL('/onboarding/sign-in', request.url),{ status: 302 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        isVerified: false,
        verificationCode,
      },
    });

    // send verification email

    const emailResponse = await sendVerificationEmail(
      email,
      name,
      verificationCode
    );

    if(!emailResponse.success){
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    return NextResponse.json({ message: "User created successfully and message email is also sent" }, { status: 200 });

  } catch (err) {

    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((error) => error.message);
      return NextResponse.json({ err: errorMessages }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error, Failed to sign-up" },
      { status: 500 }
    );
  }
}
