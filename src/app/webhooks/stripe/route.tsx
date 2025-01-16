import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = stripe.webhooks.constructEvent( // Creates an event where it compares the purchase stripe signature with our webhook secret
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object; // Creates a variable holding all the information of the purchase that comes from stripe

    // I get the desired information from the charge
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const priceInCents = charge.amount;

    // Check if the product exists
    const product = await db.product.findUnique({ where: { id: productId } });

    if (product == null || email == null) return new NextResponse("Bad request", { status: 400 });

    const userFields = {
      email,
      orders: { create: { productId, priceInCents } }
    };

    // Upsert updates existing user or creates a new one
    const { orders: [order] } = await db.customer.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
      }
    });

    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order confirmation",
      react: <h1>Thank you for your purchase!</h1>
    })

    return new NextResponse();
  }
}