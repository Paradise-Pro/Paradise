const {
  ChannelType,
  EmbedBuilder,
  Events,
  AuditLogEvent,
} = require("discord.js");

const { getSupabase } = require("../lib/supabaseBot");
const { v4: uuidv4 } = require("uuid");
const supabase = getSupabase();
const createTimestampFooter = require("../functions/createTimestampFooter");
const handleLogEmbed = require("../embeds/handleLogEmbeds");

module.exports.registerEventHandlers = (client) => {
  // ========== Guild Create ==========
  client.on("guildCreate", async (guild) => {
    const logChannel = client.channels.cache.get(
      process.env.GUILD_CREATE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle("🆕 Joined New Server")
      .setDescription(`Το bot μπήκε στο server **${guild.name}**.`)
      .addFields(
        { name: "🆔 Server:", value: guild.id, inline: true },
        { name: "👥 Μέλη:", value: `${guild.memberCount}`, inline: true }
      )
      .setThumbnail(guild.iconURL({ dynamic: true }) || "")
      .setFooter({ text: createTimestampFooter() });

    logChannel.send({ embeds: [embed] });
  });

  // ========== Guild Delete ==========
  client.on("guildDelete", async (guild) => {
    const logChannel = client.channels.cache.get(
      process.env.GUILD_DELETE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0xff4444)
      .setTitle("❌ Removed From Server")
      .setDescription(`Το bot αφαιρέθηκε από τον server **${guild.name}**.`)
      .addFields({ name: "🆔 Server:", value: guild.id, inline: true })
      .setThumbnail(guild.iconURL({ dynamic: true }) || "")
      .setFooter({ text: createTimestampFooter() });

    logChannel.send({ embeds: [embed] });
  });

  // ========== Message Create ==========
  client.on(Events.MessageCreate, async (message) => {
    if (
      !message.guild ||
      !message.author ||
      message.author.bot ||
      !message.content
    )
      return;

    const member = await message.guild.members
      .fetch(message.author.id)
      .catch(() => null);

    const logChannel = client.channels.cache.get(
      process.env.MESSAGE_CREATE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const roles =
      member?.roles?.cache
        ?.filter((role) => role.id !== message.guild.id)
        ?.map((role) => `<@&${role.id}>`)
        ?.join(", ") || "Κανένας";

    const embed = await handleLogEmbed("messageCreate", {
      user: message.author,
      member,
      guild: message.guild,
      channel: message.channel,
      title: "🆕 Message Created",
      description: `**Δημιουργήθηκε νέο μήνυμα στο κανάλι <#${
        message.channel.id
      }>:**\n📄 Περιεχόμενο: ${message.content?.slice(0, 1024) || "*Άδειο*"}`,
    });

    await logChannel.send({ embeds: [embed] });
  });

  // ========== Message Create for Ticket==========
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.channel.name.startsWith("ticket-")) {
      // 🔹 Save first message as description if not already saved
      const { data: existing, error } = await supabase
        .from("tickets")
        .select("description")
        .eq("channel_id", message.channel.id)
        .single();

      if (error) return console.error("Supabase fetch error:", error);
      if (!existing || !existing.description) {
        const { error: updateError } = await supabase
          .from("tickets")
          .update({ description: message.content })
          .eq("channel_id", message.channel.id);

        if (updateError)
          console.error("Failed to update ticket description:", updateError);
        else
          console.log(
            `📌 Description added to ticket (${message.channel.name})`
          );
      }

      // 🔹 Log every message into ticket_messages
      const tag =
        message.author.discriminator === "0"
          ? message.author.username
          : `${message.author.username}#${message.author.discriminator}`;

      const avatar = message.author.displayAvatarURL({ extension: "png" });

      const { error: insertError } = await supabase
        .from("ticket_messages")
        .insert([
          {
            id: uuidv4(),
            channel_id: message.channel.id,
            author_id: message.author.id,
            author_tag: tag,
            avatar,
            content: message.content,
          },
        ]);

      if (insertError) {
        console.error("❌ Failed to insert ticket message:", insertError);
      }
    }
  });

  // ========== Message Delete ==========
  client.on(Events.MessageDelete, async (message) => {
    if (
      !message.guild ||
      !message.author ||
      message.author.bot ||
      !message.content
    )
      return;

    const member = await message.guild.members
      .fetch(message.author.id)
      .catch(() => null);

    const logChannel = client.channels.cache.get(
      process.env.MESSAGE_DELETE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const embed = await handleLogEmbed("messageDelete", {
      user: message.author,
      member,
      guild: message.guild,
      channel: message.channel,
      title: "🗑️ Message Deleted",
      description: `**Το παρακάτω μήνυμα διαγράφηκε:**\n📄 ${
        message.content?.slice(0, 1024) || "*Empty*"
      }\n\n⚠️ *Σημείωση: Το Discord API δεν επιτρέπει την ασφαλή αναγνώριση του χρήστη που διέγραψε το μήνυμα.*`,
    });

    await logChannel.send({ embeds: [embed] });
  });

  // ========== Message Update ==========
  client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (
      !newMessage.guild ||
      !newMessage.author ||
      newMessage.author.bot ||
      oldMessage.content === newMessage.content
    )
      return;

    const member = await newMessage.guild.members
      .fetch(newMessage.author.id)
      .catch(() => null);

    const logChannel = client.channels.cache.get(
      process.env.MESSAGE_UPDATE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const embed = await handleLogEmbed("messageUpdate", {
      user: newMessage.author,
      member,
      guild: newMessage.guild,
      channel: newMessage.channel,
      title: "✏️ Message Edited",
      description: `**Έγινε επεξεργασία μηνύματος:**\n\n📤 Παλαιό περιεχόμενο:\n${
        oldMessage.content?.slice(0, 1024) || "*Άδειο*"
      }\n\n📥 Νέο περιεχόμενο:\n${
        newMessage.content?.slice(0, 1024) || "*Άδειο*"
      }\n\n⚠️ *Σημείωση: Το Discord API δεν παρέχει πληροφορίες για το ποιος έκανε την επεξεργασία σε σύνολο edits ή embeds.*`,
    });

    await logChannel.send({ embeds: [embed] });
  });

  // ========== Guild Member Add ==========
  client.on("guildMemberAdd", async (member) => {
    const logChannel = member.guild.channels.cache.get(
      process.env.DISCORD_JOIN_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const embed = await handleLogEmbed("guildMemberAdd", {
      member,
      guild: member.guild,
      channel: logChannel,
    });

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // ========== Guild Member Remove ==========
  client.on("guildMemberRemove", async (member) => {
    const logChannel = member.guild.channels.cache.get(
      process.env.DISCORD_LEAVE_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const embed = await handleLogEmbed("guildMemberRemove", {
      member,
      guild: member.guild,
      channel: logChannel,
    });

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // ========== Guild Member Update ==========
  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (oldMember.user.bot) return;

    const logChannel = oldMember.guild.channels.cache.get(
      process.env.MEMBER_UPDATE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    // Detect nickname change
    if (oldMember.nickname !== newMember.nickname) {
      const embed = await handleLogEmbed("nicknameUpdate", {
        user: newMember.user,
        member: newMember,
        guild: newMember.guild,
        channel: logChannel,
        title: "🧾 Nickname Updated",
        description: `Το nickname του χρήστη <@${
          newMember.id
        }> άλλαξε:\n\n📤 Παλαιό: \`${
          oldMember.nickname || oldMember.user.username
        }\`\n📥 Νέο: \`${newMember.nickname || newMember.user.username}\``,
      });
      await logChannel.send({ embeds: [embed] });
      return;
    }

    // Detect role changes
    const oldRoles = oldMember.roles.cache.map((r) => r.id);
    const newRoles = newMember.roles.cache.map((r) => r.id);

    const addedRoles = newRoles.filter((r) => !oldRoles.includes(r));
    const removedRoles = oldRoles.filter((r) => !newRoles.includes(r));

    if (addedRoles.length || removedRoles.length) {
      const added = addedRoles.map((id) => `<@&${id}>`).join(", ") || "Καμία";
      const removed =
        removedRoles.map((id) => `<@&${id}>`).join(", ") || "Καμία";

      const embed = await handleLogEmbed("roleUpdate", {
        user: newMember.user,
        member: newMember,
        guild: newMember.guild,
        channel: logChannel,
        title: "🎭 Roles Updated",
        description: `Οι ρόλοι του <@${newMember.id}> άλλαξαν:\n\n➕ Προστέθηκαν: ${added}\n➖ Αφαιρέθηκαν: ${removed}`,
      });
      await logChannel.send({ embeds: [embed] });
    }
  });

  // ========== Channel Create ==========
  client.on("channelCreate", async (channel) => {
    const logChannel = channel.guild?.channels.cache.get(
      process.env.CHANNEL_CREATE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle("📡 Channel Created")
      .setDescription(`Δημιουργήθηκε το κανάλι <#${channel.id}>`)
      .addFields(
        { name: "📛 Όνομα:", value: `\`${channel.name}\``, inline: true },
        { name: "🆔:", value: channel.id, inline: true }
      )
      .setThumbnail(channel.guild.iconURL({ dynamic: true }) || "")
      .setFooter({ text: createTimestampFooter() });

    logChannel.send({ embeds: [embed] });
  });

  // ========== Channel Delete ==========
  client.on("channelDelete", async (channel) => {
    const logChannel = channel.guild?.channels.cache.get(
      process.env.CHANNEL_DELETE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle("🗑️ Channel Deleted")
      .setDescription(`Διαγράφηκε το κανάλι \`${channel.name}\``)
      .addFields({ name: "🆔:", value: channel.id, inline: true })
      .setThumbnail(channel.guild.iconURL({ dynamic: true }) || "")
      .setFooter({ text: createTimestampFooter() });

    logChannel.send({ embeds: [embed] });
  });

  // ========== Channel Update ==========
  client.on("channelUpdate", async (oldChannel, newChannel) => {
    const logChannel = newChannel.guild?.channels.cache.get(
      process.env.CHANNEL_UPDATE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const changes = [];

    if (oldChannel.name !== newChannel.name)
      changes.push(`📛 Όνομα: \`${oldChannel.name}\` → \`${newChannel.name}\``);

    if ("topic" in oldChannel && oldChannel.topic !== newChannel.topic)
      changes.push(
        `📝 Περιγραφή: \`${oldChannel.topic || "Καμία"}\` → \`${
          newChannel.topic || "Καμία"
        }\``
      );

    if ("nsfw" in oldChannel && oldChannel.nsfw !== newChannel.nsfw)
      changes.push(`🔞 NSFW: \`${oldChannel.nsfw}\` → \`${newChannel.nsfw}\``);

    if (!changes.length) return;

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle("✏️ Channel Updated")
      .setDescription(
        `Το κανάλι <#${newChannel.id}> ενημερώθηκε:\n\n${changes.join("\n")}`
      )
      .addFields({ name: "🆔:", value: newChannel.id, inline: true })
      .setThumbnail(newChannel.guild.iconURL({ dynamic: true }) || "")
      .setFooter({ text: createTimestampFooter() });

    logChannel.send({ embeds: [embed] });
  });

  // ========== Message Reaction Add ==========
  client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot || !reaction.message.guild) return;

    const logChannel = reaction.message.guild.channels.cache.get(
      process.env.MESSAGE_REACTION_ADD_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const embed = await handleLogEmbed("reactionAdd", {
      user,
      guild: reaction.message.guild,
      channel: reaction.message.channel,
      title: "😀 Reaction Added",
      description: `Ο χρήστης <@${user.id}> πρόσθεσε την αντίδραση ${reaction.emoji} στο μήνυμα:\n[Jump to message](${reaction.message.url})`,
      emoji: reaction.emoji,
    });

    await logChannel.send({ embeds: [embed] });
  });

  // ========== Message Reaction Remove ==========
  client.on("messageReactionRemove", async (reaction, user) => {
    if (user.bot || !reaction.message.guild) return;

    const logChannel = reaction.message.guild.channels.cache.get(
      process.env.MESSAGE_REACTION_REMOVE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const embed = await handleLogEmbed("reactionRemove", {
      user,
      guild: reaction.message.guild,
      channel: reaction.message.channel,
      title: "😶 Reaction Removed",
      description: `Ο χρήστης <@${user.id}> αφαίρεσε την αντίδραση ${reaction.emoji} από το μήνυμα:\n[Jump to message](${reaction.message.url})`,
      emoji: reaction.emoji,
    });

    await logChannel.send({ embeds: [embed] });
  });

  // ========== Guild Update ==========
  client.on("guildUpdate", async (oldGuild, newGuild) => {
    const logChannel = newGuild.channels.cache.get(
      process.env.GUILD_UPDATE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const changes = [];

    if (oldGuild.name !== newGuild.name)
      changes.push(`📛 Όνομα: \`${oldGuild.name}\` → \`${newGuild.name}\``);

    if (oldGuild.verificationLevel !== newGuild.verificationLevel)
      changes.push(
        `✅ Verification Level: \`${oldGuild.verificationLevel}\` → \`${newGuild.verificationLevel}\``
      );

    if (oldGuild.nsfwLevel !== newGuild.nsfwLevel)
      changes.push(
        `🔞 NSFW Level: \`${oldGuild.nsfwLevel}\` → \`${newGuild.nsfwLevel}\``
      );

    if (!changes.length) return;

    const embed = new EmbedBuilder()
      .setColor(0x7289da)
      .setTitle("⚙️ Server Settings Updated")
      .setDescription(
        `Το server **${newGuild.name}** ενημερώθηκε:\n\n${changes.join("\n")}`
      )
      .setThumbnail(newGuild.iconURL({ dynamic: true }) || "")
      .setFooter({ text: createTimestampFooter() });

    await logChannel.send({ embeds: [embed] });
  });

  // ========== Voice State Update ==========
  client.on("voiceStateUpdate", async (oldState, newState) => {
    const member = newState.member || oldState.member;
    if (!member || member.user.bot) return;

    const logChannel = newState.guild.channels.cache.get(
      process.env.VOICE_STATE_LOG_CHANNEL_ID
    );
    if (!logChannel?.isTextBased()) return;

    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    const logs = [];
    let actionType = null;
    let executor = null;

    if (!oldChannel && newChannel) {
      logs.push(`➕ Μπήκε στο κανάλι <#${newChannel.id}>`);
      actionType = "Join Voice";
    }

    if (oldChannel && !newChannel) {
      logs.push(`➖ Έφυγε από το κανάλι <#${oldChannel.id}>`);
      actionType = "Leave Voice";
    }

    if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
      logs.push(
        `🔁 Μετακινήθηκε από <#${oldChannel.id}> σε <#${newChannel.id}>`
      );
      actionType = "Switch Voice Channel";

      try {
        const audit = await newState.guild.fetchAuditLogs({
          type: AuditLogEvent.MemberMove,
          limit: 1,
        });
        const entry = audit.entries.first();
        if (
          entry?.target?.id === member.id &&
          Date.now() - entry.createdTimestamp < 5000
        ) {
          executor = entry.executor;
          logs.push(`(📤 Μετακινήθηκε από staff)`);
        }
      } catch {}
    }

    if (oldState.serverMute !== newState.serverMute) {
      logs.push(newState.serverMute ? "🔇 Server muted" : "🔊 Server unmuted");
      actionType = "Server Mute";
    }

    if (oldState.serverDeaf !== newState.serverDeaf) {
      logs.push(
        newState.serverDeaf ? "🔈 Server deafened" : "🔈 Server undeafened"
      );
      actionType = "Server Deaf";
    }

    if (oldState.selfMute !== newState.selfMute) {
      logs.push(newState.selfMute ? "🎙️ Self muted" : "🎙️ Self unmuted");
      actionType = "Self Mute";
    }

    if (oldState.selfDeaf !== newState.selfDeaf) {
      logs.push(newState.selfDeaf ? "👂 Self deafened" : "👂 Self undeafened");
      actionType = "Self Deaf";
    }

    if (oldState.selfVideo !== newState.selfVideo) {
      logs.push(newState.selfVideo ? "📹 Camera on" : "📷 Camera off");
      actionType = "Camera Toggle";
    }

    if (oldState.streaming !== newState.streaming) {
      logs.push(
        newState.streaming
          ? "🖥️ Screen share started"
          : "🖥️ Screen share stopped"
      );
      actionType = "Screen Share";
    }

    if (
      oldState.suppress !== newState.suppress &&
      newState.channel?.type === 13
    ) {
      logs.push(newState.suppress ? "🧩 Πήγε στο κοινό" : "🎤 Έγινε speaker");
      actionType = "Stage Toggle";
    }

    if (!logs.length) return;

    let description =
      `👤 Χρήστης <@${member.id}>:\n` + logs.map((l) => `• ${l}`).join("\n");

    if (executor && executor.id !== member.id) {
      description += `\n\n— 😎 —\n👮 Εκτελέστηκε από: <@${executor.id}>`;
    }

    const embed = await handleLogEmbed("voiceStateUpdate", {
      user: member.user,
      member,
      guild: member.guild,
      channel: newChannel || oldChannel || member.guild.systemChannel,
      title: "📞 Voice Log",
      description,
      action: actionType,
    });

    if (executor && executor.id !== member.id) {
      embed.setFooter({
        text: `🧑 Εκτελέστηκε από: ${executor.tag}`,
        iconURL: executor.displayAvatarURL({ dynamic: true }),
      });
    }

    logChannel.send({ embeds: [embed] });
  });
};
