import BackgroundStars from "@/components/BackgroundStars";
import HomeContent from "@/components/HomeContent";
import AddBotButton from "@/components/AddBotButton";

export default function Home() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <BackgroundStars />
      <HomeContent />
      <AddBotButton />
    </div>
  );
}