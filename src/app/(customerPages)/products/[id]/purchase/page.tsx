import { PurchaseForm } from "@/components/PurchaseForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id } // IMPORTANT!! Links our product with a customer
  });

  if (paymentIntent.client_secret == null) throw Error("Stripe failed to create payment intent.");

  return (
    <div>
      <PurchaseForm product={product} clientSecret={paymentIntent.client_secret} />
    </div>
  );
}