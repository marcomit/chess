import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { friendRequests } from "@/server/db/schema/friend-request";
import { users } from "@/server/db/schema/user";
import { and, eq, or, sql } from "drizzle-orm";
import { z } from "zod";

export const friendRouter = createTRPCRouter({
  getFriends: protectedProcedure.query(async ({ ctx: { session, db } }) => {
    console.log("SESSION", session);
    const friends = await db
      .select({
        friendId: friendRequests.receiverId,
        friendName: users.name,
      })
      .from(users)
      .innerJoin(
        friendRequests,
        and(
          eq(friendRequests.senderId, users.id),
          eq(friendRequests.status, "accepted")
        )
      )
      .where(eq(friendRequests.receiverId, session.user.id));
    return friends;
  }),
  getReceivedFriendRequests: protectedProcedure.query(
    async ({ ctx: { session, db } }) => {
      const receivedFriendRequests = await db
        .select({
          senderId: friendRequests.senderId,
          senderName: users.name,
        })
        .from(users)
        .innerJoin(
          friendRequests,
          and(
            eq(friendRequests.receiverId, users.id),
            eq(friendRequests.status, "pending")
          )
        )
        .where(eq(friendRequests.senderId, session.user.id));
      return receivedFriendRequests;
    }
  ),
  getRequestSent: protectedProcedure.query(async ({ ctx: { session, db } }) => {
    const sentFriendRequests = await db
      .select({
        receiverId: friendRequests.receiverId,
        receiverName: users.name,
      })
      .from(users)
      .innerJoin(
        friendRequests,
        and(
          eq(friendRequests.senderId, users.id),
          eq(friendRequests.status, "pending")
        )
      )
      .where(eq(friendRequests.receiverId, session.user.id));
    return sentFriendRequests;
  }),
  completion: publicProcedure.input(z.object({
    name: z.string()
  }))
    .query(async ({ ctx: { db }, input: { name } }) => {
      const usersSearch = await db.select({
        name: users.name,
        email: users.email,
        image: users.image
      })
        .from(users)
        .where(or(sql`${users.name} LIKE '${name}%'`,
          sql`${users.email} LIKE '%${name}%'`))
      return usersSearch;
    })
});
