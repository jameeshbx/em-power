import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { emailService } from "@/actions/emailService";

interface TimeOff {
  employeeId: string;
  startDate: Date;
  endDate: Date;
  workingDays: number;
  reason: string;
}

export const createTimeOff = async (body: Partial<TimeOff>) => {
  const session = await getServerSession(authOptions as AuthOptions);

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
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

  if (!user) {
    throw new Error("User not found");
  }

  const data = {
    employeeId: user.employee?.id,
    startDate: body.startDate,
    endDate: body.endDate,
    workingDays: body.workingDays,
    reason: body.reason,
  };

  if (
    !data.employeeId ||
    !data.startDate ||
    !data.endDate ||
    !data.workingDays ||
    !data.reason
  ) {
    throw new Error("Missing required fields");
  }

  const timeOff = await prisma.leave.create({
    data: {
      employeeId: data.employeeId,
      startDate: data.startDate,
      endDate: data.endDate,
      workingDays: data.workingDays,
      reason: data.reason,
    },
  });

  return { timeOff, user };
};
