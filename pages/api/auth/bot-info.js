export default async function handler(req, res) {
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "Bot token missing in environment" });
  }

  try {
    const discordRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bot ${token}`,
      },
    });

    if (!discordRes.ok) {
      throw new Error("Failed to fetch bot info from Discord");
    }

    const data = await discordRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Bot info fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
