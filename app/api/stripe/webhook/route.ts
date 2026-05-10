import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const userId = subscription.metadata?.userId ?? session.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0]?.price.id,
              stripeCurrentPeriodEnd: new Date(
                (subscription.items.data[0]?.current_period_end ?? 0) * 1000
              ),
              subscriptionStatus: subscription.status,
            },
          });
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(
              (subscription.items.data[0]?.current_period_end ?? 0) * 1000
            ),
            subscriptionStatus: subscription.status,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            subscriptionStatus: "canceled",
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
