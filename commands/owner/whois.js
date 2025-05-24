const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("🔎 Αναγνωρίζει έναν χρήστη από ένα στοιχείο εισόδου.")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Βάλε ένα ID ή κάποιο άλλο στοιχείο")
        .setRequired(true)
    ),

  async execute(interaction) {
    const input = interaction.options.getString("input");
    const ownerId = process.env.DISCORD_OWNER_ID;
    const adminIds = (process.env.DISCORD_ADMIN_IDS || "")
      .split(",")
      .map((id) => id.trim());

    const isOwner = interaction.user.id === ownerId;
    const isAdmin = adminIds.includes(interaction.user.id);

    if (!isOwner && !isAdmin) {
      return interaction.reply({
        content: "❌ Δεν έχεις άδεια για αυτή την εντολή.",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      const user = await interaction.client.users.fetch(input);
      return interaction.reply({
        content: `🔎 Χρήστης: **${user.tag}** (ID: \`${user.id}\`)`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      return interaction.reply({
        content: "⚠️ Δεν βρέθηκε χρήστης με αυτό το στοιχείο.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
