import Sidebar from "../../components/Sidebar";

export default function RolesPage() {
  return (
    <>
      <Sidebar />
      <div style={{ marginTop: "5rem", textAlign: "center", color: "white", fontFamily: "'SF Pro Display', sans-serif" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎭 Roles</h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>Assign, edit and manage role automations and menus.</p>
      </div>
    </>
  );
}