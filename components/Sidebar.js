import { useRouter } from "next/router";
import SidebarItem from "./SidebarItem";

const items = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard" },
  { icon: "🛠️", label: "Commands", path: "/dashboard/commands" },
  { icon: "🔒", label: "Moderation", path: "/dashboard/moderation" },
  { icon: "📥", label: "Invites", path: "/dashboard/invites" },
  { icon: "🎁", label: "Giveaway Logs", path: "/dashboard/logs" },
  { icon: "🎫", label: "Ticket Logs", path: "/dashboard/ticketlogs" },
  { icon: "⚙️", label: "Settings", path: "/dashboard/settings" },
];

export default function Sidebar() {
  const { pathname } = useRouter();
  const isRootDashboard =
    pathname === "/dashboard" || pathname === "/dashboard/";

  const positionStyles = isRootDashboard
    ? {
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        flexDirection: "row",
      }
    : {
        top: "50%",
        right: "1.5rem",
        transform: "translateY(-50%)",
        flexDirection: "column",
      };

  return (
    <div
      style={{
        position: "fixed",
        ...positionStyles,
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "0.75rem 1rem",
        display: "flex",
        gap: "1.2rem",
        zIndex: 999,
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {items.map((item) => (
        <SidebarItem key={item.label} {...item} />
      ))}
    </div>
  );
}
