import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authoptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { z } from "zod";


const updateProfileSchema = z.object({
    name: z.string().optional(),
    timezone: z.string().optional(),
});

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authoptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const body = await request.json();
        const validateData = updateProfileSchema.parse(body);

        const updateData: Record<string, any> = {};

        if (validateData.name !== undefined) {
            updateData.name = validateData.name;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "No changes to apply" }, { status: 200 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                email: session.user.email
            },
            data: updateData,
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
            }
        }, { status: 200 });

    } catch (err) {
        if (err instanceof z.ZodError) {
            const errorMessages = err.errors.map((error) => error.message);
            return NextResponse.json({ error: errorMessages }, { status: 400 });
        }

        console.error("Error updating profile:", err);
        return NextResponse.json(
            { error: "Internal Server Error. Failed to update profile." },
            { status: 500 }
        );
    }
}