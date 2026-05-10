import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserSubscription, isSubscriptionActive } from "@/lib/subscription";
import Link from "next/link";

export default async function ProPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const subscription = await getUserSubscription(session.user.id);

  if (!isSubscriptionActive(subscription)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-zinc-900 dark:text-zinc-50">Maxwell Ai — Pro</span>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
        >
          Back to dashboard
        </Link>
      </header>

      <main className="flex-1 px-6 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Pro Features
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          You have an active subscription. Pro features will be available here.
        </p>
      </main>
    </div>
  );
}
