import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const friendRequestStatus = pgEnum('status', ['pending', 'accepted', 'declined']);

export const friendRequests = pgTable('friendRequests', {
  id: text('id').primaryKey(),
  senderId: text('senderId').references(() => users.id),
  receiverId: text('receiverId').references(() => users.id),
  status: friendRequestStatus("status"), // can represent the status of the request
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const friendRequestsRelations = relations(friendRequests, ({ one }) => ({
  sender: one(users, { fields: [friendRequests.senderId], references: [users.id], relationName: "sentFriendRequests" }),
  receiver: one(users, { fields: [friendRequests.receiverId], references: [users.id], relationName: "receivedFriendRequests" }),
}));