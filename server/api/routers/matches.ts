import { createTRPCRouter, protectedProcedure } from "../trpc";

export const matchesRouter = createTRPCRouter({
  played: protectedProcedure.query(
    async ({ ctx: { session, db, socket } }) => {}
  ),
});
