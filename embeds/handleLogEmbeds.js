const { EmbedBuilder } = require("discord.js");
const createTimestampFooter = require("../functions/createTimestampFooter");

module.exports = async (
  type,
  { user, member, guild, channel, title, description = null, emoji = null } = {} // ✅ add default empty object to prevent destructure crash
) => {
  if (!user && member) user = member.user;
  if (!guild && member) guild = member.guild;

  if (!user || !guild || !channel) {
    console.error("⚠️ Missing user, guild, or channel information.");
    return new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Error creating embed")
      .setDescription("Could not retrieve user, guild, or channel.");
  }

  let bannerURL = null;
  try {
    const fetchedUser = await user.fetch();
    bannerURL = fetchedUser.bannerURL({ dynamic: true, size: 1024 });
  } catch (err) {
    console.warn("⚠️ Error fetching user banner:", err);
  }

  if (!member?.roles?.cache?.size) {
    try {
      member = await guild.members.fetch(user.id);
    } catch (err) {
      console.warn("⚠️ Failed to fetch member for roles:", err);
    }
  }

  let roles = "No roles available";
  if (member?.roles?.cache?.size > 0) {
    roles = member.roles.cache
      .filter((role) => role.id !== guild.id)
      .map((role) => `<@&${role.id}>`)
      .join(", ");
  }

  const isBot = user.bot ? "🤖 Bot" : "👤 Human";

  const embed = new EmbedBuilder()
    .setColor(
      type === "guildMemberAdd"
        ? 0x00bfff
        : type === "guildMemberRemove"
        ? 0xff4444
        : 0x3498db
    )
    .setTitle(
      title ||
        (type === "guildMemberAdd"
          ? "👋 Νέο μέλος μπήκε!"
          : type === "guildMemberRemove"
          ? "🚪 Μέλος αποχώρησε"
          : "📋 Log")
    )
    .setDescription(
      description ||
        (type === "guildMemberAdd"
          ? `Καλωσόρισες <@${user.id}> στο **${guild.name}**!`
          : type === "guildMemberRemove"
          ? `<@${user.id}> αποχώρησε από το **${guild.name}**.`
          : null)
    )
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: "👤 Username", value: user.tag, inline: true },
      { name: "🆔", value: user.id, inline: true },
      { name: "🏷️ Mention", value: `<@${user.id}>`, inline: true },
      { name: "🛡️ Roles", value: roles, inline: false },
      {
        name: "📅 Account Created",
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
        inline: true,
      },
      {
        name: "📥 Joined Server",
        value: member?.joinedTimestamp
          ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
          : "Unknown",
        inline: true,
      },
      {
        name: "📍 Channel",
        value: `[#${channel.name}](https://discord.com/channels/${guild.id}/${channel.id})`,
        inline: true,
      },
      { name: "🤖 User Type", value: isBot, inline: true },
      ...(emoji
        ? [{ name: "😀 Reaction Emoji", value: emoji.toString(), inline: true }]
        : [])
    )
    .setImage(
      bannerURL ||
        "https://via.placeholder.com/500x200?text=No+banner+available"
    )
    .setFooter({ text: createTimestampFooter() });

  return embed;
};
/*
module.exports = async ({
  user,
  member,
  guild,
  channel,
  title,
  description = "📌 Event log.",
  emoji = null,
}) => {
  if (!user || !guild || !channel) {
    console.error("⚠️ Missing user, guild, or channel information.");
    return new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Error creating embed")
      .setDescription("Could not retrieve user, guild, or channel.");
  }

  let bannerURL = null;
  try {
    const fetchedUser = await user.fetch();
    bannerURL = fetchedUser.bannerURL({ dynamic: true, size: 1024 });
  } catch (err) {
    console.warn("⚠️ Error fetching user banner:", err);
  }

  if (!member?.roles?.cache?.size) {
    try {
      member = await guild.members.fetch(user.id);
    } catch (err) {
      console.warn("⚠️ Failed to fetch member for roles:", err);
    }
  }

  let roles = "No roles available";
  if (member?.roles?.cache?.size > 0) {
    roles = member.roles.cache
      .filter((role) => role.id !== guild.id)
      .map((role) => `<@&${role.id}>`)
      .join(", ");
  }

  const isBot = user.bot ? "🤖 Bot" : "👤 Human";

  return new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle(title || "📋 Log")
    .setDescription(description)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: "👤 Username", value: user.tag, inline: true },
      { name: "🆔", value: user.id, inline: true },
      { name: "🏷️ Mention", value: `<@${user.id}>`, inline: true },
      { name: "🛡️ Roles", value: roles, inline: false },
      {
        name: "📅 Account Created",
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
        inline: true,
      },
      {
        name: "📥 Joined Server",
        value: member?.joinedTimestamp
          ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
          : "Unknown",
        inline: true,
      },
      {
        name: "📍 Channel",
        value: `[#${channel.name}](https://discord.com/channels/${guild.id}/${channel.id})`,
        inline: true,
      },
      { name: "🤖 User Type", value: isBot, inline: true },
      ...(emoji
        ? [{ name: "😀 Reaction Emoji", value: emoji.toString(), inline: true }]
        : [])
    )
    .setImage(
      bannerURL ||
        "https://via.placeholder.com/500x200?text=No+Banner+Available"
    )
    .setFooter({ text: createTimestampFooter() });
};
*/
