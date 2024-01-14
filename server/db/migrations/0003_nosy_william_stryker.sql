ALTER TABLE "user_friends" DROP CONSTRAINT "user_friends_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_friends" DROP CONSTRAINT "user_friends_friend_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_friends" DROP CONSTRAINT "user_friends_user_id_friend_id_pk";--> statement-breakpoint
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_userId_friendId_pk" PRIMARY KEY("userId","friendId");--> statement-breakpoint
ALTER TABLE "user_friends" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_friends" ADD COLUMN "friendId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_friendId_user_id_fk" FOREIGN KEY ("friendId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_friends" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "user_friends" DROP COLUMN IF EXISTS "friend_id";