import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams
}: {
  searchParams: { payment_intent: string }
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent);

  if (paymentIntent.metadata.productId == null) return notFound();

  const product = await db.product.findUnique({ where: { id: paymentIntent.metadata.productId } });

  if (product == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div>
      <h1 className="text-4xl font-bold">{isSuccess ? "Payment complete!" : "Error processing payment"}</h1>
      <div className="grid grid-cols-1 max-w-5xl w-full mx-auto space-y-8 mt-12">
        <div className="flex flex-row gap-4 items-center justify-center">
          <div className="aspect-video flex-shrink-0 w-1/2 relative">
            <Image src={product.imagePath} fill alt={product.name} className="object-cover" />
          </div>
          <div>
            <div className="text-lg">
              {formatCurrency(product.priceInCents / 100)}
            </div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="text-sm line-clamp-3 text-muted-foreground">{product.description}</div>
            <Button className="mt-4" size="lg" asChild>
              {isSuccess
                ? <a href={`/products/download/${await createDownloadVerification(product.id)}`}>Download</a>
                : <Link href={`/products/${product.id}/purchase`}>Try again</Link>
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // Creates a new expiration date which is 1 day from the moment the downloadVerification for that productId was created... 1000 * 60 * 60 * 24 = number of milliseconds in one day
      }
    })
  ).id;
}