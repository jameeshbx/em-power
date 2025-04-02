import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const timeLogs = await prisma.timeLog.findMany();
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
