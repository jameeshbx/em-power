import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        department: true,
        createdBy: true,
        assignedTo: true,
        members: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    // @ts-expect-error
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      departmentId,
      assignedToId,
      status,
      startDate,
      endDate,
      members,
    } = await request.json();

    if (!name || !departmentId) {
      return NextResponse.json(
        { error: "Name and department are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        departmentId,
        assignedToId,
        status,
        startDate,
        endDate,
        // @ts-expect-error
        createdById: session.user.id,
        members: {
          connect: members.map((id: string) => ({ id })),
        },
      },
      include: {
        department: true,
        createdBy: true,
        assignedTo: true,
        members: true,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const {
    id,
    name,
    departmentId,
    assignedToId,
    status,
    startDate,
    endDate,
    members,
  } = await request.json();
  const project = await prisma.project.update({
    where: { id },
    data: {
      name,
      departmentId,
      assignedToId,
      status,
      startDate,
      endDate,
      members: {
        set: members.map((id: string) => ({ id })),
      },
    },
    include: {
      department: true,
      createdBy: true,
      assignedTo: true,
      members: true,
    },
  });
  return NextResponse.json(project);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const project = await prisma.project.delete({
    where: { id },
  });
  return NextResponse.json(project);
}

export async function ADD_MEMBER(request: NextRequest) {
  const { projectId, employeeId } = await request.json();
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      members: {
        connect: { id: employeeId },
      },
    },
  });
  return NextResponse.json(project);
}

export async function GET_PROJECT_WITH_MEMBERS(request: NextRequest) {
  const { projectId } = await request.json();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: true,
    },
  });
  return NextResponse.json(project);
}
