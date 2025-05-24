import Sidebar from "../../components/Sidebar";

export default function ModerationPage() {
  return (
    <>
      <Sidebar />
      <div
        style={{
          marginTop: "5rem",
          textAlign: "center",
          color: "white",
          fontFamily: "'SF Pro Display', sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          🔒 Moderation
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>
          Manage moderation rules and auto-actions here.
        </p>
      </div>
    </>
  );
}
