"use client"

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export default function Nav({ children }: { children: ReactNode }) {
  return (
    <div className="bg-purple-950 flex justify-around items-center py-4">
      <div className="relative w-24 h-16 aspect-auto">
        <Image src="/assets/img/ftgames_logo.png" fill alt="FTgames logo" />
      </div>
      <nav className="text-primary-foreground flex justify-center gap-2">{children}</nav>
      <div></div>
    </div>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname()

  return <Link {...props} className={cn(
    "rounded-2xl px-4 py-2 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
    pathname === props.href && "bg-background text-foreground"
  )} />;
}