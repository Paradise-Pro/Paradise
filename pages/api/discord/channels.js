export default async function handler(req, res) {
  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

  if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
    return res
      .status(500)
      .json({ error: "Missing Discord bot token or guild ID" });
  }

  try {
    const discordRes = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/channels`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    if (!discordRes.ok) {
      const error = await discordRes.json();
      return res
        .status(discordRes.status)
        .json({ error: error.message || "Failed to fetch channels" });
    }

    const allChannels = await discordRes.json();
    const textChannels = allChannels
      .filter((ch) => ch.type === 0)
      .map((ch) => ({
        id: ch.id,
        name: ch.name,
      }));

    return res.status(200).json(textChannels);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected error" });
  }
}
