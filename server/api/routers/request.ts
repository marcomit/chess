import { createTRPCRouter, protectedProcedure } from "../trpc";
import { userSchema } from "@/types/zod-types";
import { friendRequests } from "@/server/db/schema";

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
});
