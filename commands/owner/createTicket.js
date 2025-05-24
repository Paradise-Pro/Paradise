const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createticket")
    .setDescription("📬 Δημιουργία ticket για υποστήριξη ή αναφορά."),

  async execute(interaction) {
    const userId = interaction.user.id;
    const ownerId = process.env.DISCORD_OWNER_ID;
    const adminIds = (process.env.DISCORD_ADMIN_IDS || "").split(",");

    const isOwner = userId === ownerId;
    const isAdmin = adminIds.includes(userId);

    const embed = new EmbedBuilder()
      .setTitle("📬 Νέο Ticket Υποστήριξης")
      .setDescription(
        [
          "Είμαστε εδώ για να σε βοηθήσουμε! 🎯",
          "",
          "📂 **Επέλεξε μια από τις παρακάτω κατηγορίες** ώστε να ξεκινήσεις τη διαδικασία δημιουργίας ticket.",
        ].join("\n")
      )
      .setColor(0x00bfff)
      .setThumbnail("http://localhost:3000/logo.png")
      .setFooter({ text: "🌴 Paradise Support System." });

    const options = [
      ...(isOwner
        ? [
            {
              label: "🛒 Αγορά",
              value: "order",
              description: "Βοήθεια σχετική με αγορές ή παραγγελίες.",
            },
            {
              label: "🛡️ Αναφορά Staff",
              value: "report_staff",
              description: "Αναφορά μέλους της ομάδας.",
            },
          ]
        : []),
      ...(isOwner || isAdmin
        ? [
            {
              label: "📩 Αναφορά Χρήστη",
              value: "report_user",
              description: "Αναφορά χρήστη.",
            },
            {
              label: "❓ Άλλο",
              value: "other",
              description: "Οτιδήποτε άλλο θέμα ή απορία.",
            },
          ]
        : []),
    ];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select_ticket_category")
      .setPlaceholder("⬇️ Επέλεξε κατηγορία...")
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
