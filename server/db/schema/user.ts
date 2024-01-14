import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { games } from "./game";
import { friendRequests } from "./friend-request";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const usersRelationship = relations(users, ({ many }) => ({
  gamesWon: many(games, { relationName: "gamesWon" }),
  lostGames: many(games, { relationName: "lostGames" }),
  sentRequests: many(friendRequests, { relationName: "sentFriendRequests" }),
  receivedRequests: many(friendRequests, { relationName: "receivedFriendRequests" }),
}))
