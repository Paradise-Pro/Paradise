const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { getSupabase } = require("../../lib/supabaseBot");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveawayreroll")
    .setDescription("🎲 Κάνει reroll για ένα giveaway")
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

    const { data: giveaway, error } = await supabase
      .from("giveaways")
      .select("participants, prize")
      .eq("id", giveawayId)
      .single();

    if (error || !giveaway) {
      return interaction.reply({
        content: "❌ Δεν βρέθηκε το giveaway.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const participants = giveaway.participants || [];

    if (participants.length === 0) {
      return interaction.reply({
        content: "⚠️ Δεν υπάρχουν συμμετέχοντες.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const winner =
      participants[Math.floor(Math.random() * participants.length)];

    const { data: existingLogs } = await supabase
      .from("logs")
      .select("*")
      .eq("type", "giveaway_end")
      .order("timestamp", { ascending: false });

    const existingLog = existingLogs.find(
      (log) => log.data?.giveaway_id === giveawayId
    );

    if (existingLog) {
      await supabase
        .from("logs")
        .update({
          data: {
            ...existingLog.data,
            winner: {
              id: winner.id,
              tag: winner.tag,
              avatar: winner.avatar || null,
              banner: winner.banner || null,
            },
          },
        })
        .eq("id", existingLog.id);
    } else {
      await supabase.from("logs").insert([
        {
          type: "giveaway_end",
          data: {
            giveaway_id: giveawayId,
            prize_name: giveaway.prize,
            winner: {
              id: winner.id,
              tag: winner.tag,
              avatar: winner.avatar || null,
              banner: winner.banner || null,
            },
          },
        },
      ]);
    }

    const embed = new EmbedBuilder()
      .setTitle("🔁 Νέος Νικητής Giveaway")
      .setDescription(
        `🎉 Ο νέος νικητής για το giveaway **${giveaway.prize}** είναι:\n\n👑 <@${winner.id}> (\`${winner.tag}\`)`
      )
      .setColor("Green");

    await interaction.reply({
      embeds: [embed],
    });
  },
};
