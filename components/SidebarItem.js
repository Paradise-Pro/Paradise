import Link from "next/link";
import { useRouter } from "next/router";

export default function SidebarItem({ icon, label, path }) {
  const { pathname } = useRouter();
  const isActive = pathname === path;

  return (
    <Link href={path} style={{ textDecoration: "none" }}>
      <div
        title={label}
        onMouseEnter={(e) => {
          e.currentTarget.classList.add("dock-bounce");
        }}
        onAnimationEnd={(e) => {
          e.currentTarget.classList.remove("dock-bounce");
        }}
        style={{
          fontSize: "1.8rem",
          padding: "0.5rem",
          borderRadius: "50%",
          backgroundColor: isActive ? "#00aaff33" : "transparent",
          color: isActive ? "#00aaff" : "white",
          transition: "background 0.25s",
          cursor: "pointer",
        }}
      >
        <span style={{ display: "inline-block" }}>{icon}</span>
      </div>
    </Link>
  );
}