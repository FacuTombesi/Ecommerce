"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";

export default function OrdersPage() {
  return (
    <form className="max-2-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My orders</CardTitle>
          <CardDescription>Enter your email to receive your purchase history and download links.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mx-6">
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" id="email" placeholder="johndoe@email.com" required />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
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