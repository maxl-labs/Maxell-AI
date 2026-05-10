import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeStreak, weeklyMinutes } from "@/lib/streak";
import { getUserSubscription, isSubscriptionActive } from "@/lib/subscription";
import LogSessionButton from "./LogSessionButton";
import SessionList from "./SessionList";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isPro = user?.isPro ?? false;

  const subscription = await getUserSubscription(userId);
  const isActive = isSubscriptionActive(subscription);

  const [instruments, practiceSessions] = await Promise.all([
    prisma.instrument.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.practiceSession.findMany({
      where: {
        userId,
        ...(isPro ? {} : { date: { gte: thirtyDaysAgo } }),
      },
      include: { instrument: true },
      orderBy: { date: "desc" },
    }),
  ]);

  const streak = computeStreak(practiceSessions.map((s) => s.date));
  const { thisWeek, lastWeek } = weeklyMinutes(practiceSessions);
  const recentSessions = practiceSessions.slice(0, 10);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">Cadence</span>
          <nav className="flex gap-4 text-sm text-zinc-500">
            <Link href="/dashboard" className="text-zinc-900 dark:text-zinc-50 font-medium">Dashboard</Link>
            <Link href="/dashboard/instruments" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Instruments</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isPro || isActive ? (
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-medium">Pro</span>
          ) : (
            <span className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">Free</span>
          )}
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
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {session.user?.name ?? session.user?.email}
            </p>
          </div>
          <LogSessionButton instruments={instruments} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Current Streak</p>
            <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{streak}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{streak === 1 ? "day" : "days"}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">This Week</p>
            <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{thisWeek}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">minutes</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Last Week</p>
            <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{lastWeek}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">minutes</p>
          </div>
        </div>

        {/* Recent sessions */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl mb-4">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Recent Sessions</h2>
            <span className="text-xs text-zinc-400">Last 10</span>
          </div>
          {recentSessions.length === 0 ? (
            <div className="px-5 py-12 text-center text-zinc-400 dark:text-zinc-500">
              No sessions yet. Hit &ldquo;Log Session&rdquo; to start tracking!
            </div>
          ) : (
            <SessionList sessions={recentSessions} />
          )}
        </div>

        {/* Pro gate notice for free users */}
        {!isPro && !isActive && (
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-xl px-5 py-3 text-sm text-indigo-700 dark:text-indigo-300">
            <span>History beyond 30 days requires</span>
            <span className="font-semibold">Pro ($8/mo)</span>
            <span>&mdash; billing coming soon</span>
          </div>
        )}
      </main>
    </div>
  );
}
