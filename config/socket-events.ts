import { uuidSchema, userSchema, friendRequestStatus, moves } from "@/types/zod-types";
import { z } from "zod";

export const events = {
  friend: {
    send: z.object({
      receiverId: z.string().cuid(),
    }),
    receive: z.object({
      sender: userSchema,
    }),
    responde: friendRequestStatus,
  },
  utils: {
    join: z.string(),
    leave: z.string(),
  },
  game: {
    join: uuidSchema,
    leave: uuidSchema,
    search: userSchema,
    sendUserInfo: z.object({ user: userSchema, gameId: uuidSchema }),
    move: z.object({
      moves,
      gameId: uuidSchema,
    }),
  },
} as const;
