import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/schemas/task";
import { TaskStatus } from "@prisma/client";
import { AuthOptions } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

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
    const employeeId = role === "MANAGER" ? user?.employee?.id : null;
    const whereClause =
      role === "MANAGER"
        ? {
            project: {
              assignedToId: employeeId,
            },
          }
        : {};
    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            name: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        assignee: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching tasks", errorMessage: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, status, projectId, assigneeId } =
    taskSchema.parse(body);

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status as TaskStatus,
      projectId,
      assigneeId,
    },
  });

  return NextResponse.json(task);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, title, description, status, projectId, assigneeId } =
    taskSchema.parse(body);

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      status: status as TaskStatus,
      projectId,
      assigneeId,
    },
  });

  return NextResponse.json(task);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  const task = await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json(task);
}
