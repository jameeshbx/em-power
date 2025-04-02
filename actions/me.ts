"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getMe() {
  const session = await getServerSession(authOptions as any);
  const user = await prisma.user.findUnique({
    // @ts-expect-error
    where: { id: session?.user?.id },
    include: {
      employee: true,
    },
  });
  return user;
}
