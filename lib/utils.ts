import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMetadataRootURL() {
  if (process.env.NEXT_PUBLIC_WEB_URL) {
    return new URL(process.env.NEXT_PUBLIC_WEB_URL)
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`)
  }
  return new URL(`http://localhost:${process.env.PORT || 3000}`)
}
