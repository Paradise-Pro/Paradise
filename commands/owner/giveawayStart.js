const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require("discord.js");
const { getSupabase } = require("../../lib/supabaseBot");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveawaystart")
    .setDescription("🎉 Δημιουργία giveaway για τον server.")
    .addStringOption((option) =>
      option
        .setName("prize")
        .setDescription("Το δώρο του giveaway")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription(
          "Διάρκεια σε λεπτά (π.χ. 10 = 10 λεπτά, 60 = 1 ώρα, 1440 = 1 ημέρα)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Περιγραφή του giveaway")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== process.env.DISCORD_OWNER_ID) {
      return interaction.reply({
        content: "❌ Δεν έχεις άδεια να χρησιμοποιήσεις αυτή την εντολή.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const supabase = getSupabase();
    const prize = interaction.options.getString("prize");
    const duration = interaction.options.getInteger("duration");
    const description = interaction.options.getString("description");
    const endsAt = new Date(Date.now() + duration * 60000);

    try {
      const member = await interaction.guild.members.fetch(interaction.user.id);

      const displayName =
        member.displayName || member.user.globalName || member.user.username;

      const tag =
        member.user.discriminator === "0"
          ? member.user.username
          : `${member.user.username}#${member.user.discriminator}`;

      const { data: giveaway, error } = await supabase
        .from("giveaways")
        .insert([
          {
            prize,
            description,
            creator_id: member.user.id,
            creator_tag: tag,
            creator_avatar: member.user.avatar,
            ends_at: endsAt,
            status: "active",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await supabase.from("logs").insert([
        {
          type: "giveaway_start",
          data: {
            giveaway_id: giveaway.id,
            prize,
            description,
            creator_display_name: displayName,
            creator: tag,
            creator_id: member.user.id,
            creator_avatar: member.user.avatar,
          },
        },
      ]);

      const endsAtText = endsAt.toLocaleString("el-GR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const embed = new EmbedBuilder()
        .setTitle("🎉 Giveaway ξεκίνησε!")
        .setColor("Blurple")
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setDescription(description)
        .addFields(
          { name: "🎁 Έπαθλο", value: prize, inline: true },
          {
            name: "⏳ Ημερομηνία Λήξης",
            value: `📅 ${endsAtText}`,
            inline: false,
          }
        )
        .setFooter({
          text: "📌 Πάτησε το κουμπί για συμμετοχή",
        });

      const button = new ButtonBuilder()
        .setCustomId(`join_giveaway_${giveaway.id}`)
        .setLabel("🎉 Join Giveaway")
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.reply({ embeds: [embed], components: [row] });
    } catch (err) {
      console.error("[GIVEAWAY_START_ERROR]", err);
      await interaction.reply({
        content: "⚠️ Σφάλμα κατά την εκκίνηση του giveaway.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
