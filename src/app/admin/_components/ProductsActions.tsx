"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteProduct, toggleProductAvailability } from "../_actions/products";
import { useRouter } from "next/navigation";

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase
}: {
  id: string
  isAvailableForPurchase: boolean
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Set a router to manage realtime updates when a product is activated/deactivated or deleted

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailableForPurchase)
          router.refresh() // Refresh router to update state
        })
      }}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem({
  id,
  disabled
}: {
  id: string
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Same as above (line 16)

  return (
    <DropdownMenuItem
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(id)
          router.refresh() // Same as above (line 24)
        })
      }}
      className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
    >
      Delete
    </DropdownMenuItem>
  );
}