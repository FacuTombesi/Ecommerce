import { Body, Container, Head, Heading, Hr, Html, Preview, Tailwind } from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";
import React from "react";

type OrderHistoryEmailProps = {
  orders: {
    id: string,
    priceInCents: number,
    createdAt: Date,
    downloadVerificationId: string,
    product: {
      name: string,
      imagePath: string,
      description: string
    }
  }[]
}

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      priceInCents: 10000,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product name 1",
        imagePath: "/products/273efa84-5e1d-4316-a455-60d3a807bd7e-Foto-perfil_1.png",
        description: "Product description 1"
      }
    },
    {
      id: crypto.randomUUID(),
      priceInCents: 20000,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product name 2",
        imagePath: "/products/b26dd08b-1c2a-46ae-9427-64fee966f2f7-foto cv 5.png",
        description: "Product description 2"
      }
    },
    {
      id: crypto.randomUUID(),
      priceInCents: 30000,
      createdAt: new Date(),
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product name 3",
        imagePath: "/products/b85d6e5e-bbe1-4608-9646-2ad84ffa54fd-Foto-perfil_2.png",
        description: "Product description 3"
      }
    },
  ]
} satisfies OrderHistoryEmailProps

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order history</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order history</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}