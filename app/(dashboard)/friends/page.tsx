import { AddFriendDialog } from "@/components/add-friend-dialog";
import { Icons } from "@/components/icons";
import { ReceivedCard } from "@/components/request/received-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/server";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <AddFriendDialog />
      <Tabs defaultValue="friends">
        <TabsList>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="received">Received request</TabsTrigger>
          <TabsTrigger value="sent">Request sent</TabsTrigger>
        </TabsList>
        <TabsContent value="friends">
          <Suspense
            fallback={<Icons.spinner className="animate-spin size-5" />}
          >
            <FriendTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="received">
          <Suspense
            fallback={<Icons.spinner className="animate-spin size-5" />}
          >
            <ReceivedTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="sent">
          <Suspense
            fallback={<Icons.spinner className="animate-spin size-5" />}
          >
            <SentTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
}

const FriendTab = async () => {
  const friends = await api.friend.getFriends.query();
  return (
    <>{friends.length === 0 ? <p>No friends...</p> : JSON.stringify(friends)}</>
  );
};

const ReceivedTab = async () => {
  const received = await api.friend.getReceivedFriendRequests.query();
  return (
    <>
      {received.length === 0 ? (
        <p>No users...</p>
      ) : (
        received.map(({ friendRequests, user }) => (
          <ReceivedCard request={friendRequests} user={user} key={user.id} />
        ))
      )}
    </>
  );
};

const SentTab = async () => {
  const sent = await api.friend.getRequestSent.query();
  return (
    <>
      {sent.length === 0 ? (
        <p>No users...</p>
      ) : (
        sent.map((request) => (
          <p key={request.friendRequests.id}>{request.user.email}</p>
        ))
      )}
    </>
  );
};
