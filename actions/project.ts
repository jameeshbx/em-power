"use server";

import { prisma } from "@/lib/prisma";

export async function getProjectById(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      department: true,
      tasks: {
        include: {
          assignee: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      createdBy: true,
      assignedTo: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
        },
      },
      members: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
        },
      },
    },
  });
  return project;
}
