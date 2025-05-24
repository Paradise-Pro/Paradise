import BackgroundStars from "@/components/BackgroundStars";

export default function Privacy() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflowY: "auto",
        fontFamily: "'SF Pro Display', sans-serif",
        color: "#fff",
      }}
    >
      <BackgroundStars />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "40px",
          maxWidth: "800px",
          margin: "60px auto",
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.15))",
          borderRadius: "12px",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            marginBottom: "8px",
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          Privacy Policy
        </h1>

        <div
          style={{
            width: "60px",
            height: "3px",
            backgroundColor: "#00e6e6",
            margin: "8px auto 24px auto",
            borderRadius: "2px",
          }}
        />

        <p
          style={{ marginBottom: "24px", textAlign: "center", fontWeight: 300 }}
        >
          Last updated: May 2025
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          1. Introduction
        </h2>
        <p>
          We value your privacy and are committed to protecting your personal
          data. This Privacy Policy outlines how we collect, use, and protect
          your information.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          2. Data Collection
        </h2>
        <p>
          We may collect personal information such as your name, email address,
          and Discord ID when you use our service.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          3. Use of Information
        </h2>
        <p>
          We use your data to provide access to the dashboard, enhance security,
          and improve the user experience. We do not sell your data to third
          parties.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          4. Data Storage & Security
        </h2>
        <p>
          Your information is stored securely and protected using modern
          encryption standards. Only authorized personnel have access to your
          data.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          5. Cookies
        </h2>
        <p>
          We use cookies to maintain session states and personalize your
          experience. You can disable cookies in your browser settings.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          6. User Rights
        </h2>
        <p>
          You have the right to access, correct, or delete your personal data.
          To request changes, contact us at{" "}
          <a
            href="mailto:privacy@share.tech"
            style={{
              color: "#00e6e6",
              textDecoration: "none",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.target.style.color = "#00e6e6")}
          >
            privacy@share.tech
          </a>
          .
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          7. Third-Party Services
        </h2>
        <p>
          Our service may integrate with third-party platforms such as Discord.
          These services have their own privacy policies which we do not
          control.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          8. Changes to This Policy
        </h2>
        <p>
          We reserve the right to update this policy. Any changes will be
          reflected on this page with a new effective date.
        </p>
      </div>
    </div>
  );
}
