import { SessionProvider } from "next-auth/react";
import BackgroundStars from "@/components/BackgroundStars";
import "../styles/globals.css";
import "../styles/fonts.css";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <BackgroundStars />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  );
}