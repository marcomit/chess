import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const games = pgTable("games", {
  id: text("id").notNull().primaryKey(),
  winnerId: text("winnerId"),
  loserId: text("loserId"),
  playedAt: timestamp("playedAt").notNull().defaultNow(),
})

export const gameRelationship = relations(games, ({ one }) => ({
  winner: one(users, { fields: [games.winnerId], references: [users.id], relationName: "gamesWon" }),
  loser: one(users, { fields: [games.loserId], references: [users.id], relationName: "lostGames" }),
}))