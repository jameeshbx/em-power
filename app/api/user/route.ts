import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      employee: true,
      manager: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Check if the role is manager and set isManager flag
  const isManager = body.role?.toLowerCase() === "manager";

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      isManager: isManager,
      role: body.role,
      password: await bcrypt.hash(body.password, 10),
    },
  });

  // First verify the manager exists if reportingToId is provided
  if (body.reportingToId && body.reportingToId !== "none") {
    const manager = await prisma.manager.findUnique({
      where: { id: body.reportingToId },
    });
    if (!manager) {
      throw new Error("Reporting manager not found");
    }
  }

  const employee = await prisma.employee.create({
    data: {
      userId: user.id,
      designation: body.designation || "Employee",
      joiningDate: body.joiningDate || new Date(),
      availableLeaves: body.availableLeaves || 25,
      reportingToId: body.reportingToId === "none" ? null : body.reportingToId,
      managerId: body.managerId === "none" ? null : body.managerId,
    },
  });

  if (isManager) {
    await prisma.manager.create({
      data: {
        userId: user.id,
        employeeId: employee.id,
      },
    });
  }
  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const user = await prisma.user.update({
    where: { id: body.id },
    data: {
      name: body.name,
      email: body.email,
      role: body.role,
      password: await bcrypt.hash(body.password, 10),
    },
  });
  if (body.employeeId) {
    await prisma.employee.update({
      where: { id: body.employeeId },
      data: {
        userId: user.id,
        designation: body.designation,
        joiningDate: body.joiningDate,
        availableLeaves: body.availableLeaves,
        reportingToId: body.reportingToId,
      },
    });
  }
  if (body.managerId) {
    await prisma.manager.update({
      where: { id: body.managerId },
      data: { employeeId: body.employeeId },
    });
  }
  return NextResponse.json(user);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  // Delete in the correct order to handle foreign key constraints
  await prisma.$transaction(async (tx) => {
    // First delete related leaves
    await tx.leave.deleteMany({
      where: { approvedById: body.id },
    });

    // Delete related projects
    await tx.project.deleteMany({
      where: { createdById: body.id },
    });

    // Delete employee record if exists
    await tx.employee.deleteMany({
      where: { userId: body.id },
    });

    // Delete manager record if exists
    await tx.manager.deleteMany({
      where: { userId: body.id },
    });

    // Finally delete the user
    await tx.user.delete({
      where: { id: body.id },
    });
  });
  return NextResponse.json(body);
}
