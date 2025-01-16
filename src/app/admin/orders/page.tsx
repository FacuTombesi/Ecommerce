import { db } from "@/lib/db";
import { Header } from "../_components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteDropdownItem } from "../_components/OrdersActions";

function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      priceInCents: true,
      product: { select: { name: true } },
      customer: { select: { email: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="flex justify-between items-center gap-4">
        <Header>Sales</Header>
      </div>
      <OrdersTable />
    </div>
  );
}

async function OrdersTable() {
  const orders = await getOrders();

  if (orders.length === 0) return <p>No sales yet.</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price paid</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(order => (
          <TableRow key={order.id}>
            <TableCell>{order.product.name}</TableCell>
            <TableCell>{order.customer.email}</TableCell>
            <TableCell>{formatCurrency(order.priceInCents / 100)}</TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className="sr-only">Actions</span>
                  <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropdownItem id={order.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}