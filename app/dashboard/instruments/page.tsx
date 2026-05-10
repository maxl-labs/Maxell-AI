import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import InstrumentsClient from "./InstrumentsClient";

export default async function InstrumentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;
  const instruments = await prisma.instrument.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: { _count: { select: { practiceSessions: true } } },
  });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">Cadence</span>
          <nav className="flex gap-4 text-sm text-zinc-500">
            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Dashboard</Link>
            <Link href="/dashboard/instruments" className="text-zinc-900 dark:text-zinc-50 font-medium">Instruments</Link>
          </nav>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/sign-in" });
          }}
        >
          <button type="submit" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            Sign out
          </button>
        </form>
      </header>

      <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">Instruments</h1>
        <InstrumentsClient instruments={instruments.map((i) => ({ id: i.id, name: i.name, sessionCount: i._count.practiceSessions }))} />
      </main>
    </div>
  );
}
