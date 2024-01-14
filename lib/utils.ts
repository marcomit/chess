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

type AddPrefix<
  Pref extends string,
  Cls extends string,
  Clsx extends string = ""
> = Cls extends `${infer First} ${infer Rest}`
  ? AddPrefix<Pref, Rest, `${Clsx} ${Pref}${First}`>
  : Clsx;

export function addPrefix<Pref extends string, Cls extends string>(
  pref: Pref,
  clsx: Cls
) {
  return clsx
    ?.toString()
    .split(" ")
    .map((cls) => `${pref}${cls}`)
    .join(" ");
}


export const alphabet = "abcdefghijklmnopqrstuvwxyz";
