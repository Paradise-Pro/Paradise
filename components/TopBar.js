import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import ClockWithCalendar from "./ClockWithCalendar";

export default function TopBar({ avatar, name, onAppLaunch }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    if (!showMenu) {
      setShowMenu(true);
      setTimeout(() => setMenuVisible(true), 10); // μικρή καθυστέρηση για fade-in
    } else {
      setMenuVisible(false);
      setTimeout(() => setShowMenu(false), 300); // περιμένει το fade-out
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        background: "linear-gradient(145deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: "white",
        fontFamily: "'SF Pro Display', sans-serif",
        fontSize: "0.95rem",
        zIndex: 9999,
      }}
    >
      {/* Left side - Avatar and menu */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          position: "relative",
        }}
      >
        {avatar && (
          <img
            src={avatar}
            alt="Avatar"
            width={24}
            height={24}
            style={{ borderRadius: "50%", cursor: "pointer" }}
            onClick={toggleMenu}
          />
        )}

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "10px",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "1.5rem",
              borderRadius: "24px",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
              zIndex: 10000,
              display: "grid",
              gridTemplateColumns: "repeat(2, 100px)",
              gap: "1.5rem",
              justifyContent: "center",
              alignItems: "center",
              transition: "opacity 0.3s ease-in-out",
              opacity: menuVisible ? 1 : 0,
              pointerEvents: menuVisible ? "auto" : "none",
            }}
          >
            {/* Start */}
            <div style={appIconStyle}>
              <a
                href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&scope=bot+applications.commands&permissions=8`}
                target="_blank"
                rel="noreferrer"
              >
                <img src="/icons/start.png" alt="Start" style={imgStyle} />
                <div style={labelStyle}>Start</div>
              </a>
            </div>

            {/* Weather */}
            <div
              style={appIconStyle}
              onClick={() => {
                onAppLaunch("weather");
                toggleMenu();
              }}
            >
              <img src="/icons/weather.png" alt="Καιρός" style={imgStyle} />
              <div style={labelStyle}>Καιρός</div>
            </div>

            {/* Calendar */}
            <div
              style={appIconStyle}
              onClick={() => {
                onAppLaunch("calendar");
                toggleMenu();
              }}
            >
              <img
                src="/icons/calendar.png"
                alt="Ημερολόγιο"
                style={imgStyle}
              />
              <div style={labelStyle}>Ημερολόγιο</div>
            </div>

            {/* Logout */}
            <div
              style={appIconStyle}
              onClick={() => {
                toggleMenu();
                signOut({ callbackUrl: "/" });
              }}
            >
              <img src="/icons/logout.png" alt="Logout" style={imgStyle} />
              <div style={labelStyle}>Logout</div>
            </div>
          </div>
        )}
      </div>

      {/* Center - Name */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontWeight: "600",
          fontSize: "1rem",
          color: "#00d0ff",
          textShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}
      >
        {name || "Paradise"}
      </div>

      {/* Right side - Clock */}
      <div
        onClick={() => onAppLaunch("calendar")}
        style={{ cursor: "pointer" }}
      >
        <ClockWithCalendar />
      </div>
    </div>
  );
}

// 🔧 Styles
const appIconStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s ease-in-out",
};

const imgStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  marginBottom: "8px",
  objectFit: "cover",
};

const labelStyle = {
  fontSize: "13px",
  color: "#f0f0f0",
  fontWeight: "600",
  textShadow: "0 1px 3px rgba(0,0,0,0.4)",
};
