import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const departments = await prisma.department.findMany({
    include: {
      employees: {
        include: {
          user: true,
        },
      },
      projects: true,
    },
  });
  return NextResponse.json(departments);
}

export async function POST(request: NextRequest) {
  const { name, employees, projects } = await request.json();
  const department = await prisma.department.create({
    data: {
      name,
      employees: {
        connect: employees?.map((id: string) => ({ id })) || [],
      },
      projects: {
        connect: projects?.map((id: string) => ({ id })) || [],
      },
    },
  });
}

export async function PUT(request: NextRequest) {
  const { id, name, employees, projects } = await request.json();
  const department = await prisma.department.update({
    where: { id },
    data: {
      name,
      employees: {
        connect: employees?.map((id: string) => ({ id })) || [],
      },
      projects: {
        connect: projects?.map((id: string) => ({ id })) || [],
      },
    },
    include: {
      employees: true,
      projects: true,
    },
  });
  return NextResponse.json(department);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  await prisma.$transaction(async (tx) => {
    // First update all projects to remove department reference
    // await tx.project.updateMany({
    //   where: { departmentId: id },
    //   data: { departmentId: null },
    // });

    // Remove employee connections (many-to-many relationship)
    await tx.department.update({
      where: { id },
      data: {
        employees: {
          set: [], // Clear all employee connections
        },
      },
    });

    // Finally delete the department
    await tx.department.delete({
      where: { id },
    });
  });

  return NextResponse.json({ success: true });
}
