import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ExpiredPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Download link expired</h1>
      <Button asChild size="lg" className="mt-6">
        <Link href="/orders">Go back to My orders</Link>
      </Button>
    </div>
  );
}