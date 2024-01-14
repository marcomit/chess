CREATE TABLE IF NOT EXISTS "friendRequests" (
	"id" text PRIMARY KEY NOT NULL,
	"senderId" text,
	"receiverId" text,
	"status" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "user_friends";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_receiverId_user_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
