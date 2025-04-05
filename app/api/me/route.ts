import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/auth";

export async function GET() {
  const session = await getServerSession(authOptions as AuthOptions);
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      employee: true,
    },
  });
  return NextResponse.json(user);
}
