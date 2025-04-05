import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { emailService } from "@/actions/emailService";
export async function GET() {
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
  const whereClause =
    role === "MANAGER"
      ? {
          OR: [
            { employee: { reportingToId: user?.manager?.id } },
            { id: user?.id },
          ],
        }
      : {};
  const users = await prisma.user.findMany({
    where: whereClause,
    include: {
      employee: true,
      manager: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const isManager = body.role?.toLowerCase() === "manager";

  const user = await prisma.$transaction(async (tx) => {
    // Create the user
    const user = await tx.user.create({
      data: {
        name: body.name,
        email: body.email,
        isManager: isManager,
        role: body.role,
        password: await bcrypt.hash(body.password, 10),
      },
    });

    // Verify manager exists if reportingToId is provided
    if (body.reportingToId && body.reportingToId !== "none") {
      const manager = await tx.manager.findUnique({
        where: { id: body.reportingToId },
      });
      if (!manager) {
        throw new Error("Reporting manager not found");
      }
    }

    // Create employee record
    const employee = await tx.employee.create({
      data: {
        userId: user.id,
        designation: body.designation || "Employee",
        joiningDate: body.joiningDate || new Date(),
        availableLeaves: body.availableLeaves || 25,
        reportingToId:
          body.reportingToId === "none" ? null : body.reportingToId,
        managerId: body.managerId === "none" ? null : body.managerId,
      },
    });

    // Create manager record if applicable
    if (isManager) {
      await tx.manager.create({
        data: {
          userId: user.id,
          employeeId: employee.id,
        },
      });
    }

    return user;
  });

  if (user) {
    await emailService.sendEmail({
      to: user.email,
      subject: "Welcome to Em-Power",
      html: `<p>Hi ${user.name}, </p> 
      <p>Welcome to Em-Power, your one-stop solution for all your employee management needs.</p>
      <p>Your account has been created successfully. You can now login to the platform using the following email address:</p>
      <p>Email: ${user.email}</p>
      <p>Please reset your password from login page.</p>
      <p><b>Best Regards, </b> <br />BuyEx Team</b></p>
      `,
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
