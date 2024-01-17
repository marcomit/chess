"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, PlusIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { User } from "@/types/zod-types";
import { Icons } from "./icons";
import Image from "next/image";

export const AddFriendDialog = () => {
  const [usersSearched, setUsersSearched] = useState<User[]>([]);
  const users = api.friend.completion.useMutation();
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 3) return;
    const result = await users.mutateAsync(e.target.value);
    console.log(result);
    setUsersSearched(result);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full" size={"icon"}>
          <PlusIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add friend</DialogTitle>
        </DialogHeader>
        <Input onChange={handleChange} />
        {users.isLoading ? (
          <Icons.spinner className="animate-spin w-4 h-4 mx-auto" />
        ) : users.isError ? (
          <div>{users.error.message}</div>
        ) : usersSearched.length === 0 ? (
          <p className="text-muted-foreground mx-auto">Users not found...</p>
        ) : (
          usersSearched.map((user, index) => (
            <UserCard key={index} user={user} />
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

const UserCard = ({ user }: { user: User }) => {
  const request = api.request.send.useMutation();
  return (
    <div className="flex items-center space-x-4 p-2 border-b border-gray-200">
      <Image
        src={user.image || "default-profile.png"}
        alt={`${user.name}'s profile`}
        className="w-10 h-10 rounded-full"
        width={40}
        height={40}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user.name}
        </p>
      </div>
      <Button
        onClick={() => {
          request.mutate(user);
        }}
      >
        {request.isLoading ? (
          <Icons.spinner className="animate-spin w-4 h-4 mx-auto" />
        ) : (
          <Check className="w-4 h-4 mx-auto" />
        )}
        Send Request
      </Button>
    </div>
  );
};
