import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import WeatherWidget from "../components/WeatherWidget";
import CalendarWidget from "../components/CalendarWidget";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [botInfo, setBotInfo] = useState(null);
  const [activeApp, setActiveApp] = useState(null);

  useEffect(() => {
    async function fetchBot() {
      try {
        const res = await fetch("/api/auth/bot-info");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Σφάλμα API: ${res.status} - ${text}`);
        }
        const data = await res.json();
        setBotInfo(data);
      } catch (error) {
        console.error("Απέτυχε η ανάκτηση του bot info:", error);
      }
    }

    fetchBot();
  }, []);

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>Access denied. Please log in.</p>;

  const displayName = botInfo?.username || session.user?.name || "User";
  const avatar = session.user?.image;

  return (
    <>
      <TopBar avatar={avatar} name={displayName} onAppLaunch={setActiveApp} />
      <Sidebar />

      <div
        style={{
          padding: "2rem",
          paddingTop: "4rem",
          fontFamily: "'SF Pro Display', sans-serif",
        }}
      >
        {/* Εμφάνιση εφαρμογών πάνω από dashboard */}
        {activeApp === "weather" && (
          <div style={widgetWrapper}>
            <WeatherWidget onClose={() => setActiveApp(null)} />
          </div>
        )}

        {activeApp === "calendar" && (
          <div style={widgetWrapper}>
            <CalendarWidget onClose={() => setActiveApp(null)} />
          </div>
        )}
      </div>
    </>
  );
}

// Νέο κοινό στυλ wrapper για widgets (χωρίς headers)
const widgetWrapper = {
  position: "absolute",
  top: "70px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 2000,
};
