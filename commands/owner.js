const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("owner")
    .setDescription("Owner-only command"),
  async execute(interaction) {
    if (interaction.user.id !== process.env.DISCORD_OWNER_ID) {
      return interaction.reply({
        content: "❌ Only the bot owner can use this command.",
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.reply("👑 Owner command executed.");
  },
};
