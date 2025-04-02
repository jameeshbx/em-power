"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getMyTimelogs() {
  const session = await getServerSession(authOptions as any);

  const user = await prisma.user.findUnique({
    where: {
      // @ts-expect-error
      id: session?.user?.id,
    },
    include: {
      employee: true,
    },
  });

  if (!user) {
    return [];
  }

  const timeLogs = await prisma.timeLog.findMany({
    where: {
      employeeId: user.employee?.id,
    },
    include: {
      task: {
        select: {
          title: true,
        },
      },
      employee: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return timeLogs;
}
