import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/auth";
import { AuthOptions, getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions as AuthOptions);
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
    user?.role === "MANAGER"
      ? {
          employee: {
            reportingToId: user.manager?.id,
          },
        }
      : {};

  const timeLogs = await prisma.timeLog.findMany({
    where: whereClause,
    include: {
      employee: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      task: {
        select: {
          title: true,
          id: true,
          status: true,
        },
      },
    },
  });

  return NextResponse.json(timeLogs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const timeLog = await prisma.timeLog.create({
    data: body,
    include: {
      task: true,
      employee: true,
    },
  });
  return NextResponse.json(timeLog);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const timeLog = await prisma.timeLog.update({
    where: { id: body.id },
    data: body,
    include: {
      task: true,
      employee: true,
    },
  });
  return NextResponse.json(timeLog);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const timeLog = await prisma.timeLog.delete({
    where: { id: body.id },
  });
  return NextResponse.json(timeLog);
}
