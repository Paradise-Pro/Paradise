import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Log in with Discord</h1>
      <button
        onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "8px",
          backgroundColor: "#5865F2",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Connect Discord
      </button>
    </div>
  );
}
