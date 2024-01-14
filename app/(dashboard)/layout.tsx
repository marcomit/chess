import { Navbar } from "@/components/navbar";
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
        {children}
      </SessionProvider>
    </main>
  );
}
