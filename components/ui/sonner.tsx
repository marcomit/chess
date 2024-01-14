"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-foreground group-[.toaster]:shadow-md",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: addPrefix(
            "group-[.toast]:",
            "border-2 border-[#000] rounded-sm shadow-sm bg-primary"
          ),
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

function addPrefix<Pref extends string, Cls extends string>(
  pref: Pref,
  clsx: Cls
) {
  return clsx
    ?.toString()
    .split(" ")
    .map((cls) => `${pref}${cls}`)
    .join(" ");
}

export { Toaster };
