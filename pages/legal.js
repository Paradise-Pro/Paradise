import BackgroundStars from "@/components/BackgroundStars";

export default function Legal() {
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
          Legal Notice
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
          1. Service Provider
        </h2>
        <p>
          This service is operated by <strong>Share Technologies</strong>, a
          digital platform registered in the European Union.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          2. Contact Information
        </h2>
        <p>
          Registered Office: 123 Freedom Street, Miami, FL 33101, United States
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:legal@share.tech"
            style={{
              color: "#00e6e6",
              textDecoration: "none",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.target.style.color = "#00e6e6")}
          >
            legal@share.tech
          </a>
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          3. Legal Responsibility
        </h2>
        <p>
          The operator of this website is legally responsible for its content,
          except for any user-generated content, which remains the
          responsibility of the respective users.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          4. Copyright & Intellectual Property
        </h2>
        <p>
          All trademarks, logos, and content on this website are protected by
          applicable copyright and intellectual property laws.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          5. Jurisdiction
        </h2>
        <p>
          This legal notice is governed by the laws of the State of Florida and
          the United States of America. Any disputes shall be resolved
          exclusively in the courts located in Miami, Florida.
        </p>
      </div>
    </div>
  );
}
