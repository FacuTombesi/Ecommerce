import { Body, Container, Head, Heading, Html, Preview, Tailwind } from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";

type PurchaseReceiptProps = {
  order: {
    id: string,
    priceInCents: number,
    createdAt: Date
  }
  product: {
    name: string,
    imagePath: string
    description: string
  }
  downloadVerificationId: string
}

PurchaseReceipt.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    priceInCents: 10000,
    createdAt: new Date()
  },
  product: {
    name: "Product name",
    imagePath: "/public/products/273efa84-5e1d-4316-a455-60d3a807bd7e-Foto-perfil_1.png",
    description: "Product description"
  },
  downloadVerificationId: crypto.randomUUID()
} satisfies PurchaseReceiptProps

export default function PurchaseReceipt({ order, product, downloadVerificationId }: PurchaseReceiptProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase receipt</Heading>
            <OrderInformation order={order} product={product} downloadVerificationId={downloadVerificationId} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}