import { AddFriendDialog } from "@/components/add-friend-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/server";
import { Suspense } from "react";

export default async function Page() {
  return <>
    <AddFriendDialog />
    <Tabs defaultValue="friends">
      <TabsList>
        <TabsTrigger value="friends">Friends</TabsTrigger>
        <TabsTrigger value="received">Received request</TabsTrigger>
        <TabsTrigger value="sent">Request sent</TabsTrigger>
        <TabsTrigger value="search">Search users</TabsTrigger>
      </TabsList>
      <TabsContent value="friends">
        <Suspense fallback={<div>Loading...</div>}>
          <FriendTab />
        </Suspense>
      </TabsContent>

      <TabsContent value="received">
        <Suspense fallback={<div>Loading...</div>}>
          <ReceivedTab />
        </Suspense>
      </TabsContent>

      <TabsContent value="sent">
        <Suspense fallback={<div>Loading...</div>}>
          <SentTab />
        </Suspense>
      </TabsContent>
    </Tabs>
  </>
}

const FriendTab = async () => {
  const friends = await api.friend.getFriends.query();
  return <>
    {JSON.stringify(friends)}
  </>
}

const ReceivedTab = async () => {
  const received = await api.friend.getReceivedFriendRequests.query();
  return <>
    {JSON.stringify(received)}
  </>
}

const SentTab = async () => {
  const sent = await api.friend.getRequestSent.query();
  return <>
    {JSON.stringify(sent)}
  </>
}