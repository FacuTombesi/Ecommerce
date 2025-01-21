"use server"

import OrderHistoryEmail from "@/email/OrderHistory";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { z } from "zod"

const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function emailOrderHistory(prevState: unknown, formData: FormData): Promise<{ message?: string, error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"));

  if (result.success === false) return { error: "Invalid email address."};

  const customer = await db.customer.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          id: true,
          priceInCents: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              imagePath: true
            }
          }
        }
      }
    }
  });

  // Basic security precaution. Real security would require user auth but since this is a practice project with no real products, this is good enough
  if (customer == null) return { message: "Check your email to view your purchase history and download your products." };

  const orders = customer.orders.map(async order => {
    return {
      ...order,
      downloadVerificationId: (
        await db.downloadVerification.create({
          data: {
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            productId: order.product.id
          }
        })
      ).id
    };
  })

  const data = await resend.emails.send({
    from: `Suppor <${process.env.SENDER_EMAIL}>`,
    to: customer.email,
    subject: "Order history",
    react: <OrderHistoryEmail orders={await Promise.all(orders)} />
  });

  if (data.error) return { error: "Unexpected error occurred. Please try again." };

  return { message: "Check your email to view your purchase history and download your products." };
}