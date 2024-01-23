import { createTRPCRouter, protectedProcedure } from "../trpc";
import { friendRequestStatus, userSchema } from "@/types/zod-types";
import { friendRequests } from "@/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const friendRequestRouter = createTRPCRouter({
  send: protectedProcedure
    .input(userSchema)
    .mutation(async ({ ctx: { session, db, socket }, input }) => {
      socket.emit("friend", "send", { receiver: input });
      await db.insert(friendRequests).values({
        senderId: session.user.id,
        receiverId: input.id,
      });
    }),
  response: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
        status: friendRequestStatus,
      })
    )
    .mutation(async ({ ctx: { session, db, socket }, input }) => {
      socket.emit("friend", "responde", input);
      console.log("Send response");

      await db
        .update(friendRequests)
        .set({ status: input.status })
        .where(eq(friendRequests.id, input.requestId));
    }),
});
