"use client"

import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "./ui/button";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { userOrderExists } from "@/app/actions/orders";
import { DisclaimerCard } from "./DisclaimerCard";

type PurchaseFormProps = {
  product: {
    id: string
    name: string
    priceInCents: number
    description: string
    imagePath: string
  },
  clientSecret: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

export function PurchaseForm({ product, clientSecret }: PurchaseFormProps) {
  return (
    <div className="max-w-5xl w-full mx-auto">
      <DisclaimerCard
        content="This version of Stripe is a test environment intended for developers. The required fields can be filled with fictitious data, and the transaction will still be processed as successful—or failed if the email used has already been associated with the purchase of a specific product. Keep in mind that the first digits of the credit card number must correspond to a financial services provider. For example, for a VISA credit card, you may use a number starting with 4242."
      />
      <div className="grid grid-cols-2 space-y-8">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="aspect-video flex-shrink-0 w-1/2 relative">
            <Image src={product.imagePath} fill alt={product.name} className="object-cover" />
          </div>
          <div>
            <div className="text-lg">
              {formatCurrency(product.priceInCents / 100)}
            </div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="text-sm line-clamp-3 text-muted-foreground">{product.description}</div>
          </div>
        </div>
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <StripeForm priceInCents={product.priceInCents} productId={product.id} />
        </Elements>
      </div>
    </div>
  );
}

function StripeForm({ priceInCents, productId }: { priceInCents: number, productId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true)

    // Check for existing order
    const orderExists = await userOrderExists(email, productId);

    if (orderExists) {
      setErrorMessage("This product is already in your MY ORDERS page. Try downloading it first.")
      setIsLoading(false)
      return;
    }

    stripe
      .confirmPayment({
        elements, // Takes all the values from the form inputs
        confirmParams: { return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/success` } // Redirects the user to the success page
      })
      // If there is an error, sets the error message
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message)
        } else {
          setErrorMessage("Unknown error occurred.")
        }
      })
      .finally(() => setIsLoading(false))
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && <CardDescription className="text-destructive text-sm">{errorMessage}</CardDescription>}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-6">
            <LinkAuthenticationElement onChange={e => setEmail(e.value.email)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full mt-12" size="lg" disabled={stripe == null || elements == null}>
            {isLoading ? "Processing..." : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}