import { prisma } from "@/lib/prisma";

export async function getUserSubscription(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripeSubscriptionId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
      subscriptionStatus: true,
    },
  });
}

export function isSubscriptionActive(subscription: {
  subscriptionStatus: string | null;
  stripeCurrentPeriodEnd: Date | null;
} | null): boolean {
  if (!subscription) return false;
  const { subscriptionStatus, stripeCurrentPeriodEnd } = subscription;
  if (subscriptionStatus !== "active" && subscriptionStatus !== "trialing") {
    return false;
  }
  if (!stripeCurrentPeriodEnd) return false;
  return stripeCurrentPeriodEnd > new Date();
}
