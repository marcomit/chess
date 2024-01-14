import { socket } from "@/lib/socket";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function Page() {
  const session = await getServerAuthSession()
  return <>
    <p>qweqweqwe</p>
  </>
}