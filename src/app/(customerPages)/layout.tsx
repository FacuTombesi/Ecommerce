import Footer from "@/components/Footer";
import Nav, { NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My orders</NavLink>
        <NavLink href="/about">About</NavLink>
      </Nav>
      <div className="container my-6 justify-self-center">{children}</div>
      <Footer />
    </div>
  );
}