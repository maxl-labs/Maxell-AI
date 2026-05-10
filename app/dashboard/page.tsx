import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getUserSubscription, isSubscriptionActive } from "@/lib/subscription";
import { startCheckout, openPortal } from "./actions";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const subscription = await getUserSubscription(session.user!.id!);
  const isActive = isSubscriptionActive(subscription);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-zinc-900 dark:text-zinc-50">Maxwell Ai</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/sign-in" });
          }}
        >
          <button
            type="submit"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            Sign out
          </button>
        </form>
      </header>

      <main className="flex-1 px-6 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Welcome, {session.user?.name ?? session.user?.email}
        </p>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
            Subscription
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            {isActive
              ? `Active — renews ${subscription?.stripeCurrentPeriodEnd?.toLocaleDateString()}`
              : "No active subscription"}
          </p>

          {isActive ? (
            <div className="flex gap-3">
              <form action={openPortal}>
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Manage plan
                </button>
              </form>
              <Link
                href="/pro"
                className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-50 dark:text-zinc-900 hover:opacity-90 transition-opacity"
              >
                Go to Pro features
              </Link>
            </div>
          ) : (
            <form action={startCheckout}>
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-50 dark:text-zinc-900 hover:opacity-90 transition-opacity"
              >
                Upgrade to Pro
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
