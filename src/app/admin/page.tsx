import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

// Function to get the total sales and the amount of money earned
async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { priceInCents: true },
    _count: true
  });

  return {
    amount: (data._sum.priceInCents || 0) / 100,
    numberOfSales: data._count
  };
}

// Function to get the total amount of products and the amount of active products
async function getProductsData() {
  const [totalProducts, activeProducts] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { isAvailableForPurchase: true } }),
  ])

  return {
    totalProducts,
    activeProducts,
  };
}

// Function to get the total amount of customers and the average spending
async function getCustomersData() {
  const [customerCount, orderData] = await Promise.all([
    db.customer.count(),
    db.order.aggregate({
      _sum: { priceInCents: true }
    }),
  ]);

  return {
    customerCount,
    averageSpendingPerCustomer:
      customerCount === 0
        ? 0
        : (orderData._sum.priceInCents || 0) / customerCount / 100,
  };
}

export default async function AdminPage() {
  // Save the information gathered from the functions above
  const [salesData, productsData, customersData] = await Promise.all([
    getSalesData(),
    getProductsData(),
    getCustomersData(),
  ]);

  return (
    <div className="grid grid-col-1 md:grid-col-2 lg:grid-col-3 gap-6">
      <DashboardCards title="Sales" description={`${formatNumber(salesData.numberOfSales)} orders`} body={formatCurrency(salesData.amount)} />
      <DashboardCards title="Products" description={`${formatNumber(productsData.totalProducts)} total products`} body={`${formatNumber(productsData.activeProducts)} active products`} />
      <DashboardCards title="Customers" description={`${formatNumber(customersData.customerCount)} total customers`} body={`${formatCurrency(customersData.averageSpendingPerCustomer)} average spending per customer`} />
    </div>
  );
}

type DashboardCardProps = {
  title: string
  description: string
  body: string
}

function DashboardCards({title, description, body}: DashboardCardProps) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}