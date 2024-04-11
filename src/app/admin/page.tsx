import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

function wait(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true
  })
  await wait(2000)

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true }
    })
  ])

  return {
    userCount,
    averageValuePerUser: userCount === 0
      ? 0
      : (orderData._sum.pricePaidInCents || 0) / userCount / 100
  };
}

async function getProductData() {
  const [activeProducts, inactiveProducts] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } })
  ])

  return { activeProducts, inactiveProducts };
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData()
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} sales`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(userData.averageValuePerUser)} average value`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Active products"
        subtitle={`${formatNumber(productData.inactiveProducts)} inactive`}
        body={formatNumber(productData.activeProducts)}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string,
  subtitle: string,
  body: string
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}