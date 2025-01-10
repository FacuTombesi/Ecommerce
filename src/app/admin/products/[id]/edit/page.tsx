import { Header } from "@/app/admin/_components/Header";
import { ProductForm } from "@/app/admin/_components/ProductForm";
import { db } from "@/lib/db";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  return (
    <div>
      <Header>Edit product</Header>
      <ProductForm product={product} />
    </div>
  );
}