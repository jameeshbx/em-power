"use server";

import { prisma } from "@/lib/prisma";

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      employee: {
        include: {
          departments: true,
          timeLogs: true,
          projects: true,
          reportingTo: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  id: true,
                  role: true,
                },
              },
            },
          },
        },
      },
      leaves: true,
    },
  });
  return user;
}
