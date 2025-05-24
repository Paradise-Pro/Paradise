const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { getSupabase } = require("../../lib/supabaseBot");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveawaycancel")
    .setDescription("❌ Ακύρωση giveaway.")
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
      const { data: giveaway, error } = await supabase
        .from("giveaways")
        .update({ status: "cancelled" })
        .eq("id", giveawayId)
        .select()
        .single();

      if (error || !giveaway) {
        return interaction.reply({
          content: "❌ Σφάλμα ή δεν βρέθηκε.",
          flags: MessageFlags.Ephemeral,
        });
      }

      await supabase.from("logs").insert([
        {
          type: "giveaway_cancel",
          data: {
            giveaway_id: giveawayId,
            cancelled_by: `${interaction.user.username}#${interaction.user.discriminator}`,
            prize: giveaway.prize,
            creator_id: giveaway.creator_id,
            creator: giveaway.creator,
            creator_avatar: giveaway.creator_avatar,
          },
        },
      ]);

      await interaction.reply({
        content: `🎁 Το giveaway ακυρώθηκε.`,
      });
    } catch (err) {
      console.error("[GIVEAWAY_CANCEL_ERROR]", err);
      await interaction.reply({
        content: "⚠️ Σφάλμα κατά την ακύρωση.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
