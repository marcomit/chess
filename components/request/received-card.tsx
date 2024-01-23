"use client";

import { FriendRequest } from "@/server/db/schema";
import { User } from "@/types/zod-types";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { api } from "@/trpc/react";

export const ReceivedCard = ({
  request,
  user,
}: {
  request: FriendRequest;
  user: User;
}) => {
  const response = api.request.response.useMutation();
  return (
    <Card className="flex items-center">
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>

      <CardFooter className="space-x-4 ml-auto my-auto h-full">
        <Button
          variant={"default"}
          size={"icon"}
          onClick={() =>
            response.mutate({
              status: "accepted",
              requestId: request.id,
            })
          }
        >
          <Check className="size-4" />
        </Button>
        <Button
          variant={"destructive"}
          size={"icon"}
          onClick={() =>
            response.mutate({
              status: "declined",
              requestId: request.id,
            })
          }
        >
          <X className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
