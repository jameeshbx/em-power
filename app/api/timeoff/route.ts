import { NextRequest, NextResponse } from "next/server";
import { createTimeOff } from "@/actions/timeOff";
import { emailService } from "@/actions/emailService";
import { AuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { timeOff, user } = await createTimeOff(body);
  if (timeOff) {
    await emailService.sendEmail({
      to: user.employee?.reportingTo?.user?.email || "",
      subject: "Time Off Request",
      html: `
        <p>Hi ${user.employee?.reportingTo?.user?.name},</p>
        <p>A time off request has been submitted by ${user?.name}.</p>
        <p>Start Date: ${timeOff.startDate}</p>
        <p>End Date: ${timeOff.endDate}</p>
        <p>Working Days: ${timeOff.workingDays}</p>
        <p>Reason: ${timeOff.reason}</p>
        <p>Please review the request and approve or reject it.</p>
        <p>Thank you.</p>
        <p>Best regards,</p>
        <p>The HR Team</p>
        `,
    });
  }
  return NextResponse.json(timeOff);
}

export async function GET() {
  const session = await getServerSession(authOptions as AuthOptions);
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    include: {
      employee: true,
    },
  });

  if (user?.role === "EMPLOYEE") {
    const timeOff = await prisma.leave.findMany({
      where: {
        employeeId: user?.employee?.id,
      },
    });
    return NextResponse.json(timeOff);
  } else {
    const timeOff = await prisma.leave.findMany({
      include: {
        employee: {
          include: {
            reportingTo: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(timeOff);
  }
}
