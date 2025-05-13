import Sidebar from "../../components/Sidebar";

export default function WelcomePage() {
  return (
    <>
      <Sidebar />
      <div style={{ marginTop: "5rem", textAlign: "center", color: "white", fontFamily: "'SF Pro Display', sans-serif" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>👋 Welcome</h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>Customize welcome messages and actions for new users.</p>
      </div>
    </>
  );
}