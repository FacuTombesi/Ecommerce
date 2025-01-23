"use client"

import { emailOrderHistory } from "@/actions/orders";
import { DisclaimerCard } from "@/components/DisclaimerCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function OrdersPage() {
  const [data, action] = useActionState(emailOrderHistory, {});

  return (
    <form action={action} className="max-2-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My orders</CardTitle>
          <CardDescription>Enter your email to receive your purchase history and download links.</CardDescription>
        </CardHeader>
        <DisclaimerCard content="Disclaimer card content" />
        <CardContent>
          <div className="space-y-2 mx-6">
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" id="email" placeholder="johndoe@email.com" required />
            {data.error && <div className="text-destructive">{data.error}</div>}
          </div>
        </CardContent>
        <CardFooter>
          {data.message ? <p className="text-muted-foreground">{data.message}</p> : <SubmitButton />}
        </CardFooter>
      </Card>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="mt-6 w-full size-lg" disabled={pending}>{pending ? "Sending..." : "Send"}</Button>
  );
}