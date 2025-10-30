import Stripe from "stripe";
import { prisma } from "./prisma";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
  typescript: true,
});

export const PLAN_CREDITS = {
  BASIC: 10000,
  PRO: 20000,
};

export const CREDIT_COST_PER_RESUME = 100;

/**
 * Create or retrieve a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  // Update user with Stripe customer ID
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const customerId = await getOrCreateStripeCustomer(userId, email);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  });

  return session;
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Add credits to a user's account
 */
export async function addCredits(
  userId: string,
  credits: number
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        increment: credits,
      },
    },
  });
}

/**
 * Deduct credits from a user's account
 */
export async function deductCredits(
  userId: string,
  credits: number
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  if (!user || user.credits < credits) {
    return false;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        decrement: credits,
      },
    },
  });

  return true;
}

/**
 * Check if user has enough credits
 */
export async function hasEnoughCredits(
  userId: string,
  requiredCredits: number
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  return user ? user.credits >= requiredCredits : false;
}

/**
 * Get user's credit balance
 */
export async function getCreditBalance(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  return user?.credits || 0;
}

/**
 * Update user's subscription plan
 */
export async function updateUserPlan(
  userId: string,
  planType: "FREE" | "BASIC" | "PRO",
  subscriptionId?: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      planType,
      stripeSubscriptionId: subscriptionId || null,
    },
  });
}

/**
 * Handle successful subscription payment
 */
export async function handleSubscriptionPayment(
  customerId: string,
  subscriptionId: string,
  priceId: string
): Promise<void> {
  // Find user by Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    throw new Error(`User not found for customer ${customerId}`);
  }

  // Determine plan type and credits based on price ID
  let planType: "BASIC" | "PRO" = "BASIC";
  let credits = PLAN_CREDITS.BASIC;

  if (priceId === process.env.STRIPE_PRICE_PRO) {
    planType = "PRO";
    credits = PLAN_CREDITS.PRO;
  }

  // Update user's plan and add credits
  await prisma.user.update({
    where: { id: user.id },
    data: {
      planType,
      stripeSubscriptionId: subscriptionId,
      credits: {
        increment: credits,
      },
    },
  });
}

/**
 * Handle subscription cancellation
 */
export async function handleSubscriptionCancellation(
  subscriptionId: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!user) {
    throw new Error(`User not found for subscription ${subscriptionId}`);
  }

  // Downgrade to free plan but keep existing credits
  await prisma.user.update({
    where: { id: user.id },
    data: {
      planType: "FREE",
      stripeSubscriptionId: null,
    },
  });
}

/**
 * Handle subscription update
 */
export async function handleSubscriptionUpdate(
  subscriptionId: string,
  priceId: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!user) {
    throw new Error(`User not found for subscription ${subscriptionId}`);
  }

  // Determine new plan type
  let planType: "BASIC" | "PRO" = "BASIC";

  if (priceId === process.env.STRIPE_PRICE_PRO) {
    planType = "PRO";
  }

  // Update user's plan (don't add credits on update, only on payment)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      planType,
    },
  });
}
