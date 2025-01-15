import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function getNewestProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase : true },
    orderBy: { createdAt: "desc"} ,
    take: 6,
  });
}

function getPopularProducts() {
  return db.product.findMany({
    where: { isAvailableForPurchase : true },
    orderBy: { orders: { _count: "desc" } },
    take: 6,
  });
}

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
      <ProductGridSection title="Popular" productsFetcher={getPopularProducts} />
    </main>
  );
}

type ProductsGridSectionProps = {
  title: string
  productsFetcher: () => Promise<Product[]>
}

async function ProductGridSection({ title, productsFetcher }: ProductsGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View all</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(await productsFetcher()).map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
      </div>
    </div>
  );
}
