import { DisclaimerCard } from "@/components/DisclaimerCard";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { cache } from "@/lib/cache";
import { db } from "@/lib/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Get the 6 newly created products to rank them by most recent
const getNewestProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase : true },
      orderBy: { createdAt: "desc"} ,
      take: 8,
    });
  },
  ["/", "getNewestProducts"], // keyParts inside the string[] MUST be unique
  { revalidate: 60 * 60 * 24 } // 60 seconds * 60 minutes * 24 hours = 1 day... Cache will update every 1 day
);

// Get the 6 products with most orders to rank them by most popular
const getPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase : true },
      orderBy: { orders: { _count: "desc" } },
      take: 8,
    });
  },
  ["/", "getPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
      <DisclaimerCard
        content="All products on this website are fictitious, and the images were generated using AI."
      />
      <ProductGridSection title="Best sellers" productsFetcher={getPopularProducts} />
    </main>
  );
}

type ProductsGridSectionProps = {
  title: string
  productsFetcher: () => Promise<Product[]>
}

function ProductGridSection({ title, productsFetcher }: ProductsGridSectionProps) {
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

// Products suspense creates a promise using productsFetcher to map the products while the site is loading
async function ProductSuspense({ productsFetcher }: { productsFetcher: () => Promise<Product[]> }) {
  return (
    (await productsFetcher()).map(product => (
      <ProductCard key={product.id} {...product} />
    ))
  );
}