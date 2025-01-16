"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteCustomer } from "../_actions/customers";
import { useRouter } from "next/navigation";

export function DeleteDropdownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteCustomer(id)
          router.refresh()
        })
      }}
      className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
    >
      Delete
    </DropdownMenuItem>
  );
}