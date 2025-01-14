import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function isValidPassword(password: string, hashedPassword: string) {
  return await hashPassword(password) === hashedPassword;
}

async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password)); // Converts the password into a hashed password

  return Buffer.from(arrayBuffer).toString("base64"); // Return the hashed password and shortens it using base64
}
