import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BackgroundStars from "@/components/BackgroundStars";
import HomeContent from "@/components/HomeContent";
import AddBotButton from "@/components/AddBotButton";

export default function HomePage() {
  const router = useRouter();
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    const allowed = localStorage.getItem("hasAccess");
    if (allowed === "true") {
      setAccessGranted(true);
    } else {
      router.replace("/"); // redirect πίσω στο login αν δεν έχεις πρόσβαση
    }
  }, []);

  if (!accessGranted) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <BackgroundStars />
      <HomeContent />
      <AddBotButton />
    </div>
  );
}
