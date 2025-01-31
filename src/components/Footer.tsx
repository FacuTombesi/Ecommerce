import Image from "next/image";
import { NavLink } from "./Nav";

export default function Footer() {
  return (
    <footer className="bg-purple-950 text-primary-foreground flex justify-between items-center px-32 py-16 mt-16">
      <div className="relative w-24 h-16 aspect-auto">
        <Image src="/assets/img/ftgames_logo.png" fill alt="FTgames logo" />
      </div>
      <div className="flex gap-2">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My orders</NavLink>
        <NavLink href="/about">About</NavLink>
      </div>
      <div className="flex gap-2">
        <NavLink href="https://ftportfolio.vercel.app/" target="_blank" rel="noopener noreferrer">Portfolio</NavLink>
        <NavLink href="https://github.com/FacuTombesi" target="_blank" rel="noopener noreferrer">GitHub</NavLink>
        <NavLink href="https://www.linkedin.com/in/facundotombesi/" target="_blank" rel="noopener noreferrer">LinkedIn</NavLink>
      </div>
    </footer>
  );
}