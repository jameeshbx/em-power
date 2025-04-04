import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const employees = await prisma.user.findMany({
    include: {
      employee: true,
    },
    where: {
      role: {
        in: ["EMPLOYEE", "MANAGER"],
      },
    },
  });
  return NextResponse.json(employees);
}
