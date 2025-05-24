import Sidebar from "../../components/Sidebar";

export default function CommandsPage() {
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
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛠️ Commands</h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>
          Here you'll be able to create and manage custom bot commands.
        </p>
      </div>
    </>
  );
}
s;
