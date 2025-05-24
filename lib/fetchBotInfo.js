export async function fetchBotInfo() {
  try {
    const res = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch bot info");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching bot info:", error);
    return null;
  }
}
