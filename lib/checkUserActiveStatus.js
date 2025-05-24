const { getSupabase } = require("../lib/supabaseBot");

async function checkGiveawayWinners(client) {
  const supabase = getSupabase();
  const now = new Date().toISOString();

  const { data: giveaways, error } = await supabase
    .from("giveaways")
    .select("*")
    .eq("status", "active")
    .lte("ends_at", now);

  if (error) {
    return console.error("[Supabase Error]", error);
  }

  if (!giveaways.length) return;

  for (const giveaway of giveaways) {
    const participants = giveaway.participants || [];

    if (participants.length === 0) {
      await supabase.from("logs").insert([
        {
          type: "giveaway_end",
          data: {
            giveaway_id: giveaway.id,
            prize: giveaway.prize,
            ended_by: "auto",
            winner: null,
            reason: "no_participants",
          },
        },
      ]);
    } else {
      const winner =
        participants[Math.floor(Math.random() * participants.length)];

      await supabase.from("logs").insert([
        {
          type: "giveaway_end",
          data: {
            giveaway_id: giveaway.id,
            prize: giveaway.prize,
            ended_by: "auto",
            winner,
          },
        },
      ]);
    }

    await supabase
      .from("giveaways")
      .update({ status: "ended" })
      .eq("id", giveaway.id);
  }
}

module.exports = checkGiveawayWinners;
