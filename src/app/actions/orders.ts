"use server"

import { db } from "@/lib/db"

export async function userOrderExists(email: string, productId: string) {
  // Returns a boolean true if the customer already bought the product or false if it is a new purchase
  return (
    (await db.order.findFirst({
      where: {
        customer: { email },
        productId
      },
      select: { id: true } // Selects ONLY the ID and prevents overflowing with useless information
    })) != null
  );
}