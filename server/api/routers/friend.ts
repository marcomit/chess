import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { friendRequests } from "@/server/db/schema/friend-request";
import { users } from "@/server/db/schema/user";
import { and, eq, like, not, or, sql } from "drizzle-orm";
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
          or(
            eq(friendRequests.senderId, users.id),
            eq(friendRequests.receiverId, users.id)
          ),
          eq(friendRequests.status, "accepted")
        )
      )
      .where(eq(friendRequests.receiverId, session.user.id));
    return friends;
  }),
  getReceivedFriendRequests: protectedProcedure.query(
    async ({ ctx: { session, db } }) => {
      const receivedFriendRequests = await db
        .select()
        .from(users)
        .innerJoin(
          friendRequests,
          and(
            eq(friendRequests.senderId, users.id),
            eq(friendRequests.status, "pending")
          )
        )
        .where(eq(friendRequests.receiverId, session.user.id));
      return receivedFriendRequests;
    }
  ),
  getRequestSent: protectedProcedure.query(async ({ ctx: { session, db } }) => {
    const sentFriendRequests = await db
      .select()
      .from(users)
      .innerJoin(
        friendRequests,
        and(
          eq(friendRequests.receiverId, users.id),
          eq(friendRequests.status, "pending")
        )
      )
      .where(eq(friendRequests.senderId, session.user.id));
    return sentFriendRequests;
  }),
  completion: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { db, session }, input: name }) => {
      const usersSearch = await db
        .select()
        .from(users)
        .where(
          and(
            or(like(users.name, `%${name}%`), like(users.email, `%${name}%`)),
            not(eq(users.id, session.user.id))
          )
        );
      return usersSearch;
    }),
});
