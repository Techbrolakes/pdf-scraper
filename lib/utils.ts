import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Ensure URL has proper protocol (http:// or https://)
 * @param url - The URL to check and fix
 * @returns URL with protocol, or empty string if input is null/empty
 */
export function ensureProtocol(url: string | null | undefined): string {
  if (!url) return "";
  // Check if URL already has a protocol
  if (url.match(/^https?:\/\//i)) {
    return url;
  }
  // Add https:// if missing
  return `https://${url}`;
}
