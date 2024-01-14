import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/server";
import { Suspense } from "react";

export default async function Page() {
  return <>

    <Tabs defaultValue="friends">
      <TabsList>
        <TabsTrigger value="friends">Friends</TabsTrigger>
        <TabsTrigger value="received">Received request</TabsTrigger>
        <TabsTrigger value="sent">Request sent</TabsTrigger>
      </TabsList>
      <TabsContent value="friends">
        <Suspense fallback={<div>Loading...</div>}>
          <FriendTab />
        </Suspense>
      </TabsContent>

      <TabsContent value="received">
        <Suspense fallback={<div>Loading...</div>}>
          <FriendTab />
        </Suspense>
      </TabsContent>

      <TabsContent value="sent">
        <Suspense fallback={<div>Loading...</div>}>
          <FriendTab />
        </Suspense>
      </TabsContent>
    </Tabs>
  </>
}

const FriendTab = async () => {
  const friends = await api.friend.getFriends.query();
  return <TabsContent value="friends">
    {JSON.stringify(friends)}
  </TabsContent>
}
