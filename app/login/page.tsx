"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BuiltInProviderType } from "next-auth/providers/index";
import { type LiteralUnion, signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  const { data: session } = useSession();
  async function handleClick(provider: LiteralUnion<BuiltInProviderType>) {
    try {
      await signIn(provider);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex-1 bg-secondary h-full">
        <Icons.logo className="w-20 h-20 mx-auto" />
        <Image
          src={"/placeholder.svg"}
          alt="placeholder"
          className="mx-auto rounded-lg"
          width={400}
          height={100}
        />
      </div>
      {session && <p>{session.user.name}</p>}
      <Card className="border-none shadow-none flex-1">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            <Button
              variant="outline"
              onClick={() => handleClick("github")}
              className="w-full"
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button
              variant="outline"
              onClick={() => handleClick("google")}
              className="w-full"
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create account</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
