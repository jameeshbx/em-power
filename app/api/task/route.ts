import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/schemas/task";
import { TaskStatus } from "@prisma/client";

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      project: {
        include: {
          members: true,
        },
      },
      assignee: true,
    },
  });
  return NextResponse.json(tasks);
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
