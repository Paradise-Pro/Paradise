const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Admin-only command"),
  async execute(interaction) {
    const adminIds = process.env.DISCORD_ADMIN_IDS.split(",");

    if (!adminIds.includes(interaction.user.id)) {
      return interaction.reply({
        content: "❌ You are not an admin.",
        flags: MessageFlags.Ephemeral
      });
    }

    await interaction.reply("✅ Admin command executed.");
  },
};