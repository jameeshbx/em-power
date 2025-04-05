import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";
import { AuthOptions } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
    const role = session?.user?.role;
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      include: {
        employee: true,
        manager: true,
      },
    });
    const whereClause =
      role === "MANAGER"
        ? {
            OR: [
              { employee: { reportingToId: user?.manager?.id } },
              { id: user?.id },
            ],
            role: { in: [UserRole.EMPLOYEE, UserRole.MANAGER] },
          }
        : { role: { in: [UserRole.EMPLOYEE, UserRole.MANAGER] } };

    const employees = await prisma.user.findMany({
      include: {
        employee: true,
      },
      where: whereClause,
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching employees", errorMessage: error },
      { status: 500 }
    );
  }
}
