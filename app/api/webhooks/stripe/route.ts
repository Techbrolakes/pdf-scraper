import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe-service';
import {
  handleSubscriptionPayment,
  handleSubscriptionCancellation,
  handleSubscriptionUpdate,
} from '@/lib/stripe-service';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    console.log(`Received webhook event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'invoice.paid':
      case 'invoice.payment_succeeded':
      case 'invoice_payment.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoiceData = invoice as any;
        
        // Only process subscription invoices
        if (invoiceData.subscription && invoiceData.customer) {
          const subscriptionId = typeof invoiceData.subscription === 'string' 
            ? invoiceData.subscription 
            : invoiceData.subscription.id;
            
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          const priceId = subscription.items.data[0]?.price.id;

          if (priceId) {
            const customerId = typeof invoiceData.customer === 'string'
              ? invoiceData.customer
              : invoiceData.customer.id;
              
            await handleSubscriptionPayment(
              customerId,
              subscription.id,
              priceId
            );
          } else {
            console.error('No price ID found in subscription');
          }
        } else {
          console.log('Invoice is not a subscription invoice, skipping');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.error(`Payment failed for invoice ${invoice.id}`);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        const customerId = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id;

        if (priceId && subscription.status === 'active') {
          await handleSubscriptionPayment(
            customerId,
            subscription.id,
            priceId
          );
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;

        if (priceId && subscription.status === 'active') {
          await handleSubscriptionUpdate(subscription.id, priceId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancellation(subscription.id);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout completed for session ${session.id}`);
        // The invoice.paid event will handle the actual credit addition
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhooks
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
