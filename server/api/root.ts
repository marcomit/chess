import { createTRPCRouter } from "@/server/api/trpc";
import { friendRouter } from "./routers/friend";
import { friendRequestRouter } from "./routers/request";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  friend: friendRouter,
  request: friendRequestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
