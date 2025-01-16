import { db } from "@/lib/db";
import { Header } from "../_components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteDropdownItem } from "../_components/CustomersAction";

function getCustomers() {
  return db.customer.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { priceInCents: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}

export default function AdminCustomerPage() {
  return (
    <div>
      <div className="flex justify-between items-center gap-4">
        <Header>Customers</Header>
      </div>
      <CustomersTable />
    </div>
  );
}

async function CustomersTable() {
  const customers = await getCustomers();

  if (customers.length === 0) return <p>No customers found.</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map(customer => (
          <TableRow key={customer.id}>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{formatNumber(customer.orders.length)}</TableCell>
            <TableCell>{formatCurrency(customer.orders.reduce((sum, o) => o.priceInCents + sum, 0) / 100)}</TableCell> {/* Sums the total between all orders for each customer */}
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className="sr-only">Actions</span>
                  <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropdownItem id={customer.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}