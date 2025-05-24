const { getSupabase } = require("../lib/supabaseBot");
const { EmbedBuilder } = require("discord.js");

async function checkGiveawayWinners(client) {
  const supabase = getSupabase();
  const now = new Date().toISOString();

  // 🎯 Τράβα μόνο όσα δεν επεξεργάζονται ήδη
  const { data: giveaways, error } = await supabase
    .from("giveaways")
    .select("*")
    .eq("status", "active")
    .eq("processing", false)
    .lte("ends_at", now);

  if (error) {
    return console.error("[Supabase Error]", error);
  }

  if (!giveaways.length) return;

  for (const giveaway of giveaways) {
    const participants = giveaway.participants || [];

    // ✅ Μπλοκάρουμε το giveaway αμέσως
    await supabase
      .from("giveaways")
      .update({ processing: true })
      .eq("id", giveaway.id);

    if (participants.length === 0) {
      await supabase
        .from("giveaways")
        .update({ status: "ended", processing: false })
        .eq("id", giveaway.id);

      await supabase.from("logs").insert([
        {
          type: "giveaway_end",
          data: {
            giveaway_id: giveaway.id,
            prize: giveaway.prize,
            ended_by: "auto",
            winner: null,
            reason: "no_participants",
            creator_id: giveaway.creator_id,
            prize_name: giveaway.prize,
          },
        },
      ]);

      try {
        const giveawayChannelId = process.env.DISCORD_GIVEAWAY_CHANNEL_ID;
        const channel = await client.channels.fetch(giveawayChannelId);

        if (channel?.isTextBased()) {
          const noWinnerEmbed = new EmbedBuilder()
            .setTitle("😢 Giveaway Ολοκληρώθηκε Χωρίς Συμμετοχές")
            .setDescription(
              `📦 Το giveaway με έπαθλο **${giveaway.prize}** έληξε χωρίς συμμετοχές.\n\n💡 Καλύτερη τύχη την επόμενη φορά!`
            )
            .setColor("Red")
            .setThumbnail(
              "https://cdn-icons-png.flaticon.com/512/4712/4712102.png"
            )
            .setFooter({ text: "🎉 Paradise Giveaways" });

          await channel.send({ embeds: [noWinnerEmbed] });
        }
      } catch (err) {
        console.warn(
          "⚠️ Δεν μπόρεσα να στείλω μήνυμα για το giveaway χωρίς συμμετοχές",
          err
        );
      }

      continue;
    }

    const winner =
      participants[Math.floor(Math.random() * participants.length)];

    console.log(`🏆 Winner selected: ${winner.tag} (${winner.id})`);

    await supabase
      .from("giveaways")
      .update({ status: "ended", processing: false })
      .eq("id", giveaway.id);

    await supabase.from("logs").insert([
      {
        type: "giveaway_end",
        data: {
          giveaway_id: giveaway.id,
          prize: giveaway.prize,
          ended_by: "auto",
          winner: {
            id: winner.id,
            tag: winner.tag,
            avatar: winner.avatar || null,
            banner: winner.banner || null,
            display_name: winner.display_name || null,
          },
          creator_id: giveaway.creator_id,
          prize_name: giveaway.prize,
        },
      },
    ]);

    try {
      const user = await client.users.fetch(winner.id);

      const dmEmbed = new EmbedBuilder()
        .setTitle("🎉 Κέρδισες το Giveaway!")
        .setDescription(
          `🥳 Συγχαρητήρια! Είσαι ο νικητής για το έπαθλο **${giveaway.prize}**!\n\n🎫 Άνοιξε ένα ticket στην επιλογή ❓ Άλλο για να παραλάβεις το δώρο σου.`
        )
        .setColor("Blurple")
        .setThumbnail(
          winner.avatar
            ? `https://cdn.discordapp.com/avatars/${winner.id}/${winner.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${
                parseInt(winner.id) % 5
              }.png`
        )
        .addFields({ name: "🎁 Έπαθλο", value: giveaway.prize })
        .setFooter({ text: "🎉 Ευχαριστούμε που συμμετείχες!" });

      await user.send({ embeds: [dmEmbed] });
    } catch (err) {
      console.warn(`⚠️ Δεν μπόρεσα να στείλω DM στον νικητή ${winner.tag}`);
    }

    try {
      const giveawayChannelId = process.env.DISCORD_GIVEAWAY_CHANNEL_ID;
      const channel = await client.channels.fetch(giveawayChannelId);

      if (channel?.isTextBased()) {
        const winnerEmbed = new EmbedBuilder()
          .setTitle("🏆 Νικητής Giveaway!")
          .setDescription(
            `🎉 Το giveaway με έπαθλο **${giveaway.prize}** ολοκληρώθηκε με επιτυχία!\n\n🎫 Ο νικητής μπορεί να ανοίξει ticket στην επιλογή ❓ Άλλο για την παραλαβή του δώρου του.`
          )
          .addFields(
            {
              name: "👑 Νικητής",
              value: `<@${winner.id}> (${winner.tag})`,
              inline: true,
            },
            { name: "🆔 User", value: winner.id, inline: true }
          )
          .setThumbnail(
            winner.avatar
              ? `https://cdn.discordapp.com/avatars/${winner.id}/${winner.avatar}.png`
              : `https://cdn.discordapp.com/embed/avatars/${
                  parseInt(winner.id) % 5
                }.png`
          )
          .setColor("Green")
          .setFooter({ text: "🎉 Συγχαρητήρια στον νικητή!" });

        await channel.send({ embeds: [winnerEmbed] });
      }
    } catch (err) {
      console.warn(
        "⚠️ Δεν βρέθηκε ή δεν ήταν προσβάσιμο το κανάλι των giveaways.",
        err
      );
    }
  }
}

module.exports = checkGiveawayWinners;
