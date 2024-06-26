import { z } from "zod";

export const coordinate = z.object({
  row: z.number(),
  col: z.number(),
});

export const moves = z.object({
  from: coordinate,
  to: coordinate,
});

export const nonEmptyCell = z.object({
  piece: z.enum(["pawn", "rook", "hourse", "bishop", "queen", "king"]),
  color: z.enum(["white", "black"]),
  cronology: z.array(moves),
});

export const emptyCell = z.object({
  piece: z.enum(["empty"]),
});

export const cell = z.union([nonEmptyCell, emptyCell]);

export const userSchema = z.object({
  id: z.string(),
  image: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
});

export const friendRequestStatus = z.enum(["accepted", "declined", "pending"]);
export const uuidSchema = z.string().uuid();

export type User = z.infer<typeof userSchema>;
export type UuidSchema = z.infer<typeof uuidSchema>;
export type Coordinate = z.infer<typeof coordinate>;
export type Moves = z.infer<typeof moves>;
export type NonEmptyCell = z.infer<typeof nonEmptyCell>;
export type EmptyCell = z.infer<typeof emptyCell>;
export type Cell = z.infer<typeof cell>;
