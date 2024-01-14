import { createTRPCRouter, protectedProcedure } from "../trpc";
import { friendRequests } from "@/server/db/schema/friend-request";
import { users } from "@/server/db/schema/user";
import { and, eq } from "drizzle-orm";

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
});
