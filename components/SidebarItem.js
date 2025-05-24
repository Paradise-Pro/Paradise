import Link from "next/link";
import { useRouter } from "next/router";

export default function SidebarItem({ icon, label, path, expanded }) {
  const { pathname } = useRouter();
  const isActive = pathname === path;

  return (
    <Link href={path} style={{ textDecoration: "none", width: "100%" }}>
      <div
        title={!expanded ? label : undefined}
        style={{
          fontSize: "1.6rem",
          padding: "0.5rem",
          borderRadius: "12px",
          backgroundColor: isActive ? "#00aaff33" : "transparent",
          color: isActive ? "#00aaff" : "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "flex-start" : "center",
          gap: "0.8rem",
          transition: "all 0.3s ease",
        }}
      >
        <span>{icon}</span>
        {expanded && <span style={{ fontSize: "1rem" }}>{label}</span>}
      </div>
    </Link>
  );
}
