"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { addProduct } from "../_actions/products";

export function ProductForm() {
  const [priceInCents, setPriceInCents] = useState<number>();

  return (
    <form action={addProduct} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" placeholder="Add product name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price in cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          placeholder="Add product price in cents. Example: $16.50 = 1650 cents"
          required
          value={priceInCents}
          onChange={e => setPriceInCents(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">{formatCurrency((priceInCents || 0) / 100)}</div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Add product description" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="Image">Image</Label>
        <Input type="file" id="Image" name="Image" required />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}