import { Navbar } from "@/components/navbar";
import { FriendRequestProvider } from "@/providers/friend-request";
import { SessionProvider } from "@/providers/session";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container pt-20">
      <SessionProvider>
        <Navbar />
        <FriendRequestProvider>
          {children}
        </FriendRequestProvider>
      </SessionProvider>
    </main>
  );
}
