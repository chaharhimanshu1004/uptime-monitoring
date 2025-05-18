import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) {
      return NextResponse.json({
        success: false,
        message: "Please enter valid email and code",
      },
        {
          status: 400
        })
    }
    const user = await prisma.user.findUnique({
      where: {
          email
      }
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No user found with the corresponding email",
        },
        {
          status: 404,
        }
      );
    }
    const isCodeValid = user.verificationCode && user.verificationCode == code;
    if (!isCodeValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid code",
        },
        {
          status: 400,
        }
      );
      
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });

    
  } catch (error: any) {
    console.log("Error verifying code", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying code",
      },
      {
        status: 500,
      }
    );
  }
}
