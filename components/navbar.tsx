"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import React from "react";
import { navbarItem } from "@/config/navbar";
import { useSession } from "next-auth/react";
import Image from "next/image";

export const Navbar = () => {
  const { data: session } = useSession();
  return (
    <header className="fixed flex container bg-background left-1/2 z-50 rounded-md -translate-x-1/2 top-2 h-max border shadow-md">
      <NavigationMenu className="rounded-md w-full mx-auto">
        <NavigationMenuList>
          {navbarItem.map(({ title, href }) => (
            <NavigationMenuItem key={href}>
              <Link href={href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Image src={session?.user.image!} alt="" width={40} height={40} />
    </header>
  );
};
