import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe-service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { priceId, planType } = body;

    if (!priceId || !planType) {
      return NextResponse.json(
        { error: "Missing required fields: priceId and planType" },
        { status: 400 }
      );
    }

    // Validate price ID
    const validPriceIds = [
      process.env.STRIPE_PRICE_BASIC,
      process.env.STRIPE_PRICE_PRO,
    ];

    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/billing?success=true&plan=${planType}`;
    const cancelUrl = `${baseUrl}/billing?canceled=true`;

    const checkoutSession = await createCheckoutSession(
      session.user.id,
      session.user.email,
      priceId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
