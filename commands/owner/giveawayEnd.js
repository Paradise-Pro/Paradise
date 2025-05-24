const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { getSupabase } = require("../../lib/supabaseBot");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveawayend")
    .setDescription("🧨 Τερματισμός giveaway.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("📌 ID του giveaway από τη βάση δεδομένων")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== process.env.DISCORD_OWNER_ID) {
      return interaction.reply({
        content: "❌ Δεν έχεις άδεια.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const supabase = getSupabase();
    const giveawayId = interaction.options.getString("id");

    try {
      const { data: giveaway, error: fetchError } = await supabase
        .from("giveaways")
        .select("*")
        .eq("id", giveawayId)
        .single();

      if (fetchError || !giveaway) {
        return interaction.reply({
          content: "❌ Δεν βρέθηκε το συγκεκριμένο giveaway.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const { error: updateError } = await supabase
        .from("giveaways")
        .update({ status: "ended" })
        .eq("id", giveawayId);

      if (updateError) {
        return interaction.reply({
          content: "⚠️ Αποτυχία κατά την ενημέρωση του giveaway.",
          flags: MessageFlags.Ephemeral,
        });
      }

      await supabase.from("logs").insert([
        {
          type: "giveaway_end",
          data: {
            giveaway_id: giveawayId,
            ended_by: `${interaction.user.username}#${interaction.user.discriminator}`,
            prize: giveaway.prize,
            creator_id: giveaway.creator_id,
            prize_name: giveaway.prize,
          },
        },
      ]);

      const embed = new EmbedBuilder()
        .setTitle("📌 Τερματισμός Giveaway")
        .setDescription(
          `🎁 Το giveaway για **${giveaway.prize}** τερματίστηκε από τον owner.`
        )
        .setColor("Red");

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error("[GIVEAWAY_END_ERROR]", err);
      await interaction.reply({
        content: "⚠️ Γενικό σφάλμα κατά την επεξεργασία.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
