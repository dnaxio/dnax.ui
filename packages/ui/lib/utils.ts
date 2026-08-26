import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Fusionne des classes conditionnelles (clsx) et résout les conflits (tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
