import { ReactNode } from "react";

export function Header({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-4xl mb-4">{children}</h1>
  );
}