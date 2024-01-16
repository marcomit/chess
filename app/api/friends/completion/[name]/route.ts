import { db } from "@/server/db/db";
import { users } from "@/server/db/schema";
import { like, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params: { name } }: { params: { name: string } }) {
  const usersSearch = await db.select({
    name: users.name,
    email: users.email,
    image: users.image
  })
    .from(users)
    .where(or(like(users.name, name),
      like(users.email, name)))
  console.log(usersSearch)
  return NextResponse.json(usersSearch)
}