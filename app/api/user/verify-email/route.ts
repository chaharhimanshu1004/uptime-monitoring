import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    const user = await prisma.user.findUnique({
      where: {
          email
      }
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No user found with the corresponding email",
        },
        {
          status: 404,
        }
      );
    }
    const isCodeValid = user.verificationCode === code;
    if (!isCodeValid) {
      return Response.json(
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

    return Response.json({
      success: true,
      message: "Email verified successfully",
    });

    
  } catch (error: any) {
    console.log("Error verifying code", error);
    return Response.json(
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
