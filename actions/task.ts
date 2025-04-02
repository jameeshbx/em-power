"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function getMyTasks() {
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

  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: user?.employee?.id,
    },
    select: {
      id: true,
      title: true,
    },
  });

  return tasks;
}
