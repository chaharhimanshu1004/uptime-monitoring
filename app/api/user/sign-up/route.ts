import { NextResponse } from "next/server";
import { signupSchema } from "@/zodSchemas/signupSchema";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validateData = signupSchema.parse(body);
    const { name, email, password, phone } = validateData;

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
