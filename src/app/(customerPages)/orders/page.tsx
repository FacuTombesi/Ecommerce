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
        <DisclaimerCard
          content="For the delivery of purchase history via email, the Resend provider has been utilized. This service includes a free plan that permits only one (1) email per domain, making it impossible to send emails to multiple users. Since this is a practice project, I will not be upgrading to a higher-tier plan for a project that is purely experimental. If you would like to see an example of how the email would look, please visit the About section, where you will find screenshots showcasing examples. Thank you!"
        />
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