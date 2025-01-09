import { Button } from "@/components/ui/button";
import { Header } from "../_components/Header";
import Link from "next/link";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center gap-4">
        <Header>Products</Header>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>
      <ProductsTable />
    </div>
  );
}

function ProductsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Active</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>

      </TableBody>
    </Table>
  );
}