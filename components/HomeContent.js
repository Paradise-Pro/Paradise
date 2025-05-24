import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function HomeContent() {
  const [hovered, setHovered] = useState(false);

  const handleDiscordLogin = () => {
    signIn("discord", { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 rgba(32, 156, 255, 0.5); }
            50% { transform: scale(1.05); box-shadow: 0 0 10px rgba(104, 224, 207, 0.7); }
            100% { transform: scale(1); box-shadow: 0 0 0 rgba(32, 156, 255, 0.5); }
          }

          .animated-button {
            background: linear-gradient(135deg, #209cff, #68e0cf);
            color: #fff;
            padding: 10px 24px;
            border-radius: 999px;
            font-weight: bold;
            font-size: 14px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(32, 156, 255, 0.4);
            transition: all 0.3s ease;
          }

          .animated-button.hovered {
            animation: pulse 1.4s infinite ease-in-out;
          }
        `}
      </style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          zIndex: 10,
          fontFamily: "'SF Pro Display', sans-serif",
        }}
      >
        <h1 style={{ fontSize: "29px", marginBottom: "19px" }}>
          Log in with Discord to access the dashboard.
        </h1>

        <button
          className={`animated-button ${hovered ? "hovered" : ""}`}
          onClick={handleDiscordLogin}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Log in with Discord
        </button>
      </div>
    </>
  );
}
