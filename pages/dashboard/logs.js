import LogsFeed from "@/components/LogsFeed";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useSession } from "next-auth/react";

export default function LogsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading session...</p>;

  const ownerId = process.env.NEXT_PUBLIC_DISCORD_OWNER_ID;

  if (!session || String(session.user.id) !== String(ownerId)) {
    return <p>Access denied. Owner only.</p>;
  }

  return (
    <>
      <TopBar avatar={session.user?.image} name={session.user?.name} />
      <Sidebar />
      <main className="pt-24 px-6 pb-10 max-w-5xl mx-auto font-sans">
        <LogsFeed />
      </main>
    </>
  );
}
