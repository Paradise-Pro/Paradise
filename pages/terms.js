import BackgroundStars from "@/components/BackgroundStars";

export default function Terms() {
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
          Terms of Service
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
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using this service, you agree to be bound by these
          Terms of Service. If you do not agree with any part of the terms, you
          may not use our service.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          2. Eligibility
        </h2>
        <p>
          You must be at least 13 years old to use this service. By using it,
          you represent that you meet this requirement.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          3. Account Responsibility
        </h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account and for all activities that occur under your account.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          4. Prohibited Conduct
        </h2>
        <p>
          Users may not engage in any activity that is illegal, abusive, or that
          disrupts the service or its users. Violations may result in account
          suspension or termination.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          5. Intellectual Property
        </h2>
        <p>
          All content and functionality on this platform are the exclusive
          property of the creators or licensors and are protected by
          intellectual property laws.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          6. Termination
        </h2>
        <p>
          We reserve the right to terminate or suspend your access to the
          service at our discretion, without notice, for any conduct that we
          believe violates these Terms.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          7. Limitation of Liability
        </h2>
        <p>
          We are not liable for any indirect, incidental, or consequential
          damages resulting from your use of the service.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          8. Governing Law
        </h2>
        <p>
          These Terms are governed by the laws of Greece and the European Union.
          Any legal disputes will be resolved in the courts of Athens.
        </p>

        <h2 style={{ fontSize: "20px", marginTop: "24px", fontWeight: 600 }}>
          9. Contact Us
        </h2>
        <p>
          For any questions about these Terms, please contact us at{" "}
          <a
            href="mailto:terms@share.tech"
            style={{
              color: "#00e6e6",
              textDecoration: "none",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.target.style.color = "#00e6e6")}
          >
            terms@share.tech
          </a>
          .
        </p>
      </div>
    </div>
  );
}
