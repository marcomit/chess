import { Avatar } from "@/components/ui/avatar";
import { getServerAuthSession } from "@/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main>
      <h1>Welcome to the homepage of chess</h1>
      <p>
        This site is created by the best programmer ever, also called "THE KING"
      </p>
      <p>{JSON.stringify(session?.user)}</p>
    </main>
  );
}
