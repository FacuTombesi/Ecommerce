"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useActionState, useState } from "react";
import { addProduct, updateProduct } from "../_actions/products";
import { useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useActionState(product == null ? addProduct : updateProduct.bind(null, product.id), {}); // Set the action to addProduct or instead to updateProduct if a product id is passed
  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents); // Set the state of priceInCents to a number or undefiined, depending if a product is passed or not

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" placeholder="Add product name" required defaultValue={product?.name || ""}></Input>
        {error.name && <div className="text-destructive">{error.name}</div>}
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
        ></Input>
        <div className="text-muted-foreground text-xs">{formatCurrency(Number(priceInCents || 0) / 100)}</div>
        {error.priceInCents && <div className="text-destructive">{error.priceInCents}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Add product description" required defaultValue={product?.description || ""}></Textarea>
        {error.description && <div className="text-destructive">{error.description}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null}></Input>
        {product != null && <div className="text-muted-foreground text-xs">{product.filePath}</div>}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null}></Input>
        {product != null && (
          <Image
            src={product.imagePath}
            height="300"
            width="300"
            alt="Product image"
          />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}