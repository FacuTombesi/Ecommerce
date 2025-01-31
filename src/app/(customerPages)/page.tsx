import { DisclaimerCard } from "@/components/DisclaimerCard";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cache } from "@/lib/cache";
import { db } from "@/lib/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// Get the 6 newly created products to rank them by most recent
const getNewestProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase : true },
      orderBy: { createdAt: "desc"} ,
      take: 4,
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

const getAllProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase : true },
      orderBy: { name: "asc" },
      take: 12,
    });
  },
  ["/", "getAllProducts"],
  { revalidate: 60 * 60 * 24 }
);

export default function HomePage() {
  return (
    <main className="space-y-16">
      <ProductCarouselSection productsFetcher={getNewestProducts} />
      <DisclaimerCard
        content="All products and sponsors logos on this website are fictitious and the images were generated using AI."
      />
      <ProductGridSection title="Best sellers" productsFetcher={getPopularProducts} />
      <div className="flex justify-between px-20 py-8">
        <div className="relative w-32 h-32 aspect-square">
          <Image src="/assets/img/Fake_logo_1.png" fill alt="Fake logo 1" />
        </div>
        <div className="relative w-32 h-32 aspect-square">
          <Image src="/assets/img/Fake_logo_2.png" fill alt="Fake logo 2" />
        </div>
        <div className="relative w-32 h-32 aspect-square">
          <Image src="/assets/img/Fake_logo_3.png" fill alt="Fake logo 3" />
        </div>
        <div className="relative w-32 h-32 aspect-square">
          <Image src="/assets/img/Fake_logo_4.png" fill alt="Fake logo 4" />
        </div>
        <div className="relative w-32 h-32 aspect-square">
          <Image src="/assets/img/Fake_logo_5.png" fill alt="Fake logo 5" />
        </div>
      </div>
      <ProductGridSection title="All games" productsFetcher={getAllProducts} />
    </main>
  );
}

type ProductsCarouselSectionProps = {
  productsFetcher: () => Promise<Product[]>
}

type ProductsGridSectionProps = {
  title: string
  productsFetcher: () => Promise<Product[]>
}

async function ProductCarouselSection({ productsFetcher }: ProductsCarouselSectionProps) {
  return (
    <Carousel
      className="w-full h-[700px]"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {(await productsFetcher()).map(product => (
          <CarouselItem key={product.id} className="relative flex flex-col items-center justify-center h-[700px]">
            <div className="relative w-full h-full">
              <Image src={product.imagePath} fill className="object-cover" alt={product.name} />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white p-4">
                <div className="text-center text-2xl font-bold">{product.name}</div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="border-none bg-purple-100 hover:bg-purple-50 h-full rounded-lg" />
      <CarouselNext className="border-none bg-purple-100 hover:bg-purple-50 h-full rounded-lg" />
    </Carousel>
  );
}

function ProductGridSection({ title, productsFetcher }: ProductsGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center border-y-2 border-purple-600 py-2 mb-8">
        <h2 className="text-2xl uppercase font-semibold">{title}</h2>
      </div>
      <div className={`grid grid-cols-2 md:grid-cols-4 ${(title === "All games") ? 'lg:grid-cols-6' : 'lg:grid-cols-4'} gap-6`}>
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
      {(title === "All games") && (
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View all</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      )}
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