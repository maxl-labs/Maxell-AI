import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const isPro = user?.isPro ?? false;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dateFilter: { gte?: Date; lte?: Date } = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) dateFilter.lte = new Date(to);

  // Free users: gate history beyond 30 days
  if (!isPro) {
    if (!dateFilter.gte || dateFilter.gte < thirtyDaysAgo) {
      dateFilter.gte = thirtyDaysAgo;
    }
  }

  const sessions = await prisma.practiceSession.findMany({
    where: {
      userId: session.user.id,
      ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
    },
    include: { instrument: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ sessions, isPro });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { instrumentId, date, durationMin, notes } = await req.json();
  if (!instrumentId || !date || !durationMin) {
    return NextResponse.json({ error: "instrumentId, date, and durationMin are required" }, { status: 400 });
  }

  const instrument = await prisma.instrument.findUnique({ where: { id: instrumentId } });
  if (!instrument || instrument.userId !== session.user.id) {
    return NextResponse.json({ error: "Instrument not found" }, { status: 404 });
  }

  const practiceSession = await prisma.practiceSession.create({
    data: {
      userId: session.user.id,
      instrumentId,
      date: new Date(date),
      durationMin: Number(durationMin),
      notes: notes?.trim() || null,
    },
    include: { instrument: true },
  });

  return NextResponse.json(practiceSession, { status: 201 });
}
