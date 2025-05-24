const { REST, Routes } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const commandList = client.commands.filter(
      (cmd) => typeof cmd.data?.toJSON === "function"
    );

    console.log(`📦 Φορτώθηκαν ${commandList.size} εντολές:`);
    for (const cmd of commandList.values()) {
      console.log(`➡️ /${cmd.data.name}`);
    }

    const commands = commandList.map((cmd) => cmd.data.toJSON());
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_BOT_TOKEN
    );

    try {
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands }
      );
      console.log("✅ Οι slash commands καταχωρήθηκαν στο Discord.");
    } catch (error) {
      console.error("❌ Απέτυχε η εγγραφή των slash commands:", error);
    }

    console.log(`🤖 Bot είναι online ως ${client.user.tag}`);
  },
};
