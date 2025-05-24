const {
  Events,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { v4: uuidv4 } = require("uuid");
const { getSupabase } = require("../lib/supabaseBot");
const createTimestampFooter = require("../functions/createTimestampFooter");

module.exports = {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction, client) {
    const supabase = getSupabase();

    // ✅ Slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error("❌ Error executing command:", error);
        const reply = {
          content: "❌ Σφάλμα κατά την εκτέλεση της εντολής.",
          flags: MessageFlags.Ephemeral,
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply).catch(() => {});
        } else {
          await interaction.reply(reply).catch(() => {});
        }
      }
    }

    // ✅ Ticket category select
    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "select_ticket_category"
    ) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const category = interaction.values[0];
      const userId = interaction.user.id;
      const username = interaction.user.username
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const channelName = `ticket-${username}-${userId}`;
      const ticketId = uuidv4();

      const ownerId = process.env.DISCORD_OWNER_ID;
      const rawAdminIds = process.env.DISCORD_ADMIN_IDS || "";
      const adminIds = rawAdminIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => /^[0-9]{17,20}$/.test(id));

      const visibility = (() => {
        if (category === "order" || category === "report_staff")
          return ["owner"];
        if (category === "report_user" || category === "other")
          return ["owner", "staff"];
        return ["owner"];
      })();

      await interaction.guild.members.fetch();

      const existingChannel = interaction.guild.channels.cache.find(
        (ch) => ch.name === channelName
      );

      if (existingChannel) {
        return interaction.editReply({
          content: `⚠️ Έχεις ήδη ένα ανοιχτό ticket: <#${existingChannel.id}>`,
        });
      }

      const permissionOverwrites = [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: userId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
          ],
        },
        ...(ownerId
          ? [
              {
                id: ownerId,
                allow: [PermissionFlagsBits.ViewChannel],
              },
            ]
          : []),
        ...(visibility.includes("staff")
          ? adminIds.map((id) => ({
              id,
              allow: [PermissionFlagsBits.ViewChannel],
            }))
          : []),
      ];

      const ticketChannel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: process.env.TICKETS_CATEGORY_ID,
        permissionOverwrites,
      });

      await supabase.from("tickets").insert([
        {
          id: ticketId,
          title: `Ticket από ${interaction.user.username}`,
          description: "",
          category,
          created_by: userId,
          visibility,
          status: "open",
          channel_id: ticketChannel.id,
        },
      ]);

      let footerText = "";
      if (category === "order" || category === "report_staff") {
        footerText = "🛈 Αυτή η κατηγορία είναι ορατή μόνο στον ιδιοκτήτη.";
      } else if (category === "report_user" || category === "other") {
        footerText =
          "🛈 Αυτή η κατηγορία είναι ορατή στον ιδιοκτήτη και στο προσωπικό.";
      }

      const embed = new EmbedBuilder()
        .setTitle("📬 Νέο Ticket")
        .setDescription(
          `Παρακαλώ περιέγραψε το πρόβλημά σου εδώ.\n\nΚατηγορία: **${category}**`
        )
        .setColor(0x00ae86)
        .setFooter({ text: footerText });

      const closeButton = new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("🔒 Κλείσιμο Ticket")
        .setStyle(ButtonStyle.Danger);

      const actionRow = new ActionRowBuilder().addComponents(closeButton);

      await ticketChannel.send({
        embeds: [embed],
        components: [actionRow],
      });

      await interaction.editReply({
        content: `✅ Το ticket σου δημιουργήθηκε: <#${ticketChannel.id}>`,
      });
    }

    // ✅ Close Ticket button
    if (interaction.isButton() && interaction.customId === "close_ticket") {
      const channel = interaction.channel;

      await interaction.reply({
        content: "🔒 Το ticket θα κλείσει σε 5 δευτερόλεπτα...",
        flags: MessageFlags.Ephemeral,
      });

      await supabase
        .from("tickets")
        .update({ status: "closed", closed_at: new Date().toISOString() })
        .eq("channel_id", channel.id);

      setTimeout(() => {
        channel.delete().catch(console.error);
      }, 5000);
    }

    // ✅ Giveaway Join Button
    if (
      interaction.isButton() &&
      interaction.customId.startsWith("join_giveaway_")
    ) {
      const giveawayId = interaction.customId.split("join_giveaway_")[1];
      const userId = interaction.user.id;

      const { data: giveaway, error } = await supabase
        .from("giveaways")
        .select("participants")
        .eq("id", giveawayId)
        .single();

      if (error || !giveaway) {
        return interaction.reply({
          content: "❌ Αυτό το giveaway δεν βρέθηκε ή έχει λήξει.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const alreadyJoined = giveaway.participants.some((p) => p.id === userId);
      if (alreadyJoined) {
        return interaction.reply({
          content: "⚠️ Έχεις ήδη συμμετάσχει σε αυτό το giveaway!",
          flags: MessageFlags.Ephemeral,
        });
      }

      const member = await interaction.guild.members.fetch(userId);

      const displayName =
        member.displayName || member.user.globalName || member.user.username;
      const tag =
        member.user.discriminator === "0"
          ? member.user.username
          : `${member.user.username}#${member.user.discriminator}`;

      const newParticipant = {
        id: userId,
        tag,
        avatar: member.user.avatar,
        display_name: displayName,
      };

      const updatedParticipants = [...giveaway.participants, newParticipant];

      await supabase
        .from("giveaways")
        .update({ participants: updatedParticipants })
        .eq("id", giveawayId);

      await interaction.reply({
        content: "🎉 Η συμμετοχή σου καταχωρήθηκε!",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
