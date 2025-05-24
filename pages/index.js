import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hovered, setHovered] = useState(false);
  const [showForms, setShowForms] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      username === process.env.NEXT_PUBLIC_SECURITY_USERNAME &&
      password === process.env.NEXT_PUBLIC_SECURITY_PASSWORD
    ) {
      localStorage.setItem("hasAccess", "true");
      window.location.href = "/home";
    } else {
      alert("❌ Λάθος στοιχεία.");
    }
  };

  const WaveBackground = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        <path
          fill="#00BFFF"
          fillOpacity="0.15"
          d="M0,96L60,106.7C120,117,240,139,360,154.7C480,171,600,181,720,160C840,139,960,85,1080,90.7C1200,96,1320,160,1380,192L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,96L60,106.7C120,117,240,139,360,154.7C480,171,600,181,720,160C840,139,960,85,1080,90.7C1200,96,1320,160,1380,192L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z;
              M0,64L60,74.7C120,85,240,107,360,122.7C480,139,600,149,720,128C840,107,960,53,1080,58.7C1200,64,1320,128,1380,160L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z;
              M0,96L60,106.7C120,117,240,139,360,154.7C480,171,600,181,720,160C840,139,960,85,1080,90.7C1200,96,1320,160,1380,192L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z
            "
          />
        </path>
      </svg>
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <WaveBackground />
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(32, 156, 255, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(104, 224, 207, 0.7);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(32, 156, 255, 0.5);
          }
        }
        .animated-button {
          background: linear-gradient(135deg, #209cff, #68e0cf);
          color: #fff;
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: bold;
          font-size: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(32, 156, 255, 0.4);
          transition: all 0.3s ease;
          width: 100%;
        }
        .animated-button.hovered {
          animation: pulse 1.4s infinite ease-in-out;
        }
        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: #0d1b2a;
          padding: 12px 20px;
          border-radius: 999px;
          color: #fff;
          border: 1px solid #243b55;
          margin-bottom: 16px;
        }
        .input-wrapper input {
          border: none;
          background: transparent;
          outline: none;
          color: #fff;
          width: 100%;
          font-size: 14px;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "1200px",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "40px",
          }}
        >
          {/* Left */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              textAlign: "center",
            }}
          >
            <Image
              src="/logo.png"
              alt="Paradise Logo"
              width={160}
              height={160}
            />
            <a
              href="https://discord.gg/eJYNM4g4"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#4eb8ff",
                textDecoration: "none",
              }}
            >
              <Image
                src="/icons/discord.svg"
                alt="Discord"
                width={20}
                height={20}
              />
              Invite
            </a>

            <div style={{ position: "relative" }}>
              <div
                onClick={() => setShowForms((prev) => !prev)}
                style={{
                  color: "#4eb8ff",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                📄 Application Forms
              </div>

              {showForms && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  {[
                    {
                      href: "/apply/type1",
                      icon: "/icons/staff.png",
                      label: "Staff Application",
                      alt: "Staff",
                    },
                    {
                      href: "/apply/type2",
                      icon: "/icons/police.png",
                      label: "Police Application",
                      alt: "Police",
                    },
                    {
                      href: "/apply/type3",
                      icon: "/icons/doctor.png",
                      label: "Ambulance Application",
                      alt: "Ambulance",
                    },
                  ].map(({ href, icon, label, alt }) => (
                    <Link key={href} href={href}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          padding: "10px 18px",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#fff",
                          borderRadius: "999px",
                          background:
                            "linear-gradient(135deg, #209cff, #68e0cf)",
                          transition: "all 0.25s ease-in-out",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          minWidth: "230px",
                          textAlign: "center",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.boxShadow =
                            "0 0 12px rgba(104, 224, 207, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Image src={icon} alt={alt} width={20} height={20} />
                        {label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: "auto",
                fontSize: "13px",
                color: "#eee",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  marginTop: "auto",
                  fontSize: "13px",
                  color: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#ccc" }}>©️ 2025</span>
                <Link
                  href="/terms"
                  style={{
                    color: "#eee",
                    textDecoration: "none",
                  }}
                >
                  📜 Terms
                </Link>
                <Link
                  href="/privacy"
                  style={{
                    color: "#eee",
                    textDecoration: "none",
                  }}
                >
                  🔒 Privacy
                </Link>
                <Link
                  href="/legal"
                  style={{
                    color: "#eee",
                    textDecoration: "none",
                  }}
                >
                  ⚖️ Legal Notice
                </Link>
              </div>
            </div>
          </div>

          {/* Right */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(13,27,42,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "40px",
                width: "100%",
                maxWidth: "400px",
                boxShadow: "0 0 20px rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h1
                style={{
                  fontSize: "26px",
                  marginBottom: "28px",
                  color: "#ffffff",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                🚪 Welcome Back
              </h1>

              <form onSubmit={handleLogin}>
                <div className="input-wrapper">
                  <Image
                    src="/icons/login.svg"
                    width={20}
                    height={20}
                    alt="User icon"
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="input-wrapper">
                  <Image
                    src="/icons/password.svg"
                    width={20}
                    height={20}
                    alt="Password icon"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`animated-button ${hovered ? "hovered" : ""}`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  Είσοδος
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
