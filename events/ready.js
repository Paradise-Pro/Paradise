const { REST, Routes } = require("discord.js");

module.exports = {
  once: true,
  async execute(client) {
    const commands = client.commands
      .filter(cmd => typeof cmd.data?.toJSON === "function")
      .map(cmd => cmd.data.toJSON());

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

    try {
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands }
      );
      console.log("✅ Slash commands registered.");
    } catch (error) {
      console.error("❌ Failed to register slash commands:", error);
    }

    console.log(`🤖 Bot is online as ${client.user.tag}`);
  },
};