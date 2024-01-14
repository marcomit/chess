import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialOfName(name: string): string {
  return name.split(" ").reduce((initial, item, index) => {
    if (index < 2) {
      return initial + item.at(0)?.toUpperCase();
    }
    return initial;
  }, "");
}

export const alphabet = "abcdefghijklmnopqrstuvwxyz";
