"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function startCheckout() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  let customerId = (
    await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true, email: true },
    })
  )?.stripeCustomerId ?? null;

  if (!customerId) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });
    const customer = await stripe.customers.create({
      email: user?.email ?? undefined,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    subscription_data: {
      metadata: { userId: session.user.id },
    },
  });

  redirect(checkoutSession.url!);
}

export async function openPortal() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) redirect("/dashboard");

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  redirect(portalSession.url);
}
